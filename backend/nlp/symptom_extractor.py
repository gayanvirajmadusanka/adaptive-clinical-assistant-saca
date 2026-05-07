import os
import json
import pickle
from rapidfuzz import fuzz

_BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_DATA_DIR  = os.path.join(_BASE_DIR, "data", "warlpiri")
_MODEL_DIR = os.path.join(_BASE_DIR, "models")

_SYMPTOM_MAP_PATH = os.path.join(_DATA_DIR, "symptom_map.json")
_SYNONYM_MAP_PATH = os.path.join(_DATA_DIR, "synonym_map.json")
_MODEL_PATH       = os.path.join(_MODEL_DIR, "nlp_symptom_classifier.pkl")
_TFIDF_PATH       = os.path.join(_MODEL_DIR, "nlp_tfidf_vectorizer.pkl")
_ENCODER_PATH     = os.path.join(_MODEL_DIR, "nlp_label_encoder.pkl")

_EXACT_CONF = 0.99
_FUZZY_CONF = 0.85
_MIN_CONF   = 0.75
_FUZZY_CUT  = 70

# module-level cache - loaded once at startup
_symptom_map = None
_synonym_map = None
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


def _load_synonym_map() -> dict:
    """
    Load synonym_map.json once and cache in memory.
    Maps informal/variant expressions to exact symptom_map vocabulary.
    :return: synonym map dict
    """
    global _synonym_map
    if _synonym_map is None:
        with open(_SYNONYM_MAP_PATH, "r", encoding="utf-8") as f:
            _synonym_map = json.load(f)
    return _synonym_map


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
    Check input text against synonym_map at unigram, bigram, and trigram level.
    Catches informal expressions before fuzzy matching runs.
    Checks raw text to preserve compound phrases that preprocessing may split.
    :param text: raw or preprocessed English text
    :return: list of matched symptom_map English strings
    """
    synonyms   = _load_synonym_map()
    text_lower = text.lower().strip()
    matched    = []
    tokens     = text_lower.split()

    # full text check
    if text_lower in synonyms:
        matched.append(synonyms[text_lower])

    # unigrams
    for token in tokens:
        if token in synonyms and synonyms[token] not in matched:
            matched.append(synonyms[token])

    # bigrams
    for i in range(len(tokens) - 1):
        bigram = f"{tokens[i]} {tokens[i + 1]}"
        if bigram in synonyms and synonyms[bigram] not in matched:
            matched.append(synonyms[bigram])

    # trigrams
    for i in range(len(tokens) - 2):
        trigram = f"{tokens[i]} {tokens[i + 1]} {tokens[i + 2]}"
        if trigram in synonyms and synonyms[trigram] not in matched:
            matched.append(synonyms[trigram])

    return matched


def _stage1_match(text: str) -> dict:
    """
    Stage 1: token-level matching against 33 symptom_map vocabulary terms.

    Three matching layers:
        1. Synonym expansion from synonym_map.json
        2. Direct vocabulary match on tokens and bigrams
        3. Fuzzy matching for near-matches and plurals

    Splits input into unigrams and bigrams so multi-symptom inputs
    like 'fever headache cough' correctly extract all three symptoms.

    :param text: preprocessed English text
    :return: dict of {symptom_en: confidence}
    """
    if not text.strip():
        return {}

    synonyms = _load_synonym_map()
    vocab    = _get_en_vocab()
    tokens   = text.lower().split()
    matched  = {}

    # layer 1: synonym expansion on preprocessed text
    for sym in _apply_synonyms(text):
        if sym in vocab:
            matched[sym] = _EXACT_CONF

    # layer 2 + 3: direct and fuzzy matching on tokens and bigrams
    candidates = list(tokens)
    for i in range(len(tokens) - 1):
        candidates.append(f"{tokens[i]} {tokens[i + 1]}")
    candidates.append(text.lower())

    for candidate in candidates:
        # check synonym for each candidate
        if candidate in synonyms:
            sym = synonyms[candidate]
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
    classifier always receives vocabulary-aligned input.

    Stage 1 splits input into tokens and bigrams, matches each against
    33 symptom vocabulary with synonym expansion for informal phrasing.
    Stage 2 TF-IDF activates when stage 1 finds nothing or all low confidence.
    Raw text is used for stage 2 and synonym check to preserve context
    that preprocessing may remove.

    :param text: preprocessed English text from preprocessor
    :param raw_text: original unprocessed text - used for stage 2 and synonym check
    :return: list of matched English symptom strings
    """
    if not text or not text.strip():
        return []

    stage2_input = raw_text if raw_text else text

    # run synonym check on raw text first - catches informal phrases
    # that preprocessing breaks e.g. "throwing up" lemmatises to "throw"
    raw_synonym_hits = _apply_synonyms(raw_text) if raw_text else []

    stage1 = _stage1_match(text)

    # add raw text synonym hits not already found by stage 1
    vocab = _get_en_vocab()
    for sym in raw_synonym_hits:
        if sym in vocab and sym not in stage1:
            stage1[sym] = _EXACT_CONF

    if not stage1:
        # nothing found - try stage 2 on raw text before giving up
        stage2 = _stage2_tfidf(stage2_input)
        return list(stage2.keys()) if stage2 else []

    high_conf = {k: v for k, v in stage1.items() if v >= _MIN_CONF}

    if high_conf:
        return list(high_conf.keys())

    # stage 1 found candidates but all low confidence - try stage 2
    stage2 = _stage2_tfidf(stage2_input)
    if stage2:
        return list({**stage1, **stage2}.keys())
    return list(stage1.keys())
