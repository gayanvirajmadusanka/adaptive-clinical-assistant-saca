"""
Module for translating Warlpiri text to English translation
Uses a hybrid pipeline comprising 4 levels.
  Level 1 - exact phrase match (phrase_map.json)
  Level 2 - word-level lexicon rules (lexicon.json + maps)
  Level 3 - fuzzy full phrase match (handles typos in full phrases)
  Level 4 - fuzzy token match (handles typos at word level)
"""

import json
import os

from rapidfuzz import process

# define language directory path
_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'warlpiri')


def _load(filename: str) -> dict:
    path = os.path.join(_DATA_DIR, filename)
    with open(path, 'r', encoding='utf-8') as file:
        return json.load(file)


# load data files
PHRASE_MAP = _load('phrase_map.json')
LEXICON = _load('lexicon.json')
BODY_PART_MAP = _load('body_part_map.json')
SYMPTOM_MAP = _load('symptom_map.json')

# derived sets
NEGATION_WORDS = {
    word for word, data in LEXICON.items()
    if data['type'] == 'negation'
}
SUBJECT_WORDS = {
    word: data['meaning'].split('/')[0]
    for word, data in LEXICON.items()
    if data['type'] == 'pronoun'
}

# define thresholds
THRESHOLD_LEXICON = 0.50  # min token coverage for lexicon match
THRESHOLD_FUZZY_PHRASE = 0.68  # min score for fuzzy phrase match
THRESHOLD_FUZZY_TOKEN = 0.80  # min score per token for fuzzy token match


#  Level 1 - Exact phrase match
def _level1_exact(query: str) -> dict or None:
    """
    Match exact phrases.
    :param query: Input text query.
    :return: translated dictionary or None if no matches.
    """
    if query in PHRASE_MAP:
        return {
            'translated_text': PHRASE_MAP[query],
            'confidence': 1.0,
            'match_type': 'exact_phrase'
        }
    return None


#  Level 2 - Word-level lexicon + rule engine
def _build_translation(tokens: list) -> dict or None:
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

    # body parts -> conditions
    body_conditions = [
        BODY_PART_MAP[token] for token in tokens
        if token in BODY_PART_MAP
    ]

    # symptoms not already covered by body part
    symptom_conditions = [
        SYMPTOM_MAP[token] for token in tokens
        if token in SYMPTOM_MAP and token not in BODY_PART_MAP
    ]

    conditions = body_conditions + symptom_conditions

    if not conditions:
        return None

    # determine subject - use first pronoun found
    subject = 'I'
    for token in tokens:
        if token in SUBJECT_WORDS:
            subject = SUBJECT_WORDS[token]
            break

    condition_str = ' and '.join(conditions)

    if has_negation:
        translation = f'{subject} do not have {condition_str}'
    else:
        translation = f'{subject} have {condition_str}'

    return {
        'translated_text': translation,
        'confidence': round(coverage, 3),
        'match_type': 'lexicon',
        'has_negation': has_negation,
        'subject': subject,
        'conditions': conditions,
        'tokens_matched': known_tokens
    }


def _level2_lexicon(tokens: list) -> dict or None:
    """
    Apply rule-based translation using lexicon coverage.
    Uses known tokens to construct an English sentence via rule engine.
    :param tokens: list of tokenized Warlpiri words.
    :return: translated dictionary or None if insufficient coverage.
    """
    result = _build_translation(tokens)
    return result


#  Level 3 - Fuzzy full phrase match
def _level3_fuzzy_phrase(query: str) -> dict or None:
    """
    Perform fuzzy matching against known full phrases.
    Helps handle minor spelling errors or variations in input.
    :param query: Input text query.
    :return: translated dictionary or None if confidence below threshold.
    """
    match, score, _ = process.extractOne(query, PHRASE_MAP.keys())
    confidence = score / 100

    if confidence >= THRESHOLD_FUZZY_PHRASE:
        return {
            'translated_text': PHRASE_MAP[match],
            'matched_phrase': match,
            'confidence': round(confidence, 3),
            'match_type': 'fuzzy_phrase'
        }
    return None


#  Level 4 - Fuzzy token match
def _level4_fuzzy_tokens(tokens: list) -> dict or None:
    """
    Perform fuzzy matching against known full phrases.
    Helps handle minor spelling errors or variations in input.
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
        result['confidence'] = round(result['confidence'] * avg_token_score, 3)
        result['match_type'] = 'fuzzy_token'
        result['token_scores'] = {
            original: score
            for original, score in zip(tokens, token_scores)
        }
        return result

    return None


#  Main entry point
def translate(warlpiri_input: str) -> dict:
    """
    Translate Warlpiri text input to English using a 4-level pipeline rule.
    :param warlpiri_input: Raw Warlpiri text string from user
    :return: Dict with translated_text (or None if no match)
    """
    query = warlpiri_input.lower().strip()
    tokens = query.split()

    base = {
        'input_type': 'text',
        'original': warlpiri_input,
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
        'translated_text': None,
        'confidence': 0.0,
        'match_type': 'no_match',
        'message': 'Phrase not recognised. Please use the body map or voice input.'
    }
