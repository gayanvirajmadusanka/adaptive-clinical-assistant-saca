"""
Resolves spoken audio answers to answer IDs.
"""

import base64
import json
import os
import tempfile

from backend.api.schemas.request_response import AnswerAudioResponse
from backend.api.services.audio_service import get_unrecognized_audio, get_answer_selected_audio
from backend.constants import Language
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

# override keywords for options where label text is not naturally spoken
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
    """
    Build flat keyword -> answer_id map from questions.json.
    Both English and Warlpiri keywords in one map.
    Yes/no map to 'yes'/'no' for dynamic resolution per question_id.
    :return: Dict mapping keyword string to answer_id or 'yes'/'no'
    """
    result = {
        # yes/no hardcoded since they span all symptom questions
        'yes': 'yes', 'yuwayi': 'yes', 'yep': 'yes', 'yeah': 'yes',
        'no': 'no', 'lawa': 'no', 'nope': 'no', 'nah': 'no',
    }

    for question in _QUESTIONS['mandatory']:
        if 'options' not in question:
            continue
        for option in question['options']:
            oid = option['id']
            wp_word = option.get('text_wp', '').lower().strip()

            # warlpiri keyword - skip reserved yes/no
            if wp_word and wp_word not in _WP_RESERVED:
                result[wp_word] = oid

            # english keywords - use overrides if defined, else derive from option text
            if oid in _EN_KEYWORD_OVERRIDES:
                for key_word in _EN_KEYWORD_OVERRIDES[oid]:
                    result[key_word.lower()] = oid
            else:
                result[option['text'].lower().strip()] = oid

    return result


KEYWORD_TO_ANSWER = _build_keyword_to_answer()


def _resolve_keyword(keyword: str, question_id: str) -> str | None:
    """
    Resolve a single keyword to an answer_id.
    Works for both English and Warlpiri keywords.
    For yes/no maps 'yes'/'no' to dynamic ids like '10y'/'10n'.
    :param keyword: Spoken or matched keyword string
    :param question_id: The question being answered (used for yes/no resolution)
    :return: Resolved answer_id string, or None if no mapping exists
    """
    mapped = KEYWORD_TO_ANSWER.get(keyword.lower())
    if not mapped:
        return None
    if mapped == 'yes' and question_id in YES_NO_QUESTION_IDS:
        return question_id + 'y'
    if mapped == 'no' and question_id in YES_NO_QUESTION_IDS:
        return question_id + 'n'
    return mapped


def _recognised(base: dict, answer_id: str, confidence: float) -> dict:
    """
    Build a successful answer recognition result dict.
    :param base: Base dict containing at minimum {'question_id': ...}
    :param answer_id: The resolved answer id (e.g. '0a1', '10y')
    :param confidence: Recognition confidence score
    :return: Result dict with recognized=True and the resolved answer_id
    """
    return {**base, 'recognized': True, 'answer_id': answer_id, 'confidence': round(confidence, 3), 'message': None}


def _unrecognised(base: dict, message: str, confidence: float = 0.0) -> dict:
    """
    Build a failed answer recognition result dict.
    :param base: Base dict containing at minimum {'question_id': ...}
    :param message: Human-readable reason for failure shown to the frontend
    :param confidence: Recognition confidence score, defaults to 0.0
    :return: Result dict with recognized=False and answer_id=None
    """
    return {**base, 'recognized': False, 'answer_id': None, 'confidence': confidence, 'message': message}


def _b64_to_tempfile(audio_b64: str) -> str | None:
    """
    Decode base64 audio and write to a temp WAV file.
    :param audio_b64: Base64-encoded WAV audio string
    :return: Path to the temporary file, or None if decoding fails
    """
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
    """
    Delete a temporary file, silently ignoring errors.
    :param path: Filesystem path of the file to delete
    """
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except Exception:
        pass


def _match_keywords(spoken_text: str, question_id: str) -> tuple | None:
    """
    Match transcribed text against all keywords for the given question.
    :param spoken_text: Transcribed text from the ASR engine
    :param question_id: The question being answered
    :return: Tuple of (answer_id, confidence) for the best match, or None if no match
    """
    spoken_lower = spoken_text.lower().strip()
    best_answer_id = None
    best_score = 0.0

    for keyword, mapped in KEYWORD_TO_ANSWER.items():
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
        language: str = Language.EN
) -> AnswerAudioResponse:
    """
    Resolve spoken audio to an answer ID for the given question.

    :param audio_b64: base64 encoded WAV audio
    :param question_id: the question being answered
    :param language: 'en' or 'wp'
    :return: AnswerAudioResponse with answer_id, confidence, recognized, and confirmation audio
    """
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

        if result['recognized'] and result['answer_id']:
            voice_b64 = get_answer_selected_audio(result['answer_id'], language)
        else:
            voice_b64 = get_unrecognized_audio(language)

        return AnswerAudioResponse(**result, voice_b64=voice_b64)
    finally:
        _cleanup(tmp_path)


def _resolve_english(tmp_path: str, question_id: str, base: dict) -> dict:
    """
    Resolve an English spoken answer.
    :param tmp_path: Path to a temporary WAV file containing the audio
    :param question_id: The question being answered
    :param base: Base dict passed through to _recognised/_unrecognised helpers
    :return: Recognition result dict
    """
    transcription = transcribe_english(tmp_path)
    if not transcription['success'] or not transcription['text']:
        return _unrecognised(base, 'Could not transcribe audio. Please tap your answer instead.')

    result = _match_keywords(transcription['text'], question_id)
    if result:
        answer_id, confidence = result
        return _recognised(base, answer_id, confidence)

    return _unrecognised(base, 'Could not match spoken answer. Please tap your answer instead.')


def _resolve_warlpiri(tmp_path: str, question_id: str, base: dict) -> dict:
    """
    Resolve a Warlpiri spoken answer.
    :param tmp_path: Path to a temporary WAV file containing the audio
    :param question_id: The question being answered
    :param base: Base dict passed through to _recognised/_unrecognised helpers
    :return: Recognition result dict
    """
    # result = recognize_warlpiri(tmp_path) TODO: implement recognize function in audio_warlpiri.py and uncomment this line
    result = {}

    if not result.get('recognized') or not result.get('matched_keywords'):
        return _unrecognised(base, 'Lawa nyangu. Milkikarriya.')

    best_keyword = min(result['matched_keywords'], key=result['matched_keywords'].get)
    answer_id = _resolve_keyword(best_keyword, question_id)

    if not answer_id:
        return _unrecognised(base, f'Keyword matched but not an answer for this question: {best_keyword}',
                             confidence=result.get('confidence', 0.0))

    return _recognised(base, answer_id, result.get('confidence', 0.0))
