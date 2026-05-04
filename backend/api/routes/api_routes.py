"""
API routes module. Defines all API endpoints supported.
"""
import base64
import io

from fastapi import APIRouter

from backend.api.questions.questions_module import get_questions
from backend.api.schemas.request_response import QuestionsRequest, QuestionsResponse, ClassifyRequest, ClassifyResponse, \
    ExtractResponse, ExtractTextRequest, ExtractAudioRequest, ExtractImageRequest, AnswerAudioResponse, \
    AnswerAudioRequest
from backend.api.services.answer_audio_service import resolve_answer_audio
from backend.api.services.audio_service import get_detected_symptoms_audio
from backend.constants import InputType, Language
from backend.nlp.preprocessor import preprocess_text
from backend.nlp.symptom_extractor import extract_symptoms
from backend.translation.warlpiri_text import translate as translate_warlpiri
from backend.speech.audio_english import transcribe
from backend.speech.audio_warlpiri import recognize as recognize_warlpiri
from backend.api.services.pipeline_service import (
    classify as run_classify,
    process_text,
    process_audio,
    symptoms_to_ids
)

LANG_WP = "wp"
LANG_EN = "en"

router = APIRouter()


@router.post('/extract/text', response_model=ExtractResponse)
def extract_text(req: ExtractTextRequest) -> dict:
    """
    Extract symptoms from typed text input.
    :param req: ExtractTextRequest
    :return: ExtractResponse with symptoms and stitched audio
    """
    result      = process_text(req.text, req.language)
    symptom_ids = symptoms_to_ids(result["symptoms_en"])
    voice_b64   = get_detected_symptoms_audio(symptom_ids, req.language)

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
    :param req: ExtractAudioRequest
    :return: ExtractResponse with symptoms and stitched audio
    """
    audio_bytes = base64.b64decode(req.audio_b64)
    result      = process_audio(audio_bytes, req.language)
    symptom_ids = symptoms_to_ids(result["symptoms_en"])
    voice_b64   = get_detected_symptoms_audio(symptom_ids, req.language)

    return {
        'symptoms_en': result["symptoms_en"],
        'symptoms_wp': result["symptoms_wp"],
        'confidence':  result["confidence"],
        'input_type':  'audio',
        'language':    req.language,
        'voice_b64':   voice_b64
    }


@router.post('/extract/image', response_model=ExtractResponse)
def extract_image(req: ExtractImageRequest) -> ExtractResponse:
    """
    Receive already-resolved symptoms from body map selection and return audio.
    Confidence is 1.0 since symptoms are explicitly selected by the user.
    :param req: ExtractImageRequest
    :return: ExtractResponse dict with the provided symptoms and audio
    """
    voice_b64 = get_detected_symptoms_audio(req.symptoms, req.language)
    return ExtractResponse(symptoms_en=req.symptoms, symptoms_wp=req.symptoms, confidence=1.0,
                           language=req.language, input_type=InputType.IMAGE, voice_b64=voice_b64)


@router.post('/questions', response_model=QuestionsResponse)
def questions_endpoint(req: QuestionsRequest) -> QuestionsResponse:
    """
    Return follow-up questions based on extracted symptoms.
    :param req: QuestionsRequest
    :return: QuestionsResponse dict with question list and audio
    """
    return get_questions(req.symptoms, req.language)


@router.post('/answer/audio', response_model=AnswerAudioResponse)
def resolve_answer_audio_endpoint(req: AnswerAudioRequest) -> AnswerAudioResponse:
    """
    Resolve a spoken audio answer to an answer_id.
    Returns answer_id if recognised, None if not.
    Frontend re-prompts the same question if None returned.
    :param req: AnswerAudioRequest
    :return: AnswerAudioResponse dict with answer_id (or None) and confirmation audio
    """
    return resolve_answer_audio(
        audio_b64=req.audio_b64,
        question_id=req.question_id,
        language=req.language
    )


@router.post('/classify', response_model=ClassifyResponse)
def classify_endpoint(req: ClassifyRequest) -> ClassifyResponse:
    """
    Run full triage classification and return severity result.
    :param req: ClassifyRequest
    :return: ClassifyResponse dict with severity, recommendation, and audio
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
