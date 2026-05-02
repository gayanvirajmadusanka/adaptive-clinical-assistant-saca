"""
Resolves spoken audio answers to answer IDs.
"""

import base64
import json
import os
import tempfile

from backend.speech.audio_english import transcribe as transcribe_english

# from backend.speech.audio_warlpiri import recognize as recognize_warlpiri

_questions_path = os.path.join(os.path.dirname(__file__), '../../data/questions.json')
with open(_questions_path, encoding='utf-8') as file:
    _QUESTIONS = json.load(file)

_WP_RESERVED = {'yuwayi', 'lawa'}

YES_NO_QUESTION_IDS = {
    question['id']
    for questions in _QUESTIONS['symptom_questions'].values()
    for question in questions
    if question.get('type') == 'yes_no'
}

# Warlpiri keyword -> answer_id
# yes/no map to 'yes'/'no' which get resolved dynamically per question_id
WARLPIRI_KEYWORD_TO_ANSWER = {
    'yuwayi': 'yes',
    'lawa': 'no',
}

# override keywords for options where label text isn't what someone would say
_EN_KEYWORD_OVERRIDES = {
    '0b1': ['child', 'kid'],
    '0b2': ['youth', 'young', 'teen'],
    '0b3': ['adult'],
    '0b4': ['elder', 'old', 'elderly'],
    '1c': ['two', 'three', 'days', 'pirrarnijarrakurra'],
    '1d': ['week', 'wiikikurra', 'about a week'],
    '1e': ['more', 'longer', 'wiikipanukurra'],
    '2b': ['little', 'witapardu', 'bit', 'slight'],
    '2d': ['bad', 'wirinyayirni', 'very', 'severe'],
    '2e': ['unbearable', 'kuurrnyinamijuku', 'worst'],
}


def _build_answer_keywords() -> dict:
    """
    Build answer_id -> keyword list map for each mandatory question.
    Derived from questions.json.
    """
    result = {
        'yes_no': {
            'yes': ['yes', 'yuwayi', 'yep', 'yeah'],
            'no': ['no', 'lawa', 'nope', 'nah']
        }
    }
    for question in _QUESTIONS['mandatory']:
        if 'options' not in question:
            continue
        qid = question['id']
        result[qid] = {}
        for option in question['options']:
            oid = option['id']
            wp_word = option.get('text_wp', '').lower().strip()

            if oid in _EN_KEYWORD_OVERRIDES:
                result[qid][oid] = _EN_KEYWORD_OVERRIDES[oid]
            else:
                en_text = option['text'].lower().strip()
                result[qid][oid] = [en_text, wp_word]

            # only add to warlpiri map if not a reserved yes/no keyword
            if wp_word and wp_word not in _WP_RESERVED:
                WARLPIRI_KEYWORD_TO_ANSWER[wp_word] = oid

    return result


QUESTION_ANSWER_KEYWORDS = _build_answer_keywords()


def _b64_to_tempfile(audio_b64: str) -> str | None:
    """Decode base64 audio and write to a temp WAV file."""
    try:
        audio_bytes = base64.b64decode(audio_b64)
        tmp = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
        tmp.write(audio_bytes)
        tmp.close()
        return tmp.name
    except Exception as e:
        print(f'Failed to decode audio b64: {e}')
        return None


def _cleanup(path: str):
    """Delete temp file."""
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except Exception:
        pass


def _build_answer_map(question_id: str) -> dict | None:
    """
    Build answer_id -> keywords map for a given question.
    For yes/no questions dynamically builds ids like '10y', '10n'.
    """
    if question_id in YES_NO_QUESTION_IDS:
        yes_no = QUESTION_ANSWER_KEYWORDS['yes_no']
        return {
            question_id + 'y': yes_no['yes'],
            question_id + 'n': yes_no['no']
        }
    return QUESTION_ANSWER_KEYWORDS.get(question_id)


def _match_keywords(spoken_text: str, answer_map: dict) -> tuple | None:
    """
    Match transcribed text against keyword lists.
    Returns (answer_id, confidence) or None.
    """
    spoken_lower = spoken_text.lower().strip()
    best_answer_id = None
    best_score = 0.0

    for answer_id, keywords in answer_map.items():
        for keyword in keywords:
            if keyword in spoken_lower:
                score = 1.0 if spoken_lower == keyword else 0.85
                if score > best_score:
                    best_score = score
                    best_answer_id = answer_id

    return (best_answer_id, best_score) if best_answer_id else None


def _resolve_warlpiri_keyword(keyword: str, question_id: str) -> str | None:
    """
    Map a DTW-matched Warlpiri keyword to an answer_id.
    For yes/no questions maps 'yes'/'no' to dynamic ids like '10y'/'10n'.
    """
    mapped = WARLPIRI_KEYWORD_TO_ANSWER.get(keyword)
    if not mapped:
        return None
    if mapped == 'yes' and question_id in YES_NO_QUESTION_IDS:
        return question_id + 'y'
    if mapped == 'no' and question_id in YES_NO_QUESTION_IDS:
        return question_id + 'n'
    return mapped


def resolve_answer_audio(
        audio_b64: str,
        question_id: str,
        language: str = 'en'
) -> dict:
    """
    Resolve spoken audio to an answer ID for the given question.

    :param audio_b64: base64 encoded WAV audio
    :param question_id: the question being answered
    :param language: 'en' or 'wp'
    :return: dict with answer_id, confidence, recognized
    """
    base = {'question_id': question_id}

    tmp_path = _b64_to_tempfile(audio_b64)
    if not tmp_path:
        return {
            **base,
            'recognized': False,
            'answer_id': None,
            'confidence': 0.0,
            'message': 'Invalid audio encoding.'
        }

    try:
        if language == 'wp':
            return _resolve_warlpiri(tmp_path, question_id, base)
        else:
            return _resolve_english(tmp_path, question_id, base)
    finally:
        _cleanup(tmp_path)


def _resolve_english(tmp_path: str, question_id: str, base: dict) -> dict:
    """English answer resolution via Whisper transcription + keyword matching."""
    answer_map = _build_answer_map(question_id)
    if not answer_map:
        return {
            **base,
            'recognized': False,
            'answer_id': None,
            'confidence': 0.0,
            'message': f'No answer mapping defined for question {question_id}'
        }

    transcription = transcribe_english(tmp_path)
    if not transcription['success'] or not transcription['text']:
        return {
            **base,
            'recognized': False,
            'answer_id': None,
            'confidence': 0.0,
            'message': 'Could not transcribe audio. Please tap your answer instead.'
        }

    result = _match_keywords(transcription['text'], answer_map)
    if result:
        answer_id, confidence = result
        return {
            **base,
            'recognized': True,
            'answer_id': answer_id,
            'confidence': round(confidence, 3),
            'message': None
        }

    return {
        **base,
        'recognized': False,
        'answer_id': None,
        'confidence': 0.0,
        'message': 'Could not match spoken answer. Please tap your answer instead.'
    }


def _resolve_warlpiri(tmp_path: str, question_id: str, base: dict) -> dict:
    """Warlpiri answer resolution via VAD+DTW keyword spotting."""
    # result = recognize_warlpiri(tmp_path) TODO: implement recognize function in audio_warlpiri.py and uncomment this line
    result = {}

    if not result.get('recognized') or not result.get('matched_keywords'):
        return {
            **base,
            'recognized': False,
            'answer_id': None,
            'confidence': 0.0,
            'message': 'Could not recognise Warlpiri answer. Please tap your answer instead.'
        }

    best_keyword = min(result['matched_keywords'], key=result['matched_keywords'].get)
    answer_id = _resolve_warlpiri_keyword(best_keyword, question_id)

    if not answer_id:
        return {
            **base,
            'recognized': False,
            'answer_id': None,
            'confidence': result.get('confidence', 0.0),
            'message': f'Keyword matched but not an answer for this question: {best_keyword}'
        }

    return {
        **base,
        'recognized': True,
        'answer_id': answer_id,
        'confidence': result.get('confidence', 0.0),
        'message': None
    }
