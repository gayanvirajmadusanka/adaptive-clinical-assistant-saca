import os
import json
import pickle
from rapidfuzz import fuzz, process

_BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_DATA_DIR  = os.path.join(_BASE_DIR, "data", "warlpiri")
_MODEL_DIR = os.path.join(_BASE_DIR, "models")

_SYMPTOM_MAP_PATH = os.path.join(_DATA_DIR, "symptom_map.json")
_MODEL_PATH       = os.path.join(_MODEL_DIR, "nlp_symptom_classifier.pkl")
_TFIDF_PATH       = os.path.join(_MODEL_DIR, "nlp_tfidf_vectorizer.pkl")
_ENCODER_PATH     = os.path.join(_MODEL_DIR, "nlp_label_encoder.pkl")

# confidence thresholds
_EXACT_CONF  = 0.99
_FUZZY_CONF  = 0.85
_MIN_CONF    = 0.75   # below this triggers stage 2
_FUZZY_CUT   = 70     # rapidfuzz score cutoff 0-100

# symptoms that always set has_critical = 1
_CRITICAL = {
    "chest pain", "shortness breath", "loss of consciousness",
    "bleeding", "blood stool", "blood urine"
}

# module-level cache
_symptom_map = None
_en_vocab    = None
_model       = None
_tfidf       = None
_label_enc   = None


def _load_symptom_map() -> dict:
    """
    Load symptom_map.json once and cache.
    :return: symptom map dict
    """
    global _symptom_map
    if _symptom_map is None:
        with open(_SYMPTOM_MAP_PATH, "r", encoding="utf-8") as f:
            _symptom_map = json.load(f)
    return _symptom_map


def _get_en_vocab() -> list:
    """
    Returns the 33 English symptom strings from symptom_map.
    These are the only valid output labels - must match ML classifier vocabulary.
    :return: list of English symptom strings
    """
    global _en_vocab
    if _en_vocab is None:
        _en_vocab = [v["en"] for v in _load_symptom_map().values()]
    return _en_vocab


def _load_model() -> bool:
    """
    Load TF-IDF and RF model artefacts if available.
    :return: True if loaded successfully, False otherwise
    """
    global _model, _tfidf, _label_enc
    if _model is not None:
        return True
    if all(os.path.exists(p) for p in [_MODEL_PATH, _TFIDF_PATH, _ENCODER_PATH]):
        with open(_MODEL_PATH,   "rb") as f: _model     = pickle.load(f)
        with open(_TFIDF_PATH,   "rb") as f: _tfidf     = pickle.load(f)
        with open(_ENCODER_PATH, "rb") as f: _label_enc = pickle.load(f)
        return True
    return False


def get_has_critical(symptoms: list) -> int:
    """
    Check if any extracted symptom is in the critical symptoms set.
    :param symptoms: list of English symptom strings
    :return: 1 if critical symptom found, 0 otherwise
    """
    for s in symptoms:
        if s.lower() in _CRITICAL:
            return 1
    return 0


def _stage1_match(text: str) -> dict:
    """
    Stage 1: fuzzy match input text against 33 symptom_map vocabulary terms.
    Uses token_sort_ratio to handle word order variation.
    Returns matched symptoms with confidence scores.
    :param text: preprocessed English text
    :return: dict of {symptom_en: confidence}
    """
    if not text.strip():
        return {}

    vocab   = _get_en_vocab()
    matched = {}

    for sym in vocab:
        ratio = fuzz.token_sort_ratio(sym.lower(), text.lower())
        if ratio >= _FUZZY_CUT:
            # exact match scores 0.99, others scale from FUZZY_CONF
            conf = _EXACT_CONF if ratio == 100 else round(ratio / 100 * _FUZZY_CONF, 2)
            matched[sym] = conf

    return matched


def _stage2_tfidf(text: str) -> dict:
    """
    Stage 2: TF-IDF + Random Forest fallback.
    Only called when stage 1 finds results but all below MIN_CONF.
    Maps informal phrasing to symptom_map vocabulary.
    NOT called when stage 1 returns empty (confidence = 0).
    :param text: preprocessed English text
    :return: dict of {symptom_en: confidence} or empty dict
    """
    if not _load_model():
        return {}
    try:
        features = _tfidf.transform([text])
        proba    = _model.predict_proba(features)[0]
        top_idx  = proba.argmax()
        label    = _label_enc.inverse_transform([top_idx])[0]
        conf     = float(proba[top_idx])
        # only return if label is in our 33-symptom vocabulary
        if label in _get_en_vocab() and conf >= 0.45:
            return {label: round(conf, 2)}
        return {}
    except Exception as e:
        print(f"stage 2 error: {e}")
        return {}


def extract_symptoms(text: str, is_warlpiri: bool = False) -> dict:
    """
    Extract symptoms from English text and map to symptom_map vocabulary.
    Symptoms returned are always exact strings from symptom_map.json
    so the ML classifier receives vocabulary-aligned input.

    Stage 1 fuzzy matches against 33 symptom terms.
    Stage 2 TF-IDF activates only when stage 1 finds results below threshold.
    Confidence 0 returns immediately without calling stage 2.

    :param text: English text (already translated if Warlpiri input)
    :param is_warlpiri: True if original input was Warlpiri language
    :return: dict with symptoms_en, symptoms_wp, confidence, has_critical
    """
    if not text or not text.strip():
        return {
            "symptoms_en":  [],
            "symptoms_wp":  [],
            "confidence":   0.0,
            "has_critical": 0
        }

    stage1 = _stage1_match(text)

    # nothing found at all - return empty immediately, do not call stage 2
    if not stage1:
        return {
            "symptoms_en":  [],
            "symptoms_wp":  [],
            "confidence":   0.0,
            "has_critical": 0
        }

    high_conf = {k: v for k, v in stage1.items() if v >= _MIN_CONF}

    if high_conf:
        final = high_conf
    else:
        # stage 1 found candidates but all low confidence - try stage 2
        stage2 = _stage2_tfidf(text)
        final  = {**stage1, **stage2} if stage2 else stage1

    symptoms_en = list(final.keys())

    # build Warlpiri terms from symptom_map for Warlpiri input
    if is_warlpiri:
        wp_lookup   = {v["en"].lower(): v["wp"] for v in _load_symptom_map().values()}
        symptoms_wp = [wp_lookup[s.lower()] for s in symptoms_en if s.lower() in wp_lookup]
    else:
        symptoms_wp = []

    return {
        "symptoms_en":  symptoms_en,
        "symptoms_wp":  symptoms_wp,
        "confidence":   round(max(final.values()), 2),
        "has_critical": get_has_critical(symptoms_en)
    }
