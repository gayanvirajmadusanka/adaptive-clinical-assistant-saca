"""
Precompute MFCC features from Warlpiri reference recordings.
Reads WAV files from recordings/train_set/ which are named by English symptom
(e.g. fever_wp.wav) and stores features under the Warlpiri keyword
(e.g. rdurrurlpu) using keyword_symptom_map.json as the bridge.

Also processes answer keyword WAV files (answer_yes_wp.wav etc) using
the answer keyword map defined here.

Run once after pulling the latest recordings:
    python -m backend.nlp.precompute_mfcc
"""

import json
import os

import librosa
import numpy as np

_BASE_DIR   = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../backend")
_TRAIN_DIR  = os.path.join(_BASE_DIR, "data", "recordings", "train_set")
_DATA_DIR   = os.path.join(_BASE_DIR, "data", "warlpiri")
_KSM_PATH   = os.path.join(_DATA_DIR, "keyword_symptom_map.json")
_OUT_PATH   = os.path.join(_DATA_DIR, "keyword_mfcc.json")

SAMPLE_RATE = 16000
N_MFCC      = 13

# answer keyword WAV name -> Warlpiri keyword
# bridges answer WAV filenames to the keywords audio_warlpiri.py expects
_ANSWER_WAV_TO_KEYWORD = {
    "answer_yes_wp.wav":              "yuwayi",
    "answer_no_wp.wav":               "lawa",
    "answer_a_little_wp.wav":         "witapardu",
    "answer_moderate_wp.wav":         "wiriwiri",
    "answer_very_bad_wp.wav":         "wirinyayirni",
    "answer_unbearable_wp.wav":       "kuurrnyinamijuku",
    "answer_today_wp.wav":            "jalangu",
    "answer_yesterday_wp.wav":        "pirrarni",
    "answer_2_3_days_wp.wav":         "pirrarnijarrakurra",
    "answer_about_a_week_wp.wav":     "wiikikurra",
    "answer_more_than_a_week_wp.wav": "wiikipanukurra",
    "answer_male_wp.wav":             "wati",
    "answer_female_wp.wav":           "karnta",
    "answer_child_wp.wav":            "kurdu",
    "answer_youth_wp.wav":            "mangi",
    "answer_adult_wp.wav":            "kurduwangu",
    "answer_elder_wp.wav":            "purlka",
    "answer_none_wp.wav":             "lawa",
}


def _compute_mfcc(audio_path: str) -> list | None:
    """
    Load WAV, trim silence, compute 39-dimensional MFCC features.
    13 MFCC + 13 delta + 13 delta-delta = 39 features per frame.
    Returns feature matrix as nested list for JSON serialisation.
    :param audio_path: path to WAV file
    :return: (39, frames) as list of lists, or None on failure
    """
    try:
        audio, _ = librosa.load(audio_path, sr=SAMPLE_RATE, mono=True)
        audio, _ = librosa.effects.trim(audio, top_db=20)

        if len(audio) == 0:
            print(f"  skipping {os.path.basename(audio_path)} - empty after trim")
            return None

        mfcc   = librosa.feature.mfcc(y=audio, sr=SAMPLE_RATE, n_mfcc=N_MFCC)
        delta  = librosa.feature.delta(mfcc)
        delta2 = librosa.feature.delta(mfcc, order=2)

        return np.vstack([mfcc, delta, delta2]).tolist()  # (39, frames)

    except Exception as e:
        print(f"  failed {os.path.basename(audio_path)}: {e}")
        return None


def _build_symptom_to_keyword(ksm: dict) -> dict:
    """
    Build reverse map from English symptom to Warlpiri keyword.
    keyword_symptom_map maps keyword -> symptom.
    We need symptom -> keyword to find the right WAV file.
    Where multiple keywords map to same symptom, first one wins.
    :param ksm: keyword_symptom_map dict
    :return: dict of {english_symptom: warlpiri_keyword}
    """
    reverse = {}
    for keyword, symptom in ksm.items():
        if symptom not in reverse:
            reverse[symptom] = keyword
    return reverse


def precompute():
    """
    Process all Warlpiri WAV files from recordings/train_set/ and compute
    39-dimensional MFCC features for each keyword.

    Symptom WAV files (fever_wp.wav) are mapped to keywords (rdurrurlpu)
    via keyword_symptom_map.json in reverse.

    Answer WAV files (answer_yes_wp.wav) are mapped to keywords (yuwayi)
    via _ANSWER_WAV_TO_KEYWORD.

    Results saved to data/warlpiri/keyword_mfcc.json.
    """
    if not os.path.exists(_TRAIN_DIR):
        print(f"train_set directory not found: {_TRAIN_DIR}")
        return

    with open(_KSM_PATH, encoding="utf-8") as f:
        keyword_symptom_map = json.load(f)

    # reverse map: "fever" -> "rdurrurlpu"
    symptom_to_keyword = _build_symptom_to_keyword(keyword_symptom_map)

    wav_files = [f for f in os.listdir(_TRAIN_DIR) if f.endswith(".wav")]
    if not wav_files:
        print(f"no WAV files found in {_TRAIN_DIR}")
        return

    print(f"found {len(wav_files)} WAV files in train_set/")
    print(f"symptom keywords to process: {len(symptom_to_keyword)}")
    print(f"answer keywords to process:  {len(_ANSWER_WAV_TO_KEYWORD)}")

    keyword_mfcc = {}

    # process symptom keywords
    # map fever_wp.wav -> "fever" -> "rdurrurlpu"
    print("\nprocessing symptom keywords...")
    for symptom, keyword in sorted(symptom_to_keyword.items()):
        # Yoshani's naming: replace spaces with underscores + _wp.wav
        wav_name = symptom.replace(" ", "_") + "_wp.wav"
        wav_path = os.path.join(_TRAIN_DIR, wav_name)

        if not os.path.exists(wav_path):
            print(f"  missing: {wav_name} (keyword: {keyword})")
            continue

        mfcc = _compute_mfcc(wav_path)
        if mfcc is not None:
            keyword_mfcc[keyword] = mfcc
            print(f"  {wav_name} -> {keyword} ({symptom})")

    # process answer keywords
    # map answer_yes_wp.wav -> "yuwayi"
    print("\nprocessing answer keywords...")
    for wav_name, keyword in sorted(_ANSWER_WAV_TO_KEYWORD.items()):
        wav_path = os.path.join(_TRAIN_DIR, wav_name)

        if not os.path.exists(wav_path):
            print(f"  missing: {wav_name} (keyword: {keyword})")
            continue

        mfcc = _compute_mfcc(wav_path)
        if mfcc is not None:
            # if keyword already exists (e.g. lawa from answer_no and answer_none)
            # store as list of multiple references for better matching
            if keyword in keyword_mfcc:
                existing = keyword_mfcc[keyword]
                if isinstance(existing[0][0], list):
                    keyword_mfcc[keyword].append(mfcc)
                else:
                    keyword_mfcc[keyword] = [existing, mfcc]
                print(f"  {wav_name} -> {keyword} (added as second reference)")
            else:
                keyword_mfcc[keyword] = mfcc
                print(f"  {wav_name} -> {keyword}")

    if not keyword_mfcc:
        print("\nno MFCCs computed - check WAV files")
        return

    with open(_OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(keyword_mfcc, f)

    print(f"\ndone. {len(keyword_mfcc)} keywords saved to keyword_mfcc.json")
    print("39-dimensional features: 13 MFCC + 13 delta + 13 delta-delta")


if __name__ == "__main__":
    precompute()
