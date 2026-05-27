import os
import json
import pickle
import pkgutil
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

_symptom_map = None
_synonym_map = None
_en_vocab    = None
_model       = None
_tfidf       = None
_label_enc   = None


def _load_symptom_map() -> dict:
    global _symptom_map
    if _symptom_map is None:
        with open(_SYMPTOM_MAP_PATH, "r", encoding="utf-8") as f:
            _symptom_map = json.load(f)
    return _symptom_map


def _load_synonym_map() -> dict:
    global _synonym_map
    if _synonym_map is None:
        with open(_SYNONYM_MAP_PATH, "r", encoding="utf-8") as f:
            _synonym_map = json.load(f)
    return _synonym_map


def _get_en_vocab() -> list:
    global _en_vocab
    if _en_vocab is None:
        _en_vocab = [v["en"] for v in _load_symptom_map().values()]
    return _en_vocab


def _load_pkl_file(path: str) -> object:
    try:
        with open(path, 'rb') as f:
            return pickle.load(f)
    except (OSError, IOError):
        return pickle.loads(pkgutil.get_data('backend_release_android.models', os.path.basename(path)))


def _load_model() -> bool:
    global _model, _tfidf, _label_enc
    if _model is not None:
        return True
    try:
        _model     = _load_pkl_file(_MODEL_PATH)
        _tfidf     = _load_pkl_file(_TFIDF_PATH)
        _label_enc = _load_pkl_file(_ENCODER_PATH)
        return True
    except Exception:
        return False


def _apply_synonyms(text: str) -> list:
    synonyms   = _load_synonym_map()
    text_lower = text.lower().strip()
    matched    = []
    tokens     = text_lower.split()

    if text_lower in synonyms:
        matched.append(synonyms[text_lower])

    for token in tokens:
        if token in synonyms and synonyms[token] not in matched:
            matched.append(synonyms[token])

    for i in range(len(tokens) - 1):
        bigram = f"{tokens[i]} {tokens[i + 1]}"
        if bigram in synonyms and synonyms[bigram] not in matched:
            matched.append(synonyms[bigram])

    for i in range(len(tokens) - 2):
        trigram = f"{tokens[i]} {tokens[i + 1]} {tokens[i + 2]}"
        if trigram in synonyms and synonyms[trigram] not in matched:
            matched.append(synonyms[trigram])

    return matched


def _stage1_match(text: str) -> dict:
    if not text.strip():
        return {}

    synonyms = _load_synonym_map()
    vocab    = _get_en_vocab()
    tokens   = text.lower().split()
    matched  = {}

    for sym in _apply_synonyms(text):
        if sym in vocab:
            matched[sym] = _EXACT_CONF

    candidates = list(tokens)
    for i in range(len(tokens) - 1):
        candidates.append(f"{tokens[i]} {tokens[i + 1]}")
    candidates.append(text.lower())

    for candidate in candidates:
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
    if not text or not text.strip():
        return []

    stage2_input = raw_text if raw_text else text

    raw_synonym_hits = _apply_synonyms(raw_text) if raw_text else []

    stage1 = _stage1_match(text)

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
