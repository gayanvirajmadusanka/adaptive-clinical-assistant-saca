"""
Warlpiri Audio Recognition Module - SACA
Developer: Fathima Hamra Imam (105708480)

CNN-DTW keyword spotting for Warlpiri audio input.

Why not full ASR: No transcribed Warlpiri speech corpus exists.
Warlpiri has ~3,000 native speakers and no standardised orthography.
The DoReCo corpus provides isolated community recordings used as
reference audio - not ASR training data.

Approach validated by:
    Van der Westhuizen et al. (2022) - ASR-free keyword spotting
    achieves operationally useful recognition for zero-resource
    languages using CNN-DTW alignment on small reference sets.

Process:
    1. Extract MFCC features from incoming audio (librosa)
    2. Extract MFCC features from each reference recording
    3. Compute DTW alignment distance for each reference
    4. Return closest match with confidence score

Reference audio files go in:
    backend/data/warlpiri_audio/
    Named to match AUDIO_REFERENCE_MAP keys below.

Input:  path to WAV file from frontend
Output: dict with translated_text, confidence, match_type
"""

import os
import numpy as np
import librosa
from scipy.spatial.distance import cdist

BASE_DIR      = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REFERENCE_DIR = os.path.join(BASE_DIR, "data", "warlpiri_audio")

# Maps reference WAV filename to English translation
# Record one WAV per phrase, name it to match the key
# Place all files in backend/data/warlpiri_audio/
AUDIO_REFERENCE_MAP = {
    "ngarru_wiya.wav":        "I have a headache",
    "mayi_wita.wav":          "I have stomach pain",
    "yapa_wiri.wav":          "I feel very sick",
    "kari_nyinami.wav":       "I cannot breathe",
    "jaru_wiri.wav":          "I have chest pain",
    "ngaju_pakarninja.wav":   "I am vomiting",
    "ngaju_wiri.wav":         "I have fever",
    "pirli_wiri.wav":         "I have back pain",
    "kurdu_wiri.wav":         "my child is sick",
    "ngaju_yarlkurra.wav":    "I feel dizzy",
    "maju_karrinja.wav":      "I feel weak",
    "ngaju_karlarra.wav":     "I feel cold",
    "yapa_karlarra.wav":      "my body is cold",
    "ngarru_wirinyayirni.wav":"I have severe headache",
    "mayi_wiri.wav":          "I have severe stomach pain",
}

DTW_THRESHOLD = 200.0
N_MFCC        = 13
SAMPLE_RATE   = 16000


def _extract_mfcc(audio_path: str) -> np.ndarray:
    """
    Loads a WAV file and extracts MFCC features.

    Args:
        audio_path: Path to WAV file

    Returns:
        MFCC matrix of shape (time_frames, n_mfcc)
    """
    y, _ = librosa.load(audio_path, sr=SAMPLE_RATE)
    mfcc = librosa.feature.mfcc(y=y, sr=SAMPLE_RATE, n_mfcc=N_MFCC)
    return mfcc.T


def _dtw_distance(seq1: np.ndarray, seq2: np.ndarray) -> float:
    """
    Computes Dynamic Time Warping distance between two MFCC sequences.
    Lower distance means higher similarity.

    Args:
        seq1: MFCC matrix (time, features)
        seq2: MFCC matrix (time, features)

    Returns:
        DTW alignment distance
    """
    cost  = cdist(seq1, seq2, metric="euclidean")
    n, m  = cost.shape
    dtw   = np.full((n + 1, m + 1), np.inf)
    dtw[0, 0] = 0.0

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            dtw[i, j] = cost[i-1, j-1] + min(
                dtw[i-1, j],
                dtw[i, j-1],
                dtw[i-1, j-1]
            )
    return float(dtw[n, m])


def match_warlpiri_audio(audio_path: str) -> dict:
    """
    Matches incoming Warlpiri audio against DoReCo reference recordings
    using MFCC features and DTW alignment scoring.

    Args:
        audio_path: Path to incoming WAV file from frontend

    Returns:
        dict:
            original_phrase  - matched reference key (phrase name)
            translated_text  - English equivalent
            confidence       - normalised confidence 0.0-1.0
            match_type       - "audio_dtw" or "no_match"
    """
    if not os.path.exists(audio_path):
        return {
            "original_phrase":  None,
            "translated_text":  None,
            "confidence":       0.0,
            "match_type":       "no_match",
            "error":            f"Audio file not found: {audio_path}"
        }

    if not os.path.exists(REFERENCE_DIR):
        return {
            "original_phrase":  None,
            "translated_text":  None,
            "confidence":       0.0,
            "match_type":       "no_match",
            "error":            f"Reference audio folder not found: {REFERENCE_DIR}"
        }

    try:
        input_mfcc = _extract_mfcc(audio_path)
    except Exception as e:
        return {
            "original_phrase":  None,
            "translated_text":  None,
            "confidence":       0.0,
            "match_type":       "no_match",
            "error":            f"MFCC extraction failed: {e}"
        }

    best_key         = None
    best_distance    = float("inf")
    best_translation = None

    for ref_filename, translation in AUDIO_REFERENCE_MAP.items():
        ref_path = os.path.join(REFERENCE_DIR, ref_filename)
        if not os.path.exists(ref_path):
            continue
        try:
            ref_mfcc = _extract_mfcc(ref_path)
            distance = _dtw_distance(input_mfcc, ref_mfcc)
            if distance < best_distance:
                best_distance    = distance
                best_key         = ref_filename
                best_translation = translation
        except Exception:
            continue

    if best_key is None or best_distance > DTW_THRESHOLD:
        return {
            "original_phrase":  None,
            "translated_text":  None,
            "confidence":       0.0,
            "match_type":       "no_match"
        }

    # normalise to confidence score - lower distance = higher confidence
    confidence = round(max(0.0, 1.0 - (best_distance / DTW_THRESHOLD)), 2)
    phrase_name = best_key.replace(".wav", "").replace("_", " ")

    return {
        "original_phrase":  phrase_name,
        "translated_text":  best_translation,
        "confidence":       confidence,
        "match_type":       "audio_dtw",
        "dtw_distance":     round(best_distance, 2)
    }