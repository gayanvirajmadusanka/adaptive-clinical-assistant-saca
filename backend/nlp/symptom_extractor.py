"""
Symptom Extraction Module - SACA
Developer: Fathima Hamra Imam (105708480)

Two-stage hybrid extraction pipeline:

Stage 1 - Rule-based keyword matching against symptom vocabulary
          extracted from Synapse dataset (3162 unique symptoms).
          Fast and deterministic for clear symptom descriptions.
          Confidence: exact 0.99, phrase 0.95, partial 0.85

Stage 2 - TF-IDF + Random Forest fallback trained on Synapse data.
          Activates when Stage 1 finds no result or confidence is low.
          Handles informal and colloquial phrasing.
          Based on: Fikadu et al. (2025) - RF achieves 96.72% accuracy
          for low-resource medical classification.

Training on Synapse ensures vocabulary alignment between NLP extraction
and ML triage - both use the same clinical symptom terminology.

Input:  text string
Output: dict with symptoms, confidence scores, intensity signal, has_critical
"""

import os
import json
import pickle
from rapidfuzz import fuzz
from nlp.preprocessor import preprocess_text

BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR  = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")

VOCAB_PATH   = os.path.join(DATA_DIR, "symptom_vocabulary.json")
MODEL_PATH   = os.path.join(MODEL_DIR, "nlp_symptom_classifier.pkl")
TFIDF_PATH   = os.path.join(MODEL_DIR, "nlp_tfidf_vectorizer.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "nlp_label_encoder.pkl")

# confidence thresholds
EXACT_CONF   = 0.99
PHRASE_CONF  = 0.95
PARTIAL_CONF = 0.85
MIN_CONF     = 0.80

# intensity signal keywords
HIGH_INTENSITY = [
    "unbearable", "severe", "extreme", "worst", "terrible",
    "cannot", "whole body", "all over", "really bad", "very bad"
]
LOW_INTENSITY = ["mild", "slight", "little", "minor", "bit", "small"]

# critical symptoms - trigger has_critical = 1
CRITICAL_SYMPTOMS = [
    "chest pain", "difficulty breathing", "shortness of breath",
    "loss of consciousness", "seizure", "stroke", "heart attack",
    "severe bleeding", "unconscious", "not breathing", "passing out",
    "coughing blood", "vomiting blood", "fast weak pulse"
]

# cache vocabulary and model in memory after first load
_vocabulary   = None
_model        = None
_tfidf        = None
_label_encoder = None


def _load_vocabulary() -> list:
    global _vocabulary
    if _vocabulary is not None:
        return _vocabulary
    if os.path.exists(VOCAB_PATH):
        with open(VOCAB_PATH, "r") as f:
            _vocabulary = json.load(f)
    else:
        # fallback basic list if vocabulary not built yet
        _vocabulary = [
            "fever", "headache", "cough", "nausea", "vomiting",
            "diarrhoea", "fatigue", "chest pain", "shortness of breath",
            "abdominal pain", "back pain", "dizziness", "rash",
            "sore throat", "runny nose", "muscle pain", "joint pain",
            "loss of appetite", "difficulty breathing", "swelling"
        ]
    return _vocabulary


def _load_model():
    global _model, _tfidf, _label_encoder
    if _model is not None:
        return True
    if (os.path.exists(MODEL_PATH) and
            os.path.exists(TFIDF_PATH) and
            os.path.exists(ENCODER_PATH)):
        with open(MODEL_PATH, "rb") as f:
            _model = pickle.load(f)
        with open(TFIDF_PATH, "rb") as f:
            _tfidf = pickle.load(f)
        with open(ENCODER_PATH, "rb") as f:
            _label_encoder = pickle.load(f)
        return True
    return False


def get_intensity_signal(text: str) -> int:
    """
    Derives intensity signal from raw text.
    Returns: 0 = low, 1 = neutral, 2 = high
    """
    text_lower = text.lower()
    if any(w in text_lower for w in HIGH_INTENSITY):
        return 2
    if any(w in text_lower for w in LOW_INTENSITY):
        return 0
    return 1


def get_has_critical(symptoms: list) -> int:
    """
    Returns 1 if any extracted symptom is in the critical list.
    """
    symptoms_lower = [s.lower() for s in symptoms]
    for critical in CRITICAL_SYMPTOMS:
        if any(critical in s or s in critical for s in symptoms_lower):
            return 1
    return 0


def _stage1_keyword_match(tokens: list, vocabulary: list) -> dict:
    """
    Stage 1: Rule-based keyword matching against Synapse vocabulary.

    Three matching levels:
        Exact  - token == symptom word          -> 0.99
        Phrase - all words of symptom in tokens -> 0.95
        Partial - fuzzy ratio > 85             -> 0.85
    """
    matched      = {}
    tokens_set   = set(tokens)
    tokens_str   = " ".join(tokens)

    for symptom in vocabulary:
        symptom_lower = symptom.lower()
        symptom_words = symptom_lower.split()

        # exact single token
        if symptom_lower in tokens_set:
            matched[symptom] = EXACT_CONF
            continue

        # multi-word phrase - all words present
        if len(symptom_words) > 1 and all(
            w in tokens_set for w in symptom_words
        ):
            matched[symptom] = PHRASE_CONF
            continue

        # partial fuzzy match
        ratio = fuzz.partial_ratio(symptom_lower, tokens_str)
        if ratio >= 85:
            matched[symptom] = PARTIAL_CONF

    return matched


def _stage2_tfidf_fallback(clean_text: str) -> dict:
    """
    Stage 2: TF-IDF + Random Forest classifier fallback.

    Uses model trained on Synapse symptom data to map informal
    phrasing to standardised symptom vocabulary terms.
    Only activates when Stage 1 finds nothing useful.
    """
    if not _load_model():
        return {}

    try:
        features   = _tfidf.transform([clean_text])
        proba      = _model.predict_proba(features)[0]
        top_idx    = proba.argmax()
        top_label  = _label_encoder.inverse_transform([top_idx])[0]
        confidence = float(proba[top_idx])

        if confidence >= 0.45:
            return {top_label: round(confidence, 2)}
        return {}

    except Exception as e:
        print(f"Stage 2 error: {e}")
        return {}


def extract_symptoms(text: str, raw_text: str = None) -> dict:
    """
    Main extraction function.

    Runs Stage 1 keyword matching first.
    Falls back to Stage 2 TF-IDF ML if Stage 1 finds nothing
    or all confidence scores are below MIN_CONF threshold.

    Args:
        text:     Text to extract from (will be preprocessed internally)
        raw_text: Original unprocessed text for intensity signal

    Returns:
        dict:
            symptoms          - list of extracted symptom strings
            symptom_confidence - dict of {symptom: score}
            intensity_signal  - 0 / 1 / 2
            has_critical      - 0 or 1
            clean_text        - preprocessed text string
    """
    preprocessed = preprocess_text(text)
    tokens       = preprocessed["tokens"]
    clean_text   = preprocessed["clean_text"]
    signal_src   = raw_text if raw_text else text
    intensity    = get_intensity_signal(signal_src)
    vocabulary   = _load_vocabulary()

    # Stage 1
    stage1 = _stage1_keyword_match(tokens, vocabulary)
    high_conf = {k: v for k, v in stage1.items() if v >= MIN_CONF}

    if high_conf:
        symptoms           = list(high_conf.keys())
        symptom_confidence = high_conf
    else:
        # Stage 2 fallback
        stage2   = _stage2_tfidf_fallback(clean_text)
        combined = {**stage1, **stage2}
        symptoms           = list(combined.keys())
        symptom_confidence = combined

    has_critical = get_has_critical(symptoms)

    return {
        "symptoms":           symptoms,
        "symptom_confidence": {k: round(v, 2) for k, v in symptom_confidence.items()},
        "intensity_signal":   intensity,
        "has_critical":       has_critical,
        "clean_text":         clean_text
    }