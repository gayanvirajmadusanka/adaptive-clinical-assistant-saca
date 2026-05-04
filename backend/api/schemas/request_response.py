"""
Request response model schemas for the API routes.
Defines the expected structure of request bodies and response data for each endpoint.
"""
from typing import Optional

from pydantic import BaseModel

from backend.constants import Language


# request schemas
class QuestionsRequest(BaseModel):
    """
    Request body for /questions endpoint. Contains list of symptom strings and language code.
    """
    symptoms: list[str]
    language: Language = Language.EN


class Answer(BaseModel):
    """
    Represents a single answer to a question, with question_id and answer_id.
    """
    question_id: str
    answer_id: str


class AnswerAudioRequest(BaseModel):
    """
    Request body for /answer/audio endpoint. Contains base64 encoded audio, question_id, and language code.
    """
    audio_b64: str
    question_id: str
    language: Language = Language.EN


class ClassifyRequest(BaseModel):
    """
    Request body for /classify endpoint. Contains list of symptom strings, list of question answers, and language code.
    """
    symptoms: list[str]
    answers: list[Answer]
    language: Language = Language.EN


class ExtractTextRequest(BaseModel):
    """
    Request body for /extract/text endpoint. Contains free-form text input and language code.
    """
    text: str
    language: Language = Language.EN


class ExtractAudioRequest(BaseModel):
    """
    Request body for /extract/audio endpoint. Contains base64 encoded audio file and language code.
    """
    audio_b64: str  # base64 encoded audio file
    language: Language = Language.EN


class ExtractImageRequest(BaseModel):
    """
    Request body for /extract/image endpoint. Contains symptom list and language code.
    """
    symptoms: list[str]
    language: Language = Language.EN


# response schemas
class QuestionOption(BaseModel):
    """
    Represents a single option for a question, with id and display text.
    """
    id: str
    text: str


class Question(BaseModel):
    """
    Represents a single question in the /questions response, with id, text, type, options, and audio.
    """
    id: str
    text: str
    type: str
    options: list[QuestionOption]
    voice_b64: str  # base64 encoded voice file


class QuestionsResponse(BaseModel):
    """
    Response body for /questions endpoint. Contains language code and list of questions.
    """
    language: str
    questions: list[Question]


class AnswerAudioResponse(BaseModel):
    """
    Response body for /answer/audio endpoint. Contains question_id, resolved answer_id (if recognized),
     confidence score, recognition flag, optional message, and audio.
    """
    question_id: str
    answer_id: str | None = None
    confidence: float
    recognized: bool
    message: str | None = None
    voice_b64: str


class ClassifyResponse(BaseModel):
    """
    Response body for /classify endpoint. Contains list of symptoms, severity, severity mode, recommendation,
     confidence score, recommended action, critical symptom flag, intensity signal, optional age group and gender, and audio.
    """
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
    voice_b64: str


class ExtractResponse(BaseModel):
    """
    Response body for /extract endpoints. Contains list of symptoms in English and Warlpiri, confidence score,
    input type, language code, and audio.
    """
    symptoms_en: list[str]
    symptoms_wp: list[str]
    confidence: float
    input_type: str
    language: str
    voice_b64: str
