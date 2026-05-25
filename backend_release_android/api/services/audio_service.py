"""
Audio service: WAV stitching and base64 encoding without pydub.
Uses stdlib wave + numpy + scipy for Android compatibility.
"""

import base64
import io
import json
import logging
import math
import os
import tempfile
import wave

import numpy as np
import scipy.signal

from backend_release_android.constants import Language

logger = logging.getLogger(__name__)

_BASE_DIR  = os.path.dirname(__file__)
_AUDIO_DIR = os.path.join(_BASE_DIR, '..', '..', 'data', 'audio', 'output')
_MAP_PATH  = os.path.join(_BASE_DIR, '..', '..', 'data', 'audio', 'audio_map.json')

_TARGET_RATE = 22050  # output sample rate for all stitched audio
_SILENCE_MS  = 400    # silence gap between stitched clips
_TARGET_PEAK = 0.80   # normalisation target peak level

with open(_MAP_PATH, 'r') as _f:
    _AUDIO_MAP = json.load(_f)

_SUBFOLDER_MAP = {
    'questions': 'questions',
    'answers':   'answers',
    'symptoms':  'symptoms',
    'ui':        'ui',
    'severity':  'ui',
}


def _read_wav(path: str) -> tuple[np.ndarray, int] | tuple[None, None]:
    """Read WAV file as (float32 mono samples, framerate)."""
    try:
        with wave.open(path, 'rb') as w:
            n_channels = w.getnchannels()
            sampwidth  = w.getsampwidth()
            framerate  = w.getframerate()
            raw        = w.readframes(w.getnframes())

        if sampwidth == 2:
            samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
        elif sampwidth == 1:
            samples = np.frombuffer(raw, dtype=np.uint8).astype(np.float32) / 128.0 - 1.0
        elif sampwidth == 4:
            samples = np.frombuffer(raw, dtype=np.int32).astype(np.float32) / 2147483648.0
        else:
            return None, None

        if n_channels > 1:
            samples = samples.reshape(-1, n_channels).mean(axis=1)

        return samples.astype(np.float32), framerate
    except Exception as e:
        logger.error(f'Failed to read WAV {path}: {e}')
        return None, None


def _resample(samples: np.ndarray, in_rate: int, out_rate: int) -> np.ndarray:
    if in_rate == out_rate:
        return samples
    gcd = math.gcd(in_rate, out_rate)
    return scipy.signal.resample_poly(
        samples, out_rate // gcd, in_rate // gcd
    ).astype(np.float32)


def _normalize(samples: np.ndarray) -> np.ndarray:
    peak = np.max(np.abs(samples))
    if peak < 1e-6:
        return samples
    return np.clip(samples * (_TARGET_PEAK / peak), -1.0, 1.0)


def _samples_to_wav_bytes(samples: np.ndarray, rate: int = _TARGET_RATE) -> bytes:
    int_samples = np.clip(samples * 32767, -32768, 32767).astype(np.int16)
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(int_samples.tobytes())
    return buf.getvalue()


def _to_b64(samples: np.ndarray | None) -> str:
    if samples is None or len(samples) == 0:
        samples = np.zeros(100, dtype=np.float32)
    return base64.b64encode(_samples_to_wav_bytes(samples)).decode()


def _load_clip(path: str) -> np.ndarray | None:
    """Load WAV, resample to target rate, and normalize."""
    samples, rate = _read_wav(path)
    if samples is None:
        return None
    if rate != _TARGET_RATE:
        samples = _resample(samples, rate, _TARGET_RATE)
    return _normalize(samples)


def _stitch(clips: list) -> np.ndarray:
    """Concatenate clips with silence gaps; skip None entries."""
    silence = np.zeros(int(_TARGET_RATE * _SILENCE_MS / 1000), dtype=np.float32)
    valid   = [c for c in clips if c is not None and len(c) > 0]
    if not valid:
        return np.zeros(100, dtype=np.float32)

    parts = []
    for i, clip in enumerate(valid):
        parts.append(clip)
        if i < len(valid) - 1:
            parts.append(silence)
    return np.concatenate(parts)


def _get_filename(section: str, key: str, language: str) -> str | None:
    try:
        return _AUDIO_MAP[section][key][language]
    except KeyError:
        return None


def _get_clip_samples(section: str, key: str, language: str) -> np.ndarray | None:
    filename = _get_filename(section, key, language)
    if not filename and language == Language.WP:
        filename = _get_filename(section, key, Language.EN)
    if not filename:
        return None

    subfolder = _SUBFOLDER_MAP.get(section, section)
    path      = os.path.join(_AUDIO_DIR, subfolder, filename)
    if not os.path.exists(path):
        logger.warning(f'Audio file not found: {path}')
        return None
    return _load_clip(path)


# question id → audio_map key
_QUESTION_AUDIO_KEY_MAP = {
    '0a': 'q_gender',       '0b': 'q_age',             '1': 'q_duration',
    '2': 'q_pain_intensity', '10': 'q_fever_high',      '11': 'q_fever_chills',
    '12': 'q_headache_sudden', '13': 'q_stiff_neck',    '14': 'q_chest_spread',
    '15': 'q_chest_sudden',  '16': 'q_breath_rest',     '17': 'q_breath_sudden',
    '18': 'q_pain_severe',   '19': 'q_abdominal_nausea','20': 'q_cough_blood',
    '21': 'q_cough_duration','22': 'q_dizziness_faint', '23': 'q_consciousness_lost',
    '24': 'q_vomiting_count','25': 'q_vomiting_fluids', '26': 'q_diarrhea_blood',
    '27': 'q_diarrhea_dehydrated',
}

# option id → answer audio key
_OPTION_ANSWER_KEY_MAP = {
    '0a1': 'answer_male',    '0a2': 'answer_female',    '0b1': 'answer_child',
    '0b2': 'answer_youth',   '0b3': 'answer_adult',     '0b4': 'answer_elder',
    '1a': 'answer_today',    '1b': 'answer_yesterday',  '1c': 'answer_2_3_days',
    '1d': 'answer_about_a_week', '1e': 'answer_more_than_a_week',
    '2a': 'answer_none',     '2b': 'answer_a_little',   '2c': 'answer_moderate',
    '2d': 'answer_very_bad', '2e': 'answer_unbearable',
}


def get_question_audio(question_id: str, options: list, language: str) -> str:
    audio_key = _QUESTION_AUDIO_KEY_MAP.get(question_id)
    if not audio_key:
        logger.error(f'No audio key mapping for question {question_id}')
        return _to_b64(None)

    clips = [_get_clip_samples('questions', audio_key, language)]
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
        clips.append(_get_clip_samples('answers', answer_key, language))

    return _to_b64(_stitch(clips))


def get_detected_symptoms_audio(symptoms: list, language: str) -> str:
    if not symptoms:
        return _to_b64(_stitch([_get_clip_samples('ui', 'could_not_catch', language)]))

    clips = [_get_clip_samples('ui', 'detected_symptoms', language)]
    for symptom_id in symptoms:
        clip = _get_clip_samples('symptoms', symptom_id, language)
        if clip is None:
            logger.warning(f'No audio found for symptom: {symptom_id}')
        clips.append(clip)
    clips.append(_get_clip_samples('ui', 'tap_yes_or_no', language))
    return _to_b64(_stitch(clips))


def get_severity_audio(severity: str, language: str) -> str:
    key  = f'severity_{severity.lower()}'
    clip = _get_clip_samples('severity', key, language)
    if clip is None:
        logger.error(f'Severity audio not found: {key} ({language})')
        return _to_b64(None)
    return _to_b64(clip)


def get_answer_selected_audio(answer_id: str, language: str) -> str:
    clips = [_get_clip_samples('ui', 'you_selected', language)]
    if answer_id.endswith('y'):
        clips.append(_get_clip_samples('answers', 'answer_yes', language))
    elif answer_id.endswith('n'):
        clips.append(_get_clip_samples('answers', 'answer_no', language))
    else:
        audio_key = _OPTION_ANSWER_KEY_MAP.get(answer_id)
        if audio_key:
            clips.append(_get_clip_samples('answers', audio_key, language))
    return _to_b64(_stitch(clips))


def get_unrecognized_audio(language: str) -> str:
    clip = _get_clip_samples('ui', 'could_not_catch', language)
    if clip is None:
        return _to_b64(None)
    return _to_b64(clip)


def convert_to_wav(audio_bytes: bytes) -> str:
    """
    Write audio bytes to a temp WAV file for downstream ASR.

    Handles three cases in order:
      1. Already a valid WAV  → return as-is
      2. OGG / FLAC / other soundfile-readable format → decode and resample to 16kHz mono WAV
      3. Unknown format → write raw bytes with .wav extension and let ASR try

    The mobile app should send audio in WAV (iOS LINEARPCM) or OGG Vorbis (Android).
    """
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.audio')
    try:
        tmp.write(audio_bytes)
        tmp.close()
        tmp_name = tmp.name

        # Case 1: valid WAV
        try:
            with wave.open(tmp_name, 'rb') as w:
                if w.getnframes() > 0:
                    return tmp_name
        except Exception:
            pass

        # Case 2: soundfile-readable (OGG Vorbis, FLAC, etc.)
        try:
            import soundfile as sf
            data, sr = sf.read(tmp_name, dtype='float32', always_2d=False)
            if data.ndim > 1:
                data = data.mean(axis=1)
            if sr != 16000:
                gcd  = math.gcd(sr, 16000)
                data = scipy.signal.resample_poly(data, 16000 // gcd, sr // gcd)
            wav_bytes = _samples_to_wav_bytes(data.astype(np.float32), rate=16000)
            wav_path  = tmp_name + '.wav'
            with open(wav_path, 'wb') as f:
                f.write(wav_bytes)
            os.remove(tmp_name)
            return wav_path
        except Exception:
            pass

        # Case 3: fallback — return as-is and hope faster-whisper handles it
        return tmp_name

    except Exception:
        if os.path.exists(tmp.name):
            os.remove(tmp.name)
        raise
