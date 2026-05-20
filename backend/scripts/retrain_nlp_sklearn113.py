"""
Re-train the NLP symptom classifier and save Android-compatible pickles.

Run this with a Python environment that has scikit-learn==1.1.3 installed so
the resulting pickles can be loaded by Chaquopy's Python 3.8 environment on
Android (which resolves to sklearn 1.1.3 from the Chaquopy mirror).

Output files (relative to backend/models/):
  nlp_symptom_classifier_android.pkl
  nlp_tfidf_vectorizer_android.pkl
  nlp_label_encoder_android.pkl

Usage:
  python -m venv /tmp/venv113
  /tmp/venv113/bin/pip install scikit-learn==1.1.3 pandas rapidfuzz numpy
  /tmp/venv113/bin/python backend/scripts/retrain_nlp_sklearn113.py
"""

import os
import json
import pickle
import re

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from rapidfuzz import process, fuzz

_BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_CSV_PATH  = os.path.join(_BASE_DIR, "data", "SYNAPSE.csv")
_MAP_PATH  = os.path.join(_BASE_DIR, "data", "warlpiri", "symptom_map.json")
_SYN_PATH  = os.path.join(_BASE_DIR, "data", "warlpiri", "synonym_map.json")
_OUT_DIR   = os.path.join(_BASE_DIR, "models")

_MATCH_THRESHOLD = 60


def _clean(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _load_target_vocab() -> list:
    with open(_MAP_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [v["en"] for v in data.values()]


def _load_synonym_map() -> dict:
    with open(_SYN_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _build_training_data(df: pd.DataFrame, target_vocab: list, synonym_map: dict) -> tuple:
    X, y = [], []

    for raw in df["Symptoms"].dropna():
        for part in raw.split(","):
            cleaned = _clean(part)
            if not cleaned or len(cleaned) <= 2:
                continue
            result = process.extractOne(cleaned, target_vocab, scorer=fuzz.token_sort_ratio)
            if not result or result[1] < _MATCH_THRESHOLD:
                continue
            label = result[0]
            X.append(cleaned)
            y.append(label)
            words = cleaned.split()
            if len(words) > 1:
                X.append(words[-1]);           y.append(label)
                X.append(" ".join(words[:2])); y.append(label)

    for informal, label in synonym_map.items():
        if label in target_vocab:
            X.append(informal)
            y.append(label)
            words = informal.split()
            if len(words) > 1:
                X.append(words[0]);  y.append(label)
                X.append(words[-1]); y.append(label)

    return X, y


def main():
    import sklearn
    print(f"scikit-learn version: {sklearn.__version__}")

    if not os.path.exists(_CSV_PATH):
        raise FileNotFoundError(f"SYNAPSE.csv not found at {_CSV_PATH}")

    target_vocab = _load_target_vocab()
    synonym_map  = _load_synonym_map()
    print(f"target vocabulary: {len(target_vocab)} symptom labels")

    df = pd.read_csv(_CSV_PATH)
    X, y = _build_training_data(df, target_vocab, synonym_map)
    print(f"training samples: {len(X)}  unique labels: {len(set(y))}")

    le    = LabelEncoder()
    y_enc = le.fit_transform(y)

    X_train, _, y_train, _ = train_test_split(
        X, y_enc, test_size=0.2, random_state=42, stratify=y_enc
    )

    tfidf = TfidfVectorizer(ngram_range=(1, 2), max_features=20000, sublinear_tf=True)
    X_tr  = tfidf.fit_transform(X_train)

    clf = RandomForestClassifier(n_estimators=200, random_state=42)
    clf.fit(X_tr, y_train)

    os.makedirs(_OUT_DIR, exist_ok=True)
    out_clf   = os.path.join(_OUT_DIR, "nlp_symptom_classifier_android.pkl")
    out_tfidf = os.path.join(_OUT_DIR, "nlp_tfidf_vectorizer_android.pkl")
    out_le    = os.path.join(_OUT_DIR, "nlp_label_encoder_android.pkl")

    with open(out_clf,   "wb") as f: pickle.dump(clf,   f, protocol=2)
    with open(out_tfidf, "wb") as f: pickle.dump(tfidf, f, protocol=2)
    with open(out_le,    "wb") as f: pickle.dump(le,    f, protocol=2)

    print(f"saved: {out_clf}")
    print(f"saved: {out_tfidf}")
    print(f"saved: {out_le}")


if __name__ == "__main__":
    main()
