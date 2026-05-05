"""
Audio service for stitching and encoding audio files.
Loads audio files from data/audio/output/ subfolders and returns base64 encoded WAV.
"""

import base64
import io
import json
import logging
import os

from pydub import AudioSegment
from pydub.effects import normalize

from backend.constants import Language

logger = logging.getLogger(__name__)

_BASE_DIR = os.path.dirname(__file__)
_AUDIO_DIR = os.path.join(_BASE_DIR, '../../data/audio/output')
_MAP_PATH = os.path.join(_BASE_DIR, '../../data/audio/audio_map.json')

SILENCE_MS = 400
TARGET_DBFS = -20.0

with open(_MAP_PATH, 'r') as file:
    _AUDIO_MAP = json.load(file)

# map audio_map sections to subfolders
_SUBFOLDER_MAP = {
    'questions': 'questions',
    'answers': 'answers',
    'symptoms': 'symptoms',
    'ui': 'ui',
    'severity': 'ui',
}


def _get_filename(section: str, key: str, language: str) -> str | None:
    """
    Look up a filename from audio_map.json by section, key, and language.
    :param section: Top-level section in audio_map.json (e.g. 'questions', 'symptoms')
    :param key: Key within the section (e.g. 'q_gender', 'fever')
    :param language: Language code - 'en' or 'wp'
    :return: Filename string or None if not found
    """
    try:
        return _AUDIO_MAP[section][key][language]
    except KeyError:
        return None


def _load_clip(filename: str, section: str) -> AudioSegment | None:
    """
    Load and normalise a WAV file from the correct audio subfolder.
    :param filename: Filename from audio_map.json
    :param section: Section name used to resolve the subfolder path
    :return: Normalised AudioSegment or None if file is missing or unreadable
    """
    if not filename:
        return None
    path = os.path.join(_AUDIO_DIR, section, filename)
    if not os.path.exists(path):
        logger.warning(f'Audio file not found: {path}')
        return None
    try:
        return normalize(AudioSegment.from_wav(path))
    except Exception as e:
        logger.error(f'Audio load failed for {path}: {e}')
        return None


def _get_clip(section: str, key: str, language: str) -> AudioSegment | None:
    """
    Get a clip by section/key/language with English fallback.
    Returns None if file not found in either language.
    :param section: Top-level section in audio_map.json (e.g. 'questions', 'symptoms')
    :param key: Key within the section (e.g. 'q_gender', 'fever')
    :param language: Language code - 'en' or 'wp'
    :return: Normalised AudioSegment or None if not found in either language
    """
    filename = _get_filename(section, key, language)
    if not filename and language == Language.WP:
        filename = _get_filename(section, key, Language.EN)
    return _load_clip(filename, section)


def _stitch(clips: list) -> AudioSegment:
    """
    Concatenate audio clips with a silence gap between each.
    None entries in the list are skipped.
    :param clips: List of AudioSegment objects or None values
    :return: Single concatenated AudioSegment
    """
    silence = AudioSegment.silent(duration=SILENCE_MS)
    result = AudioSegment.empty()
    valid = [clip for clip in clips if clip is not None]
    for i, clip in enumerate(valid):
        result += clip
        if i < len(valid) - 1:
            result += silence
    return result


def _to_b64(audio: AudioSegment) -> str:
    """
    Export an AudioSegment to a base64-encoded WAV string.
    :param audio: AudioSegment to encode
    :return: Base64-encoded WAV string
    """
    buffer = io.BytesIO()
    audio.export(buffer, format='wav')
    return base64.b64encode(buffer.getvalue()).decode()


def _normalize_clip(clip: AudioSegment) -> AudioSegment:
    """
    Normalise a clip to a consistent target loudness level.
    :param clip: AudioSegment to normalise
    :return: Gain-adjusted AudioSegment at TARGET_DBFS
    """
    return normalize(clip).apply_gain(TARGET_DBFS - normalize(clip).dBFS)


# map question ids to audio_map question keys
_QUESTION_AUDIO_KEY_MAP = {
    '0a': 'q_gender',
    '0b': 'q_age',
    '1': 'q_duration',
    '2': 'q_pain_intensity',
    '10': 'q_fever_high',
    '11': 'q_fever_chills',
    '12': 'q_headache_sudden',
    '13': 'q_stiff_neck',
    '14': 'q_chest_spread',
    '15': 'q_chest_sudden',
    '16': 'q_breath_rest',
    '17': 'q_breath_sudden',
    '18': 'q_pain_severe',
    '19': 'q_abdominal_nausea',
    '20': 'q_cough_blood',
    '21': 'q_cough_duration',
    '22': 'q_dizziness_faint',
    '23': 'q_consciousness_lost',
    '24': 'q_vomiting_count',
    '25': 'q_vomiting_fluids',
    '26': 'q_diarrhea_blood',
    '27': 'q_diarrhea_dehydrated',
}

# map question option ids to answer map keys
_OPTION_ANSWER_KEY_MAP = {
    '0a1': 'answer_male',
    '0a2': 'answer_female',
    '0b1': 'answer_child',
    '0b2': 'answer_youth',
    '0b3': 'answer_adult',
    '0b4': 'answer_elder',
    '1a': 'answer_today',
    '1b': 'answer_yesterday',
    '1c': 'answer_2_3_days',
    '1d': 'answer_about_a_week',
    '1e': 'answer_more_than_a_week',
    '2a': 'answer_none',
    '2b': 'answer_a_little',
    '2c': 'answer_moderate',
    '2d': 'answer_very_bad',
    '2e': 'answer_unbearable',
}


def get_question_audio(question_id: str, options: list, language: str) -> str:
    """
    Stitch question audio + all answer option audios into one clip.
    Falls back to English if Warlpiri file is missing.

    :param question_id: question id from questions.json
    :param options: list of answer option dicts with 'id' field
    :param language: 'en' or 'wp'
    :return: base64 encoded WAV string
    """
    audio_key = _QUESTION_AUDIO_KEY_MAP.get(question_id)
    if not audio_key:
        logger.error(f'No audio key mapping for question {question_id}')
        return _to_b64(AudioSegment.silent(duration=100))

    clips = [_get_clip('questions', audio_key, language)]
    for option in options:
        option_id = option.get('id', '')
        if option_id.endswith('y'):
            answer_key = 'answer_yes'
        elif option_id.endswith('n'):
            answer_key = 'answer_no'
        else:
            answer_key = _OPTION_ANSWER_KEY_MAP.get(option_id)
            if not answer_key:
                logger.warning(f'No answer audio key for option {option_id}')
                continue
        clips.append(_get_clip('answers', answer_key, language))

    return _to_b64(_stitch(clips))


def get_detected_symptoms_audio(symptoms: list, language: str) -> str:
    """
    Stitch: 'Detected Symptoms' + each symptom name + 'Tap yes or no'.

    :param symptoms: list of symptom id strings e.g. ['fever', 'chest_pain']
    :param language: 'en' or 'wp'
    :return: base64 encoded WAV string
    """
    if not symptoms:
        logger.warning('get_detected_symptoms_audio called with empty symptoms list')

    clips = [_get_clip('ui', 'detected_symptoms', language)]
    for symptom_id in symptoms:
        clip = _get_clip('symptoms', symptom_id, language)
        if clip is None:
            logger.warning(f'No audio found for symptom: {symptom_id}')
        clips.append(clip)
    clips.append(_get_clip('ui', 'tap_yes_or_no', language))

    return _to_b64(_stitch(clips))


def get_severity_audio(severity: str, language: str) -> str:
    """
    Get severity result audio.

    :param severity: severity level string - 'mild', 'moderate', or 'severe'
    :param language: 'en' or 'wp'
    :return: base64 encoded WAV string
    """
    key = f'severity_{severity.lower()}'
    clip = _get_clip('severity', key, language)

    # fallback to silence if file missing
    if clip is None:
        logger.error(f'Severity audio not found: {key} ({language}) - returning silence')
        return _to_b64(AudioSegment.silent(duration=100))

    return _to_b64(clip)


def get_answer_selected_audio(answer_id: str, language: str) -> str:
    """
    Stitch 'You selected' + answer label audio.
    Used in answer audio resolution response.

    :param answer_id: resolved answer id e.g. '0a1', '10y'
    :param language: 'en' or 'wp'
    :return: base64 encoded WAV string
    """
    clips = [_get_clip('ui', 'you_selected', language)]
    if answer_id.endswith('y'):
        clips.append(_get_clip('answers', 'answer_yes', language))
    elif answer_id.endswith('n'):
        clips.append(_get_clip('answers', 'answer_no', language))
    else:
        audio_key = _OPTION_ANSWER_KEY_MAP.get(answer_id)
        if not audio_key:
            logger.error(f'No audio key for answer_id: {answer_id}')
        else:
            clips.append(_get_clip('answers', audio_key, language))
    return _to_b64(_stitch(clips))


def get_unrecognized_audio(language: str) -> str:
    """
    Get 'could not understand' audio for unrecognized spoken answers.

    :param language: 'en' or 'wp'
    :return: base64 encoded WAV string
    """
    clip = _get_clip('ui', 'could_not_catch', language)
    if clip is None:
        logger.error(f'could_not_catch audio missing for language: {language}')
        return _to_b64(AudioSegment.silent(duration=100))
    return _to_b64(clip)
