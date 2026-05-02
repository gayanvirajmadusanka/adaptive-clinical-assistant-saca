"""
Request response model schemas for the API routes.
Defines the expected structure of request bodies and response data for each endpoint.
"""
from typing import Optional

from pydantic import BaseModel


# request schemas
class QuestionsRequest(BaseModel):
    symptoms: list[str]
    language: str = 'en'


class Answer(BaseModel):
    question_id: str
    answer_id: str


class AnswerAudioRequest(BaseModel):
    audio_b64: str
    question_id: str
    language: str = 'en'


class ClassifyRequest(BaseModel):
    symptoms: list[str]
    answers: list[Answer]
    language: str = 'en'


class ExtractTextRequest(BaseModel):
    text: str
    language: str = 'en'


class ExtractAudioRequest(BaseModel):
    audio_b64: str  # base64 encoded audio file
    language: str = 'en'


class ExtractImageRequest(BaseModel):
    symptoms: list[str]
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
    voice_b64: str  # base64 encoded voice file


class QuestionsResponse(BaseModel):
    language: str
    questions: list[Question]


class AnswerAudioResponse(BaseModel):
    question_id: str
    answer_id: str | None = None
    confidence: float
    recognized: bool
    message: str | None = None


class ClassifyResponse(BaseModel):
    symptoms: list[str]
    severity: str
    severity_mode: str
    recommendation: str
    confidence: float
    recommended_action: str
    has_critical: bool
    intensity_signal: int
    age_group: Optional[str] = None
    gender: Optional[str] = None
    voice_b64: str  # base64 encoded voice file


class ExtractResponse(BaseModel):
    symptoms_en: list[str]
    symptoms_wp: list[str]
    confidence: float
    input_type: str
    language: str
    voice_b64: str  # base64 encoded voice file
