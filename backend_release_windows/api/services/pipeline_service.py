"""
Pipeline service.
Orchestrates answer resolution, ML inference, and symptom translation.
"""
import json
import os
from dataclasses import asdict

from backend_release_windows.api.questions.questions_module import resolve_answers
from backend_release_windows.api.schemas.request_response import ClassifyResponse
from backend_release_windows.api.services.audio_service import convert_to_wav
from backend_release_windows.constants import Language
from backend_release_windows.ml.predictor import TriagePredictor
from backend_release_windows.nlp.preprocessor import preprocess_text
from backend_release_windows.nlp.symptom_extractor import extract_symptoms
from backend_release_windows.speech.audio_english import transcribe
from backend_release_windows.speech.audio_warlpiri import recognize as recognize_warlpiri
from backend_release_windows.translation.warlpiri_text import translate as translate_warlpiri

_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_symptom_map_path = os.path.join(_BASE_DIR, '../data/warlpiri/symptom_map.json')
with open(_symptom_map_path, encoding='utf-8') as f:
    _SYMPTOM_MAP = json.load(f)

# symptom_id -> wp label
_ID_TO_WP = {key: value[Language.WP] for key, value in _SYMPTOM_MAP.items()}
_EN_TO_ID = {value['en']: key for key, value in _SYMPTOM_MAP.items()}
_EN_TO_WP = {value['en']: value['wp'] for value in _SYMPTOM_MAP.values()}

predictor = TriagePredictor(
    model_path=os.path.join(_BASE_DIR, '../models', 'mlp.pkl'),
    tfidf_path=os.path.join(_BASE_DIR, '../models', 'tfidf_vectorizer.pkl'),
    le_path=os.path.join(_BASE_DIR, '../models', 'label_encoder.pkl')
)


def classify(symptoms: list, answers: list, language: Language = Language.EN) -> ClassifyResponse:
    """
    Orchestrate the full classification pipeline.
    Resolves answers to signals then runs ML inference.
    :param symptoms: List of extracted English symptom strings
    :param answers: List of answer dicts from frontend
    :param language: Language code ('en' or 'wp') for symptom translation in the response
    :return: ClassifyResponse with severity, recommendation, and audio
    """
    resolved = resolve_answers(answers, symptoms)

    result = predictor.predict(
        symptoms=symptoms,
        age=resolved['age_group'],
        gender=resolved['gender'],
        duration_value=resolved['duration_value'],
        intensity_signal=resolved['intensity_signal'],
        has_critical=resolved['has_critical'],
        severity_context=resolved['intensity_signal'],
        language=language
    )

    return ClassifyResponse(
        symptoms=_translate_symptoms(symptoms, language),
        age_group=resolved.get('age_group'),
        gender=resolved.get('gender'),
        **asdict(result)
    )


def _translate_symptoms(symptoms: list, language: Language) -> list:
    """
    Translate English symptom strings to Warlpiri when language is 'wp'.
    Returns the original list unchanged for all other languages.
    :param symptoms: List of English symptom strings from the ML pipeline
    :param language: Language code ('en' or 'wp')
    :return: List of symptom strings in the requested language
    """
    if language != Language.WP:
        return symptoms
    return [_EN_TO_WP.get(symptom, symptom) for symptom in symptoms]


def process_text(text: str, language: Language) -> dict:
    """
    Process typed text input through NLP pipeline.
    :param text: raw text input from user
    :param language: 'en' or 'wp'
    :return: dict with symptoms_en, symptoms_wp, confidence
    """
    if language == Language.WP:
        translation = translate_warlpiri(text)
        english_text = translation.get("translated_text") or ""
    else:
        english_text = text

    if not english_text.strip():
        return {"symptoms_en": [], "symptoms_wp": [], "confidence": 0.0}

    preprocessed = preprocess_text(english_text)
    symptoms_en = extract_symptoms(preprocessed["clean_text"], raw_text=english_text)
    confidence = 0.99 if symptoms_en else 0.0
    symptoms_wp = [_EN_TO_WP.get(s, s) for s in symptoms_en] if language == Language.WP else []

    return {"symptoms_en": symptoms_en, "symptoms_wp": symptoms_wp, "confidence": confidence}


def process_audio(audio_bytes: bytes, language: Language) -> dict:
    """
    Process audio input through NLP pipeline.
    :param audio_bytes: raw WAV audio bytes
    :param language: 'en' or 'wp'
    :return: dict with symptoms_en, symptoms_wp, confidence
    """
    tmp_path = None
    try:
        tmp_path = convert_to_wav(audio_bytes)
        if language == Language.EN:
            asr = transcribe(tmp_path)
            english_text = asr.get("text", "") or ""
            if not english_text.strip():
                return {"symptoms_en": [], "symptoms_wp": [], "confidence": 0.0}
            preprocessed = preprocess_text(english_text)
            symptoms_en = extract_symptoms(preprocessed["clean_text"], raw_text=english_text)
            return {
                "symptoms_en": symptoms_en,
                "symptoms_wp": [],
                "confidence": asr.get("confidence") or (0.99 if symptoms_en else 0.0)
            }

        elif language == Language.WP:
            wp_result = recognize_warlpiri(tmp_path)
            if not wp_result.get("recognized") or not wp_result.get("symptoms"):
                return {"symptoms_en": [], "symptoms_wp": [], "confidence": 0.0}
            symptoms_en = wp_result["symptoms"]
            symptoms_wp = [_EN_TO_WP.get(s, s) for s in symptoms_en]
            return {
                "symptoms_en": symptoms_en,
                "symptoms_wp": symptoms_wp,
                "confidence": wp_result.get("confidence", 0.0)
            }

        return {"symptoms_en": [], "symptoms_wp": [], "confidence": 0.0}

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


def symptoms_to_ids(symptoms_en: list) -> list:
    """
    Convert English symptom strings to symptom_map keys for audio service.
    e.g. "chest pain" -> "chest_pain"
    :param symptoms_en: list of English symptom strings
    :return: list of symptom_map key strings
    """
    return [_EN_TO_ID.get(s, s.replace(" ", "_")) for s in symptoms_en]
