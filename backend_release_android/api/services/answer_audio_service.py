import base64
import json
import os

from backend_release_android.api.schemas.request_response import AnswerAudioResponse
from backend_release_android.api.services.audio_service import (
    get_unrecognized_audio, get_answer_selected_audio, convert_to_wav
)
from backend_release_android.constants import Language
from backend_release_android.speech.audio_english import transcribe as transcribe_english
from backend_release_android.speech.audio_warlpiri import recognize as recognize_warlpiri

_questions_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    'data', 'questions.json'
)
with open(_questions_path, encoding='utf-8') as _f:
    _QUESTIONS = json.load(_f)

_WP_RESERVED = {'yuwayi', 'lawa'}

YES_NO_QUESTION_IDS = {
    question['id']
    for questions in _QUESTIONS['symptom_questions'].values()
    for question in questions
    if question.get('type') == 'yes_no'
}
YES_NO_QUESTION_IDS.add('confirm_symptoms')

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


def _build_keyword_to_answer() -> dict:
    result = {
        'yes': 'yes', 'yuwayi': 'yes', 'yep': 'yes', 'yeah': 'yes',
        'no': 'no', 'lawa': 'no', 'nope': 'no', 'nah': 'no',
    }
    for question in _QUESTIONS['mandatory']:
        if 'options' not in question:
            continue
        for option in question['options']:
            oid = option['id']
            wp_word = option.get('text_wp', '').lower().strip()
            if wp_word and wp_word not in _WP_RESERVED:
                result[wp_word] = oid
            if oid in _EN_KEYWORD_OVERRIDES:
                for kw in _EN_KEYWORD_OVERRIDES[oid]:
                    result[kw.lower()] = oid
            else:
                result[option['text'].lower().strip()] = oid
    return result


KEYWORD_TO_ANSWER = _build_keyword_to_answer()


def _build_question_wp_keywords() -> dict:
    """
    Map from question_id to the set of valid Warlpiri keywords for that question.
    Passed to recognize_warlpiri() to restrict DTW matching to only the answer words
    relevant to the current question.
    """
    mapping = {}
    for question in _QUESTIONS['mandatory']:
        qid = question['id']
        kws = {opt.get('text_wp', '').lower().strip()
               for opt in question.get('options', [])
               if opt.get('text_wp', '').strip()}
        if kws:
            mapping[qid] = kws
    for qid in YES_NO_QUESTION_IDS:
        mapping[qid] = {'yuwayi', 'lawa'}
    return mapping


_QUESTION_WP_KEYWORDS = _build_question_wp_keywords()


def _get_valid_wp_keywords(question_id: str):
    return _QUESTION_WP_KEYWORDS.get(question_id)


def _resolve_keyword(keyword: str, question_id: str) -> str | None:
    mapped = KEYWORD_TO_ANSWER.get(keyword.lower())
    if not mapped:
        return None
    if mapped == 'yes' and question_id in YES_NO_QUESTION_IDS:
        return question_id + 'y'
    if mapped == 'no' and question_id in YES_NO_QUESTION_IDS:
        return question_id + 'n'
    return mapped


def _recognised(base: dict, answer_id: str, confidence: float) -> dict:
    return {**base, 'recognized': True, 'answer_id': answer_id,
            'confidence': round(confidence, 3), 'message': None}


def _unrecognised(base: dict, message: str, confidence: float = 0.0) -> dict:
    return {**base, 'recognized': False, 'answer_id': None,
            'confidence': confidence, 'message': message}


def _b64_to_tempfile(audio_b64: str) -> str | None:
    try:
        audio_bytes = base64.b64decode(audio_b64)
        return convert_to_wav(audio_bytes)
    except Exception as e:
        print(f'Failed to decode/convert audio: {e}')
        return None


def _cleanup(path: str):
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except Exception:
        pass


def _match_keywords(spoken_text: str, question_id: str) -> tuple | None:
    spoken_lower = spoken_text.lower().strip()
    best_answer_id = None
    best_score = 0.0
    for keyword, mapped in sorted(KEYWORD_TO_ANSWER.items(), key=lambda x: len(x[0]), reverse=True):
        if keyword in spoken_lower:
            answer_id = _resolve_keyword(keyword, question_id)
            if not answer_id:
                continue
            score = 1.0 if spoken_lower == keyword else 0.85
            if score > best_score:
                best_score = score
                best_answer_id = answer_id
    return (best_answer_id, best_score) if best_answer_id else None


def resolve_answer_audio(
        audio_b64: str,
        question_id: str,
        language: Language = Language.EN
) -> AnswerAudioResponse:
    base = {'question_id': question_id}
    tmp_path = _b64_to_tempfile(audio_b64)

    if not tmp_path:
        result = _unrecognised(base, 'Invalid audio encoding.')
        return AnswerAudioResponse(**result, voice_b64=get_unrecognized_audio(language))

    try:
        if language == Language.WP:
            result = _resolve_warlpiri(tmp_path, question_id, base)
        else:
            result = _resolve_english(tmp_path, question_id, base)

        voice_b64 = (
            get_answer_selected_audio(result['answer_id'], language)
            if result['recognized'] and result['answer_id']
            else get_unrecognized_audio(language)
        )
        return AnswerAudioResponse(**result, voice_b64=voice_b64)
    finally:
        _cleanup(tmp_path)


def _resolve_english(tmp_path: str, question_id: str, base: dict) -> dict:
    transcription = transcribe_english(tmp_path)
    if not transcription['success'] or not transcription['text']:
        return _unrecognised(base, 'Could not transcribe audio. Please tap your answer instead.')
    result = _match_keywords(transcription['text'], question_id)
    if result:
        answer_id, confidence = result
        return _recognised(base, answer_id, confidence)
    return _unrecognised(base, 'Could not match spoken answer. Please tap your answer instead.')


def _resolve_warlpiri(tmp_path: str, question_id: str, base: dict) -> dict:
    allowed = _get_valid_wp_keywords(question_id)
    result = recognize_warlpiri(tmp_path, allowed_keywords=allowed)
    if not result.get('recognized') or not result.get('matched_keywords'):
        return _unrecognised(base, 'Lawa nyangu. Milkikarriya.')
    best_keyword = min(result['matched_keywords'], key=result['matched_keywords'].get)
    answer_id = _resolve_keyword(best_keyword, question_id)
    if not answer_id:
        return _unrecognised(
            base, f'Wangkaya nyangu, kala japi-wangu: {best_keyword}',
            confidence=result.get('confidence', 0.0)
        )
    return _recognised(base, answer_id, result.get('confidence', 0.0))
