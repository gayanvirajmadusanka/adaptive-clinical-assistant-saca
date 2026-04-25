from typing import Optional

from pydantic import BaseModel


# request schemas
class QuestionsRequest(BaseModel):
    symptoms: list[str]
    language: str = 'en'


class Answer(BaseModel):
    question_id: str
    answer_id: str


class ClassifyRequest(BaseModel):
    symptoms: list[str]
    answers: list[Answer]
    language: str = 'en'


# response schemas
class QuestionOption(BaseModel):
    id: str
    text: str


class Question(BaseModel):
    id: str
    text: str
    type: str
    options: list[QuestionOption]


class QuestionsResponse(BaseModel):
    language: str
    questions: list[Question]


class ClassifyResponse(BaseModel):
    symptoms: list[str]
    severity: str
    recommendation: str
    confidence: float
    recommended_action: str
    has_critical: bool
    intensity_signal: int
    age_group: Optional[str] = None
    gender: Optional[str] = None
