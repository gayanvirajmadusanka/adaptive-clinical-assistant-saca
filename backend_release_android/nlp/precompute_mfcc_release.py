"""
Recompute Warlpiri keyword MFCCs using python_speech_features.
Must be run once before building the Android APK so that the reference features
in keyword_mfcc_android.json use the same computation as audio_warlpiri.py at inference.

Usage:
    python -m backend_release_android.nlp.precompute_mfcc_release

Output: backend_release_android/data/warlpiri/keyword_mfcc_android.json
"""

import json
import math
import os

import numpy as np
import python_speech_features as psf
import scipy.io.wavfile
import scipy.signal

_RELEASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_DATA_DIR    = os.path.join(_RELEASE_DIR, "data")
_WARLPIRI    = os.path.join(_DATA_DIR, "warlpiri")
_RECORDINGS  = os.path.join(_DATA_DIR, "recordings")  # WAV reference recordings

SAMPLE_RATE = 16000
N_MFCC      = 13
WIN_LEN     = 0.128
WIN_STEP    = 0.032
N_FFT       = 2048
N_FILT      = 26
DELTA_N     = 4


def load_wav(path: str) -> np.ndarray | None:
    try:
        sr, data = scipy.io.wavfile.read(path)
        if data.dtype == np.int16:
            data = data.astype(np.float32) / 32768.0
        elif data.dtype == np.int32:
            data = data.astype(np.float32) / 2147483648.0
        elif data.dtype == np.uint8:
            data = (data.astype(np.float32) - 128.0) / 128.0
        else:
            data = data.astype(np.float32)
        if data.ndim > 1:
            data = data.mean(axis=1)
        if sr != SAMPLE_RATE:
            gcd  = math.gcd(sr, SAMPLE_RATE)
            data = scipy.signal.resample_poly(data, SAMPLE_RATE // gcd, sr // gcd)
        return data.astype(np.float32)
    except Exception as e:
        print(f"  ERROR loading {path}: {e}")
        return None


def extract_mfcc(audio: np.ndarray) -> np.ndarray | None:
    if audio is None or len(audio) == 0:
        return None
    try:
        mfcc_raw = psf.mfcc(
            audio, samplerate=SAMPLE_RATE,
            winlen=WIN_LEN, winstep=WIN_STEP,
            numcep=N_MFCC, nfilt=N_FILT, nfft=N_FFT,
            preemph=0.0, appendEnergy=False
        )  # (n_frames, 13)
        delta1 = psf.delta(mfcc_raw, N=DELTA_N)
        delta2 = psf.delta(delta1,   N=DELTA_N)
        return np.vstack([mfcc_raw.T, delta1.T, delta2.T])  # (39, n_frames)
    except Exception as e:
        print(f"  ERROR extracting MFCC: {e}")
        return None


# Mapping: Warlpiri answer keyword → WAV filename (in train_set)
_ANSWER_KEYWORD_WAVS: dict[str, str] = {
    "yuwayi":             "answer_yes_wp.wav",
    "lawa":               "answer_no_wp.wav",
    "wati":               "answer_male_wp.wav",
    "karnta":             "answer_female_wp.wav",
    "kurdu":              "answer_child_wp.wav",
    "mangi":              "answer_youth_wp.wav",
    "kurduwangu":         "answer_adult_wp.wav",
    "purlka":             "answer_elder_wp.wav",
    "jalangu":            "answer_today_wp.wav",
    "pirrarni":           "answer_yesterday_wp.wav",
    "pirrarnijarrakurra": "answer_2_3_days_wp.wav",
    "wiikikurra":         "answer_about_a_week_wp.wav",
    "wiikipanukurra":     "answer_more_than_a_week_wp.wav",
    "witapardu":          "answer_a_little_wp.wav",
    "wiriwiri":           "answer_moderate_wp.wav",
    "wirinyayirni":       "answer_very_bad_wp.wav",
    "kuurrnyinamijuku":   "answer_unbearable_wp.wav",
}


def main():
    keyword_map_path = os.path.join(_WARLPIRI, "keyword_symptom_map.json")
    if not os.path.exists(keyword_map_path):
        print(f"ERROR: {keyword_map_path} not found")
        return

    with open(keyword_map_path, encoding="utf-8") as f:
        keyword_map = json.load(f)

    # find existing keyword_mfcc.json to reuse any pre-computed references
    existing_path = os.path.join(_WARLPIRI, "keyword_mfcc.json")
    if not os.path.exists(existing_path):
        print(f"WARNING: {existing_path} not found — building from WAV recordings only")
        existing = {}
    else:
        with open(existing_path, encoding="utf-8") as f:
            existing = json.load(f)

    train_set = os.path.join(_RECORDINGS, "train_set")
    output    = {}

    print("--- Symptom keywords ---")
    for keyword, symptom in keyword_map.items():
        symptom_file = symptom.replace(" ", "_") + "_wp.wav"

        candidates = [
            os.path.join(train_set, symptom_file),
            os.path.join(train_set, f"{keyword}_wp.wav"),
            os.path.join(_RECORDINGS, symptom_file),
            os.path.join(_RECORDINGS, f"{keyword}_wp.wav"),
        ]

        wav_refs = []
        for wav_path in candidates:
            if os.path.exists(wav_path):
                audio = load_wav(wav_path)
                mfcc  = extract_mfcc(audio)
                if mfcc is not None:
                    wav_refs.append(mfcc.tolist())
                    print(f"  {keyword} ({symptom}): {os.path.basename(wav_path)} → shape {mfcc.shape}")
                break

        if wav_refs:
            output[keyword] = wav_refs[0]
        elif keyword in existing:
            output[keyword] = existing[keyword]
            print(f"  {keyword}: reusing librosa reference (WAV not found for '{symptom}')")
        else:
            print(f"  WARNING: no reference for keyword '{keyword}' (symptom: '{symptom}') — skipping")

    print("\n--- Answer keywords ---")
    for keyword, wav_name in _ANSWER_KEYWORD_WAVS.items():
        wav_path = os.path.join(train_set, wav_name)
        if os.path.exists(wav_path):
            audio = load_wav(wav_path)
            mfcc  = extract_mfcc(audio)
            if mfcc is not None:
                output[keyword] = mfcc.tolist()
                print(f"  {keyword}: {wav_name} → shape {mfcc.shape}")
            else:
                print(f"  WARNING: MFCC extraction failed for '{keyword}'")
        else:
            print(f"  WARNING: '{wav_name}' not found — skipping '{keyword}'")

    out_path = os.path.join(_WARLPIRI, "keyword_mfcc_android.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f)

    n_symptom = len(keyword_map)
    n_answer  = len(_ANSWER_KEYWORD_WAVS)
    print(f"\nWrote {len(output)}/{n_symptom + n_answer} keyword references to {out_path}")
    missing = [k for k in keyword_map if k not in output]
    if missing:
        print(f"MISSING symptom references: {missing}")


if __name__ == "__main__":
    main()
