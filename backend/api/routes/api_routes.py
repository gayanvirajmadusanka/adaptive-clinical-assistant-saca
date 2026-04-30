import base64
import io

from fastapi import APIRouter

from backend.api.questions.questions_module import get_questions
from backend.api.schemas.request_response import QuestionsRequest, QuestionsResponse, ClassifyRequest, ClassifyResponse, \
    ExtractResponse, ExtractTextRequest, ExtractAudioRequest, ExtractImageRequest
from backend.api.services.audio_service import get_detected_symptoms_audio
from backend.api.services.pipeline_service import classify as run_classify

router = APIRouter()


@router.post('/extract/text', response_model=ExtractResponse)
def extract_text(req: ExtractTextRequest) -> dict:
    """
    Extract symptoms from typed text input.
    Dummy implementation - real NLP pipeline to be integrated.
    :param req: ExtractTextRequest
    """
    # TODO: continue NLP processing
    # dummy symptoms for now
    symptoms_en = ['headache', 'fever']
    symptoms_wp = ['walpawalpa', 'rdurrurlpu']

    # stitch detected symptoms audio in requested language
    voice_b64 = get_detected_symptoms_audio(symptoms_en, req.language)

    return {
        'symptoms_en': symptoms_en,
        'symptoms_wp': symptoms_wp,
        'confidence': 0.97,
        'input_type': 'text',
        'language': req.language,
        'voice_b64': voice_b64,
    }


@router.post('/extract/audio', response_model=ExtractResponse)
def extract_audio(req: ExtractAudioRequest) -> dict:
    """
    Extract symptoms from audio input.
    Dummy implementation - real NLP pipeline to be integrated.
    :param req: ExtractAudioRequest
    """
    # decode base64 back to audio bytes
    audio_bytes = base64.b64decode(req.audio_b64)
    audio_file = io.BytesIO(audio_bytes)
    # TODO: send audio_file to Whisper or CNN-DTW, continue NLP processing

    symptoms_en = ['headache', 'fever']
    symptoms_wp = ['walpawalpa', 'rdurrurlpu']

    voice_b64 = get_detected_symptoms_audio(symptoms_en, req.language)

    return {
        'symptoms_en': symptoms_en,
        'symptoms_wp': symptoms_wp,
        'confidence': 0.85,
        'input_type': 'audio',
        'language': req.language,
        'voice_b64': voice_b64,
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
