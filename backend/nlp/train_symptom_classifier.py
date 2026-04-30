"""
NLP Symptom Classifier Training - SACA
Developer: Fathima Hamra Imam (105708480)

Trains a TF-IDF + Random Forest classifier on Synapse symptom data.
This model is used as the Stage 2 fallback in symptom extraction
when keyword matching fails or returns low confidence.

The model maps informal symptom descriptions to standardised
Synapse vocabulary terms, ensuring alignment between NLP extraction
and the ML triage classifier which was trained on the same dataset.

Run once before starting the server:
    python -m backend.nlp.train_symptom_classifier

Input:  backend/data/synapse.csv
Output: backend/models/nlp_symptom_classifier.pkl
        backend/models/nlp_tfidf_vectorizer.pkl
        backend/models/nlp_label_encoder.pkl
"""

import os
import json
import pickle
import pandas as pd
import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score

BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH   = os.path.join(BASE_DIR, "data", "synapse.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

MODEL_PATH    = os.path.join(MODELS_DIR, "nlp_symptom_classifier.pkl")
TFIDF_PATH    = os.path.join(MODELS_DIR, "nlp_tfidf_vectorizer.pkl")
ENCODER_PATH  = os.path.join(MODELS_DIR, "nlp_label_encoder.pkl")


def clean_symptom(symptom: str) -> str:
    symptom = symptom.lower().strip()
    symptom = re.sub(r"[^a-z\s]", " ", symptom)
    symptom = re.sub(r"\s+", " ", symptom).strip()
    return symptom


def build_training_data(df: pd.DataFrame):
    """
    Builds training pairs from the Symptoms column.
    Each individual symptom term becomes both input and label,
    with slight text variations as augmentation.

    Returns X (list of text strings) and y (list of symptom labels)
    """
    X, y = [], []

    for raw in df["Symptoms"].dropna():
        parts = raw.split(",")
        for part in parts:
            cleaned = clean_symptom(part)
            if not cleaned or len(cleaned) <= 2:
                continue

            # original term
            X.append(cleaned)
            y.append(cleaned)

            # augment with partial phrase variations
            words = cleaned.split()
            if len(words) > 1:
                # use just the last word as variation
                X.append(words[-1])
                y.append(cleaned)
                # use first two words
                X.append(" ".join(words[:2]))
                y.append(cleaned)

    return X, y


def train():
    if not os.path.exists(CSV_PATH):
        print(f"ERROR: synapse.csv not found at {CSV_PATH}")
        return

    print("Reading synapse.csv...")
    df = pd.read_csv(CSV_PATH)

    print("Building training data...")
    X, y = build_training_data(df)
    print(f"Training samples: {len(X)}, Unique labels: {len(set(y))}")

    # encode labels
    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    # split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_enc, test_size=0.2, random_state=42
    )

    # TF-IDF vectorisation with unigrams and bigrams
    print("Fitting TF-IDF vectoriser...")
    tfidf = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=20000,
        sublinear_tf=True
    )
    X_train_vec = tfidf.fit_transform(X_train)
    X_test_vec  = tfidf.transform(X_test)

    # train Random Forest
    # Fikadu et al. (2025) showed RF achieves 96.72% accuracy
    # for low-resource medical classification
    print("Training Random Forest classifier...")
    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        min_samples_leaf=1,
        n_jobs=-1,
        random_state=42
    )
    clf.fit(X_train_vec, y_train)

    # evaluate
    y_pred = clf.predict(X_test_vec)
    wf1 = f1_score(y_test, y_pred, average="weighted")
    print(f"Weighted F1: {wf1:.4f}")

    # save artefacts
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(clf, f)
    with open(TFIDF_PATH, "wb") as f:
        pickle.dump(tfidf, f)
    with open(ENCODER_PATH, "wb") as f:
        pickle.dump(le, f)

    print(f"Model saved to {MODEL_PATH}")
    print(f"TF-IDF saved to {TFIDF_PATH}")
    print(f"Label encoder saved to {ENCODER_PATH}")
    print("Training complete.")


if __name__ == "__main__":
    train()