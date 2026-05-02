import base64
import io
import os
import tempfile

from fastapi import APIRouter

from backend.api.questions.questions_module import get_questions
from backend.api.schemas.request_response import QuestionsRequest, QuestionsResponse, ClassifyRequest, ClassifyResponse, \
    ExtractResponse, ExtractTextRequest, ExtractAudioRequest, ExtractImageRequest
from backend.api.services.audio_service import get_detected_symptoms_audio
from backend.api.services.pipeline_service import classify as run_classify

from backend.nlp.preprocessor import preprocess_text
from backend.nlp.symptom_extractor import extract_symptoms
from backend.translation.warlpiri_text import translate as translate_warlpiri
from backend.speech.audio_english import transcribe
from backend.nlp.audio_warlpiri import recognize as recognize_warlpiri

LANG_WP = "wp"
LANG_EN = "en"

router = APIRouter()


@router.post('/extract/text', response_model=ExtractResponse)
def extract_text(req: ExtractTextRequest) -> dict:
    """
    Extract symptoms from typed text input.
    Warlpiri text is translated before extraction.
    English text is processed directly through NLP pipeline.
    :param req: ExtractTextRequest
    """
    if req.language == LANG_WP:
        translation  = translate_warlpiri(req.text)
        english_text = translation.get("translated_text") or ""
        is_warlpiri  = True
    else:
        english_text = req.text
        is_warlpiri  = False

    if not english_text.strip():
        voice_b64 = get_detected_symptoms_audio([], req.language)
        return {
            'symptoms_en': [], 'symptoms_wp': [],
            'confidence': 0.0, 'input_type': 'text',
            'language': req.language, 'voice_b64': voice_b64
        }

    preprocessed = preprocess_text(english_text)
    result       = extract_symptoms(preprocessed["clean_text"], is_warlpiri=is_warlpiri)
    voice_b64    = get_detected_symptoms_audio(result["symptoms_en"], req.language)

    return {
        'symptoms_en': result["symptoms_en"],
        'symptoms_wp': result["symptoms_wp"],
        'confidence':  result["confidence"],
        'input_type':  'text',
        'language':    req.language,
        'voice_b64':   voice_b64
    }


@router.post('/extract/audio', response_model=ExtractResponse)
def extract_audio(req: ExtractAudioRequest) -> dict:
    """
    Extract symptoms from audio input.
    English audio uses Whisper offline ASR.
    Warlpiri audio uses VAD segmentation and CNN-DTW keyword spotting.
    :param req: ExtractAudioRequest
    """
    audio_bytes = base64.b64decode(req.audio_b64)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        if req.language == LANG_EN:
            asr          = transcribe(tmp_path)
            english_text = asr.get("text", "") or ""

            if not english_text.strip():
                voice_b64 = get_detected_symptoms_audio([], req.language)
                return {
                    'symptoms_en': [], 'symptoms_wp': [],
                    'confidence': 0.0, 'input_type': 'audio',
                    'language': req.language, 'voice_b64': voice_b64
                }

            preprocessed = preprocess_text(english_text)
            result       = extract_symptoms(preprocessed["clean_text"], is_warlpiri=False)

        elif req.language == LANG_WP:
            wp_result = recognize_warlpiri(tmp_path)

            if not wp_result.get("recognized") or not wp_result.get("symptoms"):
                voice_b64 = get_detected_symptoms_audio([], req.language)
                return {
                    'symptoms_en': [], 'symptoms_wp': [],
                    'confidence': 0.0, 'input_type': 'audio',
                    'language': req.language, 'voice_b64': voice_b64
                }

            from backend.nlp.symptom_extractor import _load_symptom_map, get_has_critical
            symptoms_en = wp_result["symptoms"]
            sym_map     = _load_symptom_map()
            wp_lookup   = {v["en"].lower(): v["wp"] for v in sym_map.values()}
            symptoms_wp = [wp_lookup[s.lower()] for s in symptoms_en if s.lower() in wp_lookup]

            result = {
                "symptoms_en":  symptoms_en,
                "symptoms_wp":  symptoms_wp,
                "confidence":   wp_result.get("confidence", 0.0),
                "has_critical": get_has_critical(symptoms_en)
            }
        else:
            result = {"symptoms_en": [], "symptoms_wp": [], "confidence": 0.0}

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    voice_b64 = get_detected_symptoms_audio(result["symptoms_en"], req.language)

    return {
        'symptoms_en': result["symptoms_en"],
        'symptoms_wp': result["symptoms_wp"],
        'confidence':  result["confidence"],
        'input_type':  'audio',
        'language':    req.language,
        'voice_b64':   voice_b64
    }


@router.post('/extract/image', response_model=ExtractResponse)
def extract_image(req: ExtractImageRequest) -> dict:
    """
    Receive already-resolved symptoms from body map selection and send the audio.
    """
    voice_b64 = get_detected_symptoms_audio(req.symptoms, req.language)

    return {
        'symptoms_en': req.symptoms,
        'symptoms_wp': req.symptoms,
        'confidence': 1.0,  # 1.0 since user explicitly selected these
        'input_type': 'image',
        'language': req.language,
        'voice_b64': voice_b64,
    }


@router.post('/questions', response_model=QuestionsResponse)
def questions_endpoint(req: QuestionsRequest) -> dict:
    """
    Return follow-up questions based on extracted symptoms.
    :param req: QuestionsRequest
    """
    return get_questions(req.symptoms, req.language)


@router.post('/classify', response_model=ClassifyResponse)
def classify_endpoint(req: ClassifyRequest) -> dict:
    """
    Run full triage classification and return severity result.
    :param req: ClassifyRequest
    """
    answers_dicts = [
        {'question_id': answer.question_id, 'answer_id': answer.answer_id}
        for answer in req.answers
    ]
    return run_classify(
        symptoms=req.symptoms,
        answers=answers_dicts,
        language=req.language
    )
