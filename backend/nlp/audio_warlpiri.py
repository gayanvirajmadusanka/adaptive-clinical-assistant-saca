import json
import os

import librosa
import numpy as np
import webrtcvad

_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_DATA_DIR = os.path.join(_BASE_DIR, "data", "warlpiri")

SAMPLE_RATE         = 16000
N_MFCC              = 13
VAD_AGGRESSIVENESS  = 2   # 0-3, higher = more aggressive filtering
VAD_FRAME_DURATION  = 30  # ms
MIN_SEGMENT_DURATION = 0.15  # seconds
DTW_THRESHOLD       = 150.0


def _load(filename: str) -> dict:
    path = os.path.join(_DATA_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# load data at module startup - fails fast if files are missing
KEYWORD_MFCC        = _load("keyword_mfcc.json")
KEYWORD_SYMPTOM_MAP = _load("keyword_symptom_map.json")

# convert MFCC lists to numpy arrays once at load time
_KEYWORD_REFS = {
    keyword: np.array(mfcc_list)
    for keyword, mfcc_list in KEYWORD_MFCC.items()
}


def _extract_mfcc(audio: np.ndarray, sr: int = SAMPLE_RATE) -> np.ndarray | None:
    """
    Extract MFCC matrix from an audio array.
    :param audio: float32 audio array
    :param sr: sample rate
    :return: (n_mfcc, frames) MFCC matrix or None on failure
    """
    if len(audio) == 0:
        return None
    try:
        return librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=N_MFCC)
    except Exception as e:
        print(f"mfcc extraction failed: {e}")
        return None


def _dtw_distance(seq1: np.ndarray, seq2: np.ndarray) -> float:
    """
    Compute normalised DTW distance between two MFCC matrices.
    Normalised by (n+m) to be independent of sequence length.
    seq1, seq2 are (n_mfcc, frames) matrices.
    :param seq1: reference MFCC matrix
    :param seq2: query MFCC matrix
    :return: normalised DTW distance
    """
    s1 = seq1.T  # (frames, n_mfcc)
    s2 = seq2.T
    n, m = len(s1), len(s2)

    cost = np.full((n, m), np.inf)
    cost[0, 0] = np.linalg.norm(s1[0] - s2[0])

    for i in range(1, n):
        cost[i, 0] = cost[i - 1, 0] + np.linalg.norm(s1[i] - s2[0])
    for j in range(1, m):
        cost[0, j] = cost[0, j - 1] + np.linalg.norm(s1[0] - s2[j])
    for i in range(1, n):
        for j in range(1, m):
            cost[i, j] = np.linalg.norm(s1[i] - s2[j]) + min(
                cost[i - 1, j],
                cost[i, j - 1],
                cost[i - 1, j - 1]
            )

    # normalise by path length to handle variable duration recordings
    return cost[n - 1, m - 1] / (n + m)


def _segment_audio(audio: np.ndarray, sr: int = SAMPLE_RATE) -> list:
    """
    Use WebRTC VAD to split continuous speech into word/phrase segments.
    Filters out silence and background noise before DTW matching.
    :param audio: float32 audio array
    :param sr: sample rate
    :return: list of audio segment arrays
    """
    vad          = webrtcvad.Vad(VAD_AGGRESSIVENESS)
    frame_length = int(sr * VAD_FRAME_DURATION / 1000)
    min_samples  = int(MIN_SEGMENT_DURATION * sr)
    segments     = []
    current      = []

    for i in range(0, len(audio) - frame_length, frame_length):
        frame       = audio[i:i + frame_length]
        frame_bytes = (frame * 32768).astype(np.int16).tobytes()
        try:
            is_speech = vad.is_speech(frame_bytes, sr)
        except Exception:
            is_speech = False

        if is_speech:
            current.extend(frame)
        else:
            if len(current) >= min_samples:
                segments.append(np.array(current, dtype=np.float32))
            current = []

    if len(current) >= min_samples:
        segments.append(np.array(current, dtype=np.float32))

    return segments


def _match_segment(segment: np.ndarray) -> tuple | None:
    """
    Match one audio segment against all keyword references using DTW.
    :param segment: float32 audio array for one speech segment
    :return: (keyword, distance) tuple if match found, None otherwise
    """
    mfcc = _extract_mfcc(segment)
    if mfcc is None:
        return None

    best_keyword  = None
    best_distance = float("inf")

    for keyword, ref_mfcc in _KEYWORD_REFS.items():
        dist = _dtw_distance(mfcc, ref_mfcc)
        if dist < best_distance:
            best_distance = dist
            best_keyword  = keyword

    if best_distance <= DTW_THRESHOLD:
        return best_keyword, best_distance
    return None


def _keyword_to_symptom(keyword: str) -> str | None:
    """
    Map a matched Warlpiri keyword to its English symptom string.
    Uses keyword_symptom_map.json which maps directly to the 33
    symptom vocabulary expected by the ML classifier.
    :param keyword: matched Warlpiri keyword string
    :return: English symptom string or None
    """
    return KEYWORD_SYMPTOM_MAP.get(keyword)


def recognize(audio_path: str) -> dict:
    """
    Recognise Warlpiri symptom keywords from continuous speech audio.

    Pipeline:
        1. Load and trim silence from audio
        2. WebRTC VAD segments speech into word units
        3. MFCC extracted per segment
        4. DTW distance against pre-computed keyword references
        5. Matched keywords mapped to English symptom strings

    :param audio_path: path to WAV audio file
    :return: dict with recognized flag, symptoms list, and confidence score
    """
    base = {"input_type": "audio_warlpiri", "audio_path": audio_path}

    if not _KEYWORD_REFS:
        return {**base, "recognized": False,
                "error": "no keyword references loaded - run precompute_mfcc.py first"}

    if not os.path.exists(audio_path):
        return {**base, "recognized": False,
                "error": f"audio file not found: {audio_path}"}

    try:
        audio, sr = librosa.load(audio_path, sr=SAMPLE_RATE, mono=True)
        audio, _  = librosa.effects.trim(audio, top_db=20)
    except Exception as e:
        return {**base, "recognized": False, "error": f"failed to load audio: {e}"}

    if len(audio) == 0:
        return {**base, "recognized": False, "error": "audio is empty or silent"}

    segments = _segment_audio(audio, sr)
    if not segments:
        return {**base, "recognized": False,
                "error": "no speech detected - please speak clearly and try again"}

    # match each segment and keep best distance per keyword
    matched_keywords = {}
    for segment in segments:
        result = _match_segment(segment)
        if result:
            keyword, distance = result
            if keyword not in matched_keywords or distance < matched_keywords[keyword]:
                matched_keywords[keyword] = distance

    if not matched_keywords:
        return {
            **base,
            "recognized":      False,
            "matched_keywords": {},
            "symptoms":        [],
            "confidence":      0.0,
            "message":         "could not recognise any Warlpiri keywords - please try again"
        }

    # map keywords to English symptoms
    symptoms       = []
    keyword_scores = {}
    for keyword, distance in matched_keywords.items():
        symptom = _keyword_to_symptom(keyword)
        if symptom and symptom not in symptoms:
            symptoms.append(symptom)
        keyword_scores[keyword] = round(distance, 3)

    best_distance = min(matched_keywords.values())
    confidence    = round(max(0.0, 1.0 - (best_distance / DTW_THRESHOLD)), 3)

    return {
        **base,
        "recognized":       True,
        "matched_keywords": keyword_scores,
        "symptoms":         symptoms,
        "confidence":       confidence,
        "segments_detected": len(segments),
        "segments_matched":  len(matched_keywords)
    }


def list_keywords() -> list:
    """Returns all loaded keyword reference names."""
    return list(_KEYWORD_REFS.keys())
