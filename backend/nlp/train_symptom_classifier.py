import os
import json
import pickle
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score
from rapidfuzz import process, fuzz

_BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_CSV_PATH   = os.path.join(_BASE_DIR, "data", "synapse.csv")
_MAP_PATH   = os.path.join(_BASE_DIR, "data", "warlpiri", "symptom_map.json")
_MODELS_DIR = os.path.join(_BASE_DIR, "models")
os.makedirs(_MODELS_DIR, exist_ok=True)

_MODEL_PATH   = os.path.join(_MODELS_DIR, "nlp_symptom_classifier.pkl")
_TFIDF_PATH   = os.path.join(_MODELS_DIR, "nlp_tfidf_vectorizer.pkl")
_ENCODER_PATH = os.path.join(_MODELS_DIR, "nlp_label_encoder.pkl")

_MATCH_THRESHOLD = 60  # minimum rapidfuzz score to accept a label mapping


def _clean(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _load_target_vocab() -> list:
    """
    Load 33 English symptom labels from symptom_map.json.
    Classifier output is restricted to these labels only,
    ensuring alignment with the ML triage classifier vocabulary.
    :return: list of English symptom strings
    """
    with open(_MAP_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [v["en"] for v in data.values()]


def _build_training_data(df: pd.DataFrame, target_vocab: list) -> tuple:
    """
    Build training pairs from Synapse Symptoms column.
    Each Synapse symptom is mapped to the closest label in target_vocab
    using rapidfuzz. Augmented with partial phrase variations.
    Samples with no close match are discarded.
    :param df: Synapse dataframe
    :param target_vocab: 33 valid symptom label strings
    :return: X list of text samples, y list of label strings
    """
    X, y = [], []

    for raw in df["Symptoms"].dropna():
        for part in raw.split(","):
            cleaned = _clean(part)
            if not cleaned or len(cleaned) <= 2:
                continue

            # map to closest label in target vocab
            result = process.extractOne(
                cleaned, target_vocab, scorer=fuzz.token_sort_ratio
            )
            if not result or result[1] < _MATCH_THRESHOLD:
                continue  # no close match - skip

            label = result[0]
            X.append(cleaned)
            y.append(label)

            # augment with partial phrase variations for generalisation
            words = cleaned.split()
            if len(words) > 1:
                X.append(words[-1]);           y.append(label)
                X.append(" ".join(words[:2])); y.append(label)

    return X, y


def train():
    """
    Train TF-IDF + Random Forest classifier on Synapse symptom data.
    Output labels restricted to 33 terms in symptom_map.json.
    Run once before starting the server:
        python -m backend.nlp.train_symptom_classifier
    """
    if not os.path.exists(_CSV_PATH):
        print(f"synapse.csv not found at {_CSV_PATH}")
        return

    target_vocab = _load_target_vocab()
    print(f"target vocabulary: {len(target_vocab)} symptom labels")

    print("reading synapse.csv...")
    df = pd.read_csv(_CSV_PATH)

    print("building training data...")
    X, y = _build_training_data(df, target_vocab)
    print(f"training samples: {len(X)}  unique labels: {len(set(y))}")

    le    = LabelEncoder()
    y_enc = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_enc, test_size=0.2, random_state=42, stratify=y_enc
    )

    print("fitting TF-IDF vectoriser...")
    tfidf = TfidfVectorizer(ngram_range=(1, 2), max_features=20000, sublinear_tf=True)
    X_tr  = tfidf.fit_transform(X_train)
    X_te  = tfidf.transform(X_test)

    print("training Random Forest classifier...")
    clf = RandomForestClassifier(n_estimators=200, n_jobs=-1, random_state=42)
    clf.fit(X_tr, y_train)

    wf1 = f1_score(y_test, clf.predict(X_te), average="weighted")
    print(f"weighted F1: {wf1:.4f}")

    with open(_MODEL_PATH,   "wb") as f: pickle.dump(clf,   f)
    with open(_TFIDF_PATH,   "wb") as f: pickle.dump(tfidf, f)
    with open(_ENCODER_PATH, "wb") as f: pickle.dump(le,    f)
    print("training complete")


if __name__ == "__main__":
    train()
