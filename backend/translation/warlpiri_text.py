"""
Module for translating Warlpiri text to English.
Uses a hybrid pipeline comprising 4 levels:
  Level 1 - exact phrase match (phrase_map.json)
  Level 2 - word-level lexicon rules (lexicon.json + symptom_map.json)
  Level 3 - fuzzy full phrase match (handles typos in full phrases)
  Level 4 - fuzzy token match (handles typos at word level)
"""

import json
import os

from rapidfuzz import process

_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "warlpiri")


def _load(filename: str) -> dict:
    path = os.path.join(_DATA_DIR, filename)
    with open(path, encoding="utf-8") as file:
        return json.load(file)


PHRASE_MAP = _load("phrase_map.json")
LEXICON = _load("lexicon.json")
SYMPTOM_MAP = _load("symptom_map.json")

# derived sets
NEGATION_WORDS = {
    word for word, data in LEXICON.items()
    if data["type"] == "negation"
}
SUBJECT_WORDS = {
    word: data["meaning"].split("/")[0]
    for word, data in LEXICON.items()
    if data["type"] == "pronoun"
}

# build wp label -> english string lookup for token matching
_WP_TO_EN = {
    value["wp"].lower(): value["en"]
    for value in SYMPTOM_MAP.values()
}

# body part words from lexicon - used to infer conditions
_BODY_PART_WORDS = {
    word for word, data in LEXICON.items()
    if data["type"] == "body_part"
}

THRESHOLD_LEXICON = 0.50
THRESHOLD_FUZZY_PHRASE = 0.68
THRESHOLD_FUZZY_TOKEN = 0.80


def _level1_exact(query: str) -> dict | None:
    """
    Match exact phrases.
    :param query: Input text query.
    :return: translated dictionary or None if no matches.
    """
    if query in PHRASE_MAP:
        return {
            "translated_text": PHRASE_MAP[query],
            "confidence": 1.0,
            "match_type": "exact_phrase"
        }
    return None


def _build_translation(tokens: list) -> dict | None:
    """
    Core rule engine. Builds an English sentence from
    a list of known Warlpiri tokens.
    :param tokens: list of language tokens.
    :return: translated dictionary or None if no matches.
    """
    known_tokens = [token for token in tokens if token in LEXICON]
    coverage = len(known_tokens) / len(tokens) if tokens else 0

    if coverage < THRESHOLD_LEXICON:
        return None

    has_negation = any(token in NEGATION_WORDS for token in tokens)

    conditions = []

    for token in tokens:
        if token in _BODY_PART_WORDS:
            # body part word - look up meaning from lexicon
            body_meaning = LEXICON[token]["meaning"]
            conditions.append(f"{body_meaning} pain")
        elif token in _WP_TO_EN:
            # symptom word - look up english from symptom_map
            conditions.append(_WP_TO_EN[token])

    if not conditions:
        return None

    subject = "I"
    for token in tokens:
        if token in SUBJECT_WORDS:
            subject = SUBJECT_WORDS[token]
            break

    condition_str = " and ".join(conditions)
    translation = (
        f"{subject} do not have {condition_str}"
        if has_negation
        else f"{subject} have {condition_str}"
    )

    return {
        "translated_text": translation,
        "confidence": round(coverage, 3),
        "match_type": "lexicon",
        "has_negation": has_negation,
        "subject": subject,
        "conditions": conditions,
        "tokens_matched": known_tokens
    }


def _level2_lexicon(tokens: list) -> dict | None:
    """
    Apply rule-based translation using lexicon coverage.
    :param tokens: list of tokenized Warlpiri words.
    :return: translated dictionary or None if insufficient coverage.
    """
    return _build_translation(tokens)


def _level3_fuzzy_phrase(query: str) -> dict | None:
    """
    Perform fuzzy matching against known full phrases.
    :param query: Input text query.
    :return: translated dictionary or None if confidence below threshold.
    """
    match, score, _ = process.extractOne(query, PHRASE_MAP.keys())
    confidence = score / 100

    if confidence >= THRESHOLD_FUZZY_PHRASE:
        return {
            "translated_text": PHRASE_MAP[match],
            "matched_phrase": match,
            "confidence": round(confidence, 3),
            "match_type": "fuzzy_phrase"
        }
    return None


def _level4_fuzzy_tokens(tokens: list) -> dict | None:
    """
    Perform fuzzy token matching against lexicon keys.
    :param tokens: list of tokenized Warlpiri words.
    :return: translated dictionary or None if confidence below threshold.
    """
    resolved_tokens = []
    token_scores = []

    for token in tokens:
        if token in LEXICON:
            # exact token match
            resolved_tokens.append(token)
            token_scores.append(1.0)
        else:
            # fuzzy match this token against lexicon keys
            match, score, _ = process.extractOne(token, LEXICON.keys())
            if score >= THRESHOLD_FUZZY_TOKEN * 100:
                resolved_tokens.append(match)
                token_scores.append(score / 100)
            # if no good match, skip this token

    if not resolved_tokens:
        return None

    # run rule engine on resolved tokens
    result = _build_translation(resolved_tokens)

    if result:
        # adjust confidence by average token match score
        avg_token_score = sum(token_scores) / len(token_scores)
        result["confidence"] = round(result["confidence"] * avg_token_score, 3)
        result["match_type"] = "fuzzy_token"
        result["token_scores"] = {
            original: score
            for original, score in zip(tokens, token_scores)
        }
        return result

    return None


def translate(warlpiri_input: str) -> dict:
    """
    Translate Warlpiri text input to English using a 4-level pipeline.
    :param warlpiri_input: Raw Warlpiri text string from user
    :return: Dict with translated_text and match metadata
    """
    query = warlpiri_input.lower().strip()
    tokens = query.split()

    base = {
        "input_type": "text",
        "original": warlpiri_input,
    }

    # Level 1 - exact phrase
    result = _level1_exact(query)
    if result:
        return {**base, **result}

    # Level 2 - lexicon + rules
    result = _level2_lexicon(tokens)
    if result:
        return {**base, **result}

    # Level 3 - fuzzy phrase
    result = _level3_fuzzy_phrase(query)
    if result:
        return {**base, **result}

    # Level 4 - fuzzy token
    result = _level4_fuzzy_tokens(tokens)
    if result:
        return {**base, **result}

    # no match at any level
    return {
        **base,
        "translated_text": None,
        "confidence": 0.0,
        "match_type": "no_match",
        "message": "Phrase not recognised. Please use the body map or voice input."
    }
