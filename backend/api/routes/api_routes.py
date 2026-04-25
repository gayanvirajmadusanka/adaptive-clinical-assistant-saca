from fastapi import APIRouter

from backend.api.questions.questions_module import get_questions
from backend.api.schemas.request_response import QuestionsRequest, QuestionsResponse, ClassifyRequest, ClassifyResponse
from backend.api.services.pipeline_service import classify as run_classify

router = APIRouter()


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
