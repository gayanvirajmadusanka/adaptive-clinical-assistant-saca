import base64
import io

from fastapi import APIRouter

from backend.api.questions.questions_module import get_questions
from backend.api.schemas.request_response import QuestionsRequest, QuestionsResponse, ClassifyRequest, ClassifyResponse, \
    ExtractResponse, ExtractTextRequest, ExtractAudioRequest, ExtractImageRequest
from backend.api.services.audio_service import get_detected_symptoms_audio
from backend.api.services.pipeline_service import (
    classify as run_classify,
    process_text,
    process_audio,
    symptoms_to_ids
)

from backend.api.services.pipeline_service import (
    classify as run_classify,
    process_text,
    process_audio,
    symptoms_to_ids
)

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
