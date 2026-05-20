"""
API routes module. Defines all API endpoints supported.
"""
import base64

from fastapi import APIRouter

from backend_release_windows.api.questions.questions_module import get_questions
from backend_release_windows.api.schemas.request_response import QuestionsRequest, QuestionsResponse, ClassifyRequest, ClassifyResponse, \
    ExtractResponse, ExtractTextRequest, ExtractAudioRequest, ExtractImageRequest, AnswerAudioResponse, \
    AnswerAudioRequest
from backend_release_windows.api.services.answer_audio_service import resolve_answer_audio
from backend_release_windows.api.services.audio_service import get_detected_symptoms_audio
from backend_release_windows.api.services.pipeline_service import (
    classify as run_classify,
    process_text,
    process_audio,
    symptoms_to_ids
)
from backend_release_windows.constants import InputType, Language

router = APIRouter()


@router.post('/extract/text', response_model=ExtractResponse)
def extract_text(req: ExtractTextRequest) -> ExtractResponse:
    """
    Extract symptoms from typed text input.
    :param req: ExtractTextRequest
    :return: ExtractResponse with symptoms and stitched audio
    """
    result = process_text(req.text, req.language)
    symptom_ids = symptoms_to_ids(result["symptoms_en"])
    voice_b64_en = get_detected_symptoms_audio(symptom_ids, Language.EN)
    voice_b64_wp = get_detected_symptoms_audio(symptom_ids, Language.WP)

    return ExtractResponse(symptoms_en=result["symptoms_en"], symptoms_wp=result["symptoms_wp"],
                           confidence=result["confidence"],
                           language=req.language, input_type=InputType.TEXT,
                           voice_b64_en=voice_b64_en, voice_b64_wp=voice_b64_wp)


@router.post('/extract/audio', response_model=ExtractResponse)
def extract_audio(req: ExtractAudioRequest) -> ExtractResponse:
    """
    Extract symptoms from audio input.
    :param req: ExtractAudioRequest
    :return: ExtractResponse with symptoms and stitched audio
    """
    audio_bytes = base64.b64decode(req.audio_b64)
    result = process_audio(audio_bytes, req.language)
    symptom_ids = symptoms_to_ids(result["symptoms_en"])
    voice_b64_en = get_detected_symptoms_audio(symptom_ids, Language.EN)
    voice_b64_wp = get_detected_symptoms_audio(symptom_ids, Language.WP)

    return ExtractResponse(symptoms_en=result["symptoms_en"], symptoms_wp=result["symptoms_wp"],
                           confidence=result["confidence"],
                           language=req.language, input_type=InputType.AUDIO,
                           voice_b64_en=voice_b64_en, voice_b64_wp=voice_b64_wp)


@router.post('/extract/image', response_model=ExtractResponse)
def extract_image(req: ExtractImageRequest) -> ExtractResponse:
    """
    Receive already-resolved symptoms from body map selection and return audio.
    Confidence is 1.0 since symptoms are explicitly selected by the user.
    :param req: ExtractImageRequest
    :return: ExtractResponse dict with the provided symptoms and audio
    """
    voice_b64_en = get_detected_symptoms_audio(req.symptoms, Language.EN)
    voice_b64_wp = get_detected_symptoms_audio(req.symptoms, Language.WP)

    return ExtractResponse(symptoms_en=req.symptoms, symptoms_wp=req.symptoms, confidence=1.0,
                           language=req.language, input_type=InputType.IMAGE,
                           voice_b64_en=voice_b64_en, voice_b64_wp=voice_b64_wp)


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
