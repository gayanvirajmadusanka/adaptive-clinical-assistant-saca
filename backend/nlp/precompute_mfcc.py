import os
import json
import numpy as np
import librosa

# paths
_BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_AUDIO_DIR = os.path.join(_BASE_DIR, "data", "warlpiri_audio")
_OUT_PATH  = os.path.join(_BASE_DIR, "data", "warlpiri", "keyword_mfcc.json")

SAMPLE_RATE = 16000
N_MFCC      = 13


def _compute_mfcc(audio_path: str) -> list | None:
    """
    Load a WAV file, trim silence, and compute MFCC features.
    Returns the MFCC matrix as a nested list for JSON serialisation.
    :param audio_path: path to WAV file
    :return: MFCC as list of lists, or None on failure
    """
    try:
        audio, _ = librosa.load(audio_path, sr=SAMPLE_RATE, mono=True)
        audio, _ = librosa.effects.trim(audio, top_db=20)  # strip silence

        if len(audio) == 0:
            print(f"  skipping {audio_path} - empty after trim")
            return None

        mfcc = librosa.feature.mfcc(y=audio, sr=SAMPLE_RATE, n_mfcc=N_MFCC)
        return mfcc.tolist()  # (n_mfcc, frames) → serialisable list

    except Exception as e:
        print(f"  failed {audio_path}: {e}")
        return None


def precompute():
    """
    Reads all WAV files from data/warlpiri_audio/, computes MFCC for each,
    and saves the results to data/warlpiri/keyword_mfcc.json.

    WAV filename (without extension) is used as the keyword key.
    e.g. rdurrurlpu.wav → keyword "rdurrurlpu"

    Run once after recording all reference audio files:
        python -m backend.nlp.precompute_mfcc
    """
    if not os.path.exists(_AUDIO_DIR):
        print(f"audio directory not found: {_AUDIO_DIR}")
        print("create backend/data/warlpiri_audio/ and add WAV files first")
        return

    wav_files = [f for f in os.listdir(_AUDIO_DIR) if f.endswith(".wav")]
    if not wav_files:
        print(f"no WAV files found in {_AUDIO_DIR}")
        return

    print(f"found {len(wav_files)} WAV files")

    keyword_mfcc = {}
    for filename in sorted(wav_files):
        keyword   = os.path.splitext(filename)[0]  # strip .wav
        full_path = os.path.join(_AUDIO_DIR, filename)
        print(f"  processing {filename}...")
        mfcc = _compute_mfcc(full_path)
        if mfcc is not None:
            keyword_mfcc[keyword] = mfcc
            print(f"    saved keyword: {keyword}")

    if not keyword_mfcc:
        print("no valid MFCCs computed")
        return

    os.makedirs(os.path.dirname(_OUT_PATH), exist_ok=True)
    with open(_OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(keyword_mfcc, f)

    print(f"\ndone. {len(keyword_mfcc)} keywords saved to {_OUT_PATH}")


if __name__ == "__main__":
    precompute()
