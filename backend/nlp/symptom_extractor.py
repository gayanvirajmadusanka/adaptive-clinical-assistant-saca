import os
import json
import pickle
from rapidfuzz import fuzz

_BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_DATA_DIR  = os.path.join(_BASE_DIR, "data", "warlpiri")
_MODEL_DIR = os.path.join(_BASE_DIR, "models")

_SYMPTOM_MAP_PATH = os.path.join(_DATA_DIR, "symptom_map.json")
_MODEL_PATH       = os.path.join(_MODEL_DIR, "nlp_symptom_classifier.pkl")
_TFIDF_PATH       = os.path.join(_MODEL_DIR, "nlp_tfidf_vectorizer.pkl")
_ENCODER_PATH     = os.path.join(_MODEL_DIR, "nlp_label_encoder.pkl")

_EXACT_CONF = 0.99
_FUZZY_CONF = 0.85
_MIN_CONF   = 0.75
_FUZZY_CUT  = 70

# maps informal/variant expressions to exact symptom_map vocabulary
# covers colloquial language, plurals, and common alternate descriptions
_SYNONYMS = {
    "stomach ache":          "abdominal pain",
    "stomach pain":          "abdominal pain",
    "tummy pain":            "abdominal pain",
    "belly pain":            "abdominal pain",
    "abdominal cramp":       "abdominal pain",
    "stomach cramp":         "abdominal pain",
    "shortness of breath":   "shortness breath",
    "cant breathe":          "shortness breath",
    "cannot breathe":        "shortness breath",
    "difficulty breathing":  "shortness breath",
    "breathless":            "shortness breath",
    "out of breath":         "shortness breath",
    "head hurts":            "headache",
    "head pain":             "headache",
    "head ache":             "headache",
    "migraine":              "headache",
    "high temperature":      "fever",
    "temperature":           "fever",
    "burning up":            "fever",
    "tired":                 "fatigue",
    "exhausted":             "fatigue",
    "tiredness":             "fatigue",
    "no energy":             "fatigue",
    "lethargy":              "fatigue",
    "throwing up":           "vomiting",
    "being sick":            "vomiting",
    "puking":                "vomiting",
    "dizzy":                 "dizziness",
    "lightheaded":           "dizziness",
    "spinning":              "dizziness",
    "vertigo":               "dizziness",
    "weak":                  "weakness",
    "feeling weak":          "weakness",
    "no strength":           "weakness",
    "back ache":             "back pain",
    "backache":              "back pain",
    "sore back":             "back pain",
    "chest hurts":           "chest pain",
    "chest tightness":       "chest pain",
    "heart pain":            "chest pain",
    "coughing":              "cough",
    "dry cough":             "cough",
    "diarrhoea":             "diarrhea",
    "loose stool":           "diarrhea",
    "watery stool":          "diarrhea",
    "fainted":               "loss of consciousness",
    "passed out":            "loss of consciousness",
    "blacked out":           "loss of consciousness",
    "unconscious":           "loss of consciousness",
    "neck pain":             "stiff neck",
    "neck stiffness":        "stiff neck",
    "neck ache":             "stiff neck",
    "thirsty":               "dehydration",
    "very thirsty":          "dehydration",
    "dry mouth":             "dehydration",
    "blood in stool":        "blood stool",
    "blood in poo":          "blood stool",
    "blood in urine":        "blood urine",
    "blood in pee":          "blood urine",
    "shivering":             "chills",
    "shaking":               "chills",
    "cold shivers":          "chills",
    "skin rash":             "rash",
    "hives":                 "rash",
    "itching":               "itchy",
    "swollen":               "swelling parts of body",
    "body ache":             "body pain",
    "muscle pain":           "body pain",
    "aching":                "body pain",
    "all over pain":         "body pain",
    "arm ache":              "arm pain",
    "sore arm":              "arm pain",
    "earache":               "ear pain",
    "ear ache":              "ear pain",
    "sore eyes":             "eye pain",
    "throat pain":           "sore throat",
    "painful throat":        "sore throat",
    "blocked nose":          "runny nose",
    "stuffy nose":           "runny nose",
    "nauseous":              "nausea",
    "feel sick":             "nausea",
    "queasy":                "nausea",
    "bleeding":              "bleeding",
}

_symptom_map = None
_en_vocab    = None
_model       = None
_tfidf       = None
_label_enc   = None


def _load_symptom_map() -> dict:
    """
    Load symptom_map.json once and cache in memory.
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
    These are the only valid output labels - aligned with ML classifier vocabulary.
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


def _apply_synonyms(text: str) -> list:
    """
    Check input text and bigrams against synonym map.
    Returns list of matched vocabulary terms.
    Handles informal/colloquial expressions before fuzzy matching.
    :param text: preprocessed or raw English text
    :return: list of matched symptom_map English strings
    """
    text_lower = text.lower().strip()
    matched    = []
    tokens     = text_lower.split()

    # check full text
    if text_lower in _SYNONYMS:
        matched.append(_SYNONYMS[text_lower])

    # check individual tokens
    for token in tokens:
        if token in _SYNONYMS and _SYNONYMS[token] not in matched:
            matched.append(_SYNONYMS[token])

    # check bigrams
    for i in range(len(tokens) - 1):
        bigram = f"{tokens[i]} {tokens[i + 1]}"
        if bigram in _SYNONYMS and _SYNONYMS[bigram] not in matched:
            matched.append(_SYNONYMS[bigram])

    # check trigrams
    for i in range(len(tokens) - 2):
        trigram = f"{tokens[i]} {tokens[i + 1]} {tokens[i + 2]}"
        if trigram in _SYNONYMS and _SYNONYMS[trigram] not in matched:
            matched.append(_SYNONYMS[trigram])

    return matched


def _stage1_match(text: str) -> dict:
    """
    Stage 1: token-level matching against 33 symptom_map vocabulary terms.

    Three matching layers:
        1. Synonym expansion - handles informal/variant expressions
        2. Direct vocabulary match on tokens and bigrams
        3. Fuzzy matching for near-matches

    Splits input into unigrams and bigrams so multi-symptom inputs
    like 'fever headache cough' correctly extract all three symptoms.

    :param text: preprocessed English text
    :return: dict of {symptom_en: confidence}
    """
    if not text.strip():
        return {}

    vocab   = _get_en_vocab()
    tokens  = text.lower().split()
    matched = {}

    # layer 1: synonym expansion on original text
    synonym_hits = _apply_synonyms(text)
    for sym in synonym_hits:
        if sym in vocab:
            matched[sym] = _EXACT_CONF

    # layer 2 + 3: direct and fuzzy matching on tokens and bigrams
    candidates = list(tokens)
    for i in range(len(tokens) - 1):
        candidates.append(f"{tokens[i]} {tokens[i + 1]}")
    candidates.append(text.lower())

    for candidate in candidates:
        # check synonym for each candidate too
        if candidate in _SYNONYMS:
            sym = _SYNONYMS[candidate]
            if sym in vocab and (sym not in matched or _EXACT_CONF > matched[sym]):
                matched[sym] = _EXACT_CONF
            continue

        for sym in vocab:
            ratio = fuzz.token_sort_ratio(sym.lower(), candidate)
            if ratio >= _FUZZY_CUT:
                conf = _EXACT_CONF if ratio == 100 else round(ratio / 100 * _FUZZY_CONF, 2)
                if sym not in matched or conf > matched[sym]:
                    matched[sym] = conf

    return matched


def _stage2_tfidf(text: str) -> dict:
    """
    Stage 2: TF-IDF + Random Forest fallback for informal phrasing.
    Called only when stage 1 finds nothing or all matches below threshold.
    Uses raw text for better coverage of colloquial expressions.
    :param text: raw or lightly processed English text
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
        if label in _get_en_vocab() and conf >= 0.45:
            return {label: round(conf, 2)}
        return {}
    except Exception as e:
        print(f"stage 2 error: {e}")
        return {}


def extract_symptoms(text: str, raw_text: str = None) -> list:
    """
    Extract English symptom strings from preprocessed text.
    Returns only strings from symptom_map vocabulary so ML
    classifier always receives aligned input.

    Three-layer stage 1:
        1. Synonym map handles informal/variant expressions
        2. Direct token/bigram matching handles clinical terms
        3. Fuzzy matching handles near-matches and plurals

    Stage 2 TF-IDF activates when stage 1 finds nothing or all low confidence.
    Raw text passed to stage 2 for better informal phrasing coverage.

    :param text: preprocessed English text from preprocessor
    :param raw_text: original unprocessed text - passed to stage 2
    :return: list of matched English symptom strings
    """
    if not text or not text.strip():
        return []

    # also run synonyms on raw text before preprocessing removed context
    stage2_input = raw_text if raw_text else text

    # run synonym check on raw text first to catch informal phrases
    # that preprocessing might break (e.g. "throwing up" -> "throw")
    if raw_text:
        raw_synonym_hits = _apply_synonyms(raw_text)
    else:
        raw_synonym_hits = []

    stage1 = _stage1_match(text)

    # add any raw text synonym hits not already found
    vocab = _get_en_vocab()
    for sym in raw_synonym_hits:
        if sym in vocab and sym not in stage1:
            stage1[sym] = _EXACT_CONF

    if not stage1:
        stage2 = _stage2_tfidf(stage2_input)
        return list(stage2.keys()) if stage2 else []

    high_conf = {k: v for k, v in stage1.items() if v >= _MIN_CONF}

    if high_conf:
        return list(high_conf.keys())

    stage2 = _stage2_tfidf(stage2_input)
    if stage2:
        return list({**stage1, **stage2}.keys())
    return list(stage1.keys())
