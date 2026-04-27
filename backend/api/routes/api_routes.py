from fastapi import APIRouter, Form, UploadFile, File

from backend.api.questions.questions_module import get_questions
from backend.api.schemas.request_response import QuestionsRequest, QuestionsResponse, ClassifyRequest, ClassifyResponse, \
    ExtractResponse, ExtractTextRequest
from backend.api.services.pipeline_service import classify as run_classify

router = APIRouter()


@router.post('/extract/text', response_model=ExtractResponse)
def extract_text(req: ExtractTextRequest) -> dict:
    """
    Extract symptoms from typed text input.
    Dummy implementation - real NLP pipeline to be integrated.
    :param req: ExtractTextRequest
    """
    return {
        'symptoms_en': ['headache', 'fever'],
        'symptoms_wp': ['ngarru', 'rdurrurlpu'],
        'confidence': 0.97,
        'input_type': 'text',
        'language': req.language
    }


@router.post('/extract/audio', response_model=ExtractResponse)
async def extract_audio(
        audio: UploadFile = File(...),
        language: str = Form('en')
) -> dict:
    """
    Extract symptoms from recorded audio input.
    English audio uses Whisper ASR.
    Warlpiri audio uses CNN-DTW keyword matching against reference recordings.
    Dummy implementation - real audio pipeline to be integrated.
    :param audio: Uploaded audio file
    :param language: Audio language
    """
    return {
        'symptoms_en': ['headache', 'fever'],
        'symptoms_wp': ['ngarru', 'rdurrurlpu'],
        'confidence': 0.85,
        'input_type': 'audio',
        'language': language
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
