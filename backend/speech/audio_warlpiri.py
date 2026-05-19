import json
import os

import librosa
import numpy as np
import webrtcvad

_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_DATA_DIR = os.path.join(_BASE_DIR, "data", "warlpiri")

SAMPLE_RATE          = 16000
N_MFCC               = 13      # base MFCC coefficients
VAD_AGGRESSIVENESS   = 2       # 0-3, higher = more aggressive silence filtering
VAD_FRAME_DURATION   = 30      # ms per VAD frame
MIN_SEGMENT_DURATION = 0.15    # seconds - discard segments shorter than this
DTW_THRESHOLD        = 200.0   # increased to account for 39-feature vectors
FRAME_RATIO_LIMIT    = 3.0     # skip DTW if frame counts differ by more than this ratio


def _load(filename: str) -> dict:
    path = os.path.join(_DATA_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# load data at module startup - fails fast if files are missing
KEYWORD_MFCC        = _load("keyword_mfcc.json")
KEYWORD_SYMPTOM_MAP = _load("keyword_symptom_map.json")

# convert to numpy arrays once at load time
# supports both single reference (list of lists) and
# multi-reference (list of list of lists) formats
_KEYWORD_REFS: dict[str, list[np.ndarray]] = {}
for keyword, data in KEYWORD_MFCC.items():
    try:
        arr = np.array(data)
        if arr.ndim == 2:
            _KEYWORD_REFS[keyword] = [arr]
        elif arr.ndim == 3:
            _KEYWORD_REFS[keyword] = [arr[i] for i in range(arr.shape[0])]
    except ValueError:
        # inhomogeneous references (different frame lengths) - load individually
        if isinstance(data[0][0], list):
            _KEYWORD_REFS[keyword] = [np.array(ref) for ref in data]
        else:
            _KEYWORD_REFS[keyword] = [np.array(data)]


def _extract_mfcc(audio: np.ndarray, sr: int = SAMPLE_RATE) -> np.ndarray | None:
    """
    Extract 39-dimensional MFCC feature matrix from audio.
    Combines 13 MFCC + 13 delta + 13 delta-delta coefficients.
    Delta features capture temporal dynamics improving DTW accuracy
    over static MFCC alone for keyword spotting tasks.
    :param audio: float32 audio array
    :param sr: sample rate
    :return: (39, frames) feature matrix or None on failure
    """
    if len(audio) == 0:
        return None
    try:
        mfcc  = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=N_MFCC)
        delta = librosa.feature.delta(mfcc)
        delta2 = librosa.feature.delta(mfcc, order=2)
        return np.vstack([mfcc, delta, delta2])  # (39, frames)
    except Exception as e:
        print(f"mfcc extraction failed: {e}")
        return None


def _dtw_distance(seq1: np.ndarray, seq2: np.ndarray) -> float:
    """
    Compute normalised DTW distance between two feature matrices.
    Normalised by (n+m) to be independent of sequence length.
    Uses Euclidean frame distance as the local cost function.
    :param seq1: (n_features, frames_1) reference matrix
    :param seq2: (n_features, frames_2) query matrix
    :return: normalised DTW distance
    """
    s1 = seq1.T  # (frames_1, n_features)
    s2 = seq2.T  # (frames_2, n_features)
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

    return cost[n - 1, m - 1] / (n + m)


def _segment_audio(audio: np.ndarray, sr: int = SAMPLE_RATE) -> list:
    """
    Use WebRTC VAD to split continuous speech into word/phrase segments.
    Processes audio in 30ms frames, grouping consecutive speech frames
    into segments and discarding segments below minimum duration.
    :param audio: float32 audio array
    :param sr: sample rate
    :return: list of float32 audio segment arrays
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


def _match_segment(query_mfcc: np.ndarray) -> tuple[str, float] | None:
    """
    Match a query MFCC matrix against all keyword references using DTW.
    Supports multiple references per keyword - takes minimum distance.
    Applies frame ratio pre-filter to skip obviously mismatched keywords
    before running expensive O(n*m) DTW computation.
    :param query_mfcc: (n_features, frames) query feature matrix
    :return: (keyword, distance) tuple if best match is below threshold, else None
    """
    query_frames  = query_mfcc.shape[1]
    best_keyword  = None
    best_distance = float("inf")

    for keyword, ref_list in _KEYWORD_REFS.items():
        for ref_mfcc in ref_list:
            ref_frames = ref_mfcc.shape[1]

            # fast pre-filter: skip DTW if frame counts are too different
            # a word spoken twice as slowly should still match, but
            # a 0.2s segment cannot match a 2.0s reference
            ratio = max(query_frames, ref_frames) / max(min(query_frames, ref_frames), 1)
            if ratio > FRAME_RATIO_LIMIT:
                continue

            dist = _dtw_distance(query_mfcc, ref_mfcc)
            if dist < best_distance:
                best_distance = dist
                best_keyword  = keyword

    if best_distance <= DTW_THRESHOLD:
        return best_keyword, best_distance
    return None


def _distance_to_confidence(distance: float) -> float:
    """
    Convert DTW distance to a confidence score in [0, 1].
    Uses sigmoid normalisation centred at half the threshold,
    giving a meaningful probability-like score rather than
    linear scaling which is sensitive to threshold choice.
    :param distance: raw DTW distance
    :return: confidence score
    """
    # sigmoid: score approaches 1 as distance approaches 0,
    # approaches 0 as distance approaches threshold
    centre = DTW_THRESHOLD / 2.0
    scale  = DTW_THRESHOLD / 8.0
    score  = 1.0 / (1.0 + np.exp((distance - centre) / scale))
    return round(float(score), 3)


def recognize(audio_path: str) -> dict:
    """
    Recognise Warlpiri symptom keywords from continuous speech audio.

    Pipeline:
        1. Load WAV and trim leading/trailing silence
        2. WebRTC VAD segments speech into isolated word units
        3. 39-dim MFCC + delta + delta-delta features extracted per segment
        4. DTW matching against pre-computed keyword references
           with frame ratio pre-filter and multi-reference support
        5. Best matching keywords mapped to English symptom strings
           via keyword_symptom_map.json

    :param audio_path: path to WAV audio file
    :return: dict with recognized flag, symptoms list, confidence, and debug info
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

    # extract features and match each segment
    # keep best distance per keyword across all segments
    matched_keywords: dict[str, float] = {}
    for segment in segments:
        mfcc = _extract_mfcc(segment)
        if mfcc is None:
            continue
        result = _match_segment(mfcc)
        if result:
            keyword, distance = result
            if keyword not in matched_keywords or distance < matched_keywords[keyword]:
                matched_keywords[keyword] = distance

    if not matched_keywords:
        return {
            **base,
            "recognized":       False,
            "matched_keywords": {},
            "symptoms":         [],
            "confidence":       0.0,
            "message":          "could not recognise any Warlpiri keywords - please try again"
        }

    # map matched keywords to English symptom strings
    symptoms       = []
    keyword_scores = {}
    for keyword, distance in matched_keywords.items():
        symptom = KEYWORD_SYMPTOM_MAP.get(keyword)
        if symptom and symptom not in symptoms:
            symptoms.append(symptom)
        keyword_scores[keyword] = round(distance, 3)

    best_distance = min(matched_keywords.values())
    confidence    = _distance_to_confidence(best_distance)

    return {
        **base,
        "recognized":        True,
        "matched_keywords":  keyword_scores,
        "symptoms":          symptoms,
        "confidence":        confidence,
        "segments_detected": len(segments),
        "segments_matched":  len(matched_keywords)
    }


def list_keywords() -> list:
    """Returns all loaded keyword reference names."""
    return list(_KEYWORD_REFS.keys())
