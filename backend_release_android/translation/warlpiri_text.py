import json
import os

from rapidfuzz import process

from backend_release_android.constants import Language

_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "warlpiri")


def _load(filename: str) -> dict:
    path = os.path.join(_DATA_DIR, filename)
    with open(path, encoding="utf-8") as file:
        return json.load(file)


PHRASE_MAP  = _load("phrase_map.json")
LEXICON     = _load("lexicon.json")
SYMPTOM_MAP = _load("symptom_map.json")

NEGATION_WORDS = {
    word for word, data in LEXICON.items()
    if data["type"] == "negation"
}
SUBJECT_WORDS = {
    word: data["meaning"].split("/")[0]
    for word, data in LEXICON.items()
    if data["type"] == "pronoun"
}

_WP_TO_EN = {
    value[Language.WP].lower(): value[Language.EN]
    for value in SYMPTOM_MAP.values()
}

_BODY_PART_WORDS = {
    word for word, data in LEXICON.items()
    if data["type"] == "body_part"
}

THRESHOLD_LEXICON      = 0.50
THRESHOLD_FUZZY_PHRASE = 0.68
THRESHOLD_FUZZY_TOKEN  = 0.80


def _level1_exact(query: str) -> dict | None:
    if query in PHRASE_MAP:
        return {"translated_text": PHRASE_MAP[query], "confidence": 1.0, "match_type": "exact_phrase"}
    return None


def _build_translation(tokens: list) -> dict | None:
    known_tokens = [t for t in tokens if t in LEXICON]
    coverage = len(known_tokens) / len(tokens) if tokens else 0

    if coverage < THRESHOLD_LEXICON:
        return None

    has_negation = any(t in NEGATION_WORDS for t in tokens)
    conditions   = []

    for token in tokens:
        if token in _BODY_PART_WORDS:
            conditions.append(f"{LEXICON[token]['meaning']} pain")
        elif token in _WP_TO_EN:
            conditions.append(_WP_TO_EN[token])

    if not conditions:
        return None

    subject = "I"
    for token in tokens:
        if token in SUBJECT_WORDS:
            subject = SUBJECT_WORDS[token]
            break

    condition_str = " and ".join(conditions)
    translation   = (
        f"{subject} do not have {condition_str}" if has_negation
        else f"{subject} have {condition_str}"
    )
    return {
        "translated_text": translation, "confidence": round(coverage, 3),
        "match_type": "lexicon", "has_negation": has_negation,
        "subject": subject, "conditions": conditions, "tokens_matched": known_tokens
    }


def _level2_lexicon(tokens: list) -> dict | None:
    return _build_translation(tokens)


def _level3_fuzzy_phrase(query: str) -> dict | None:
    match, score, _ = process.extractOne(query, PHRASE_MAP.keys())
    confidence = score / 100
    if confidence >= THRESHOLD_FUZZY_PHRASE:
        return {
            "translated_text": PHRASE_MAP[match], "matched_phrase": match,
            "confidence": round(confidence, 3), "match_type": "fuzzy_phrase"
        }
    return None


def _level4_fuzzy_tokens(tokens: list) -> dict | None:
    resolved_tokens = []
    token_scores    = []

    for token in tokens:
        if token in LEXICON:
            resolved_tokens.append(token)
            token_scores.append(1.0)
        else:
            match, score, _ = process.extractOne(token, LEXICON.keys())
            if score >= THRESHOLD_FUZZY_TOKEN * 100:
                resolved_tokens.append(match)
                token_scores.append(score / 100)

    if not resolved_tokens:
        return None

    result = _build_translation(resolved_tokens)
    if result:
        avg = sum(token_scores) / len(token_scores)
        result["confidence"] = round(result["confidence"] * avg, 3)
        result["match_type"] = "fuzzy_token"
        result["token_scores"] = {o: s for o, s in zip(tokens, token_scores)}
        return result
    return None


def translate(warlpiri_input: str) -> dict:
    query  = warlpiri_input.lower().strip()
    tokens = query.split()
    base   = {"input_type": "text", "original": warlpiri_input}

    for level_fn in [
        lambda: _level1_exact(query),
        lambda: _level2_lexicon(tokens),
        lambda: _level3_fuzzy_phrase(query),
        lambda: _level4_fuzzy_tokens(tokens),
    ]:
        result = level_fn()
        if result:
            return {**base, **result}

    return {
        **base,
        "translated_text": None, "confidence": 0.0, "match_type": "no_match",
        "message": "Phrase not recognised. Please use the body map or voice input."
    }
