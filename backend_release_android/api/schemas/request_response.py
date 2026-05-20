from typing import Optional

from pydantic import BaseModel

from backend_release_android.constants import Language


class QuestionsRequest(BaseModel):
    symptoms: list[str]
    language: Language = Language.EN


class Answer(BaseModel):
    question_id: str
    answer_id: str


class AnswerAudioRequest(BaseModel):
    audio_b64: str
    question_id: str
    language: Language = Language.EN


class ClassifyRequest(BaseModel):
    symptoms: list[str]
    answers: list[Answer]
    language: Language = Language.EN


class ExtractTextRequest(BaseModel):
    text: str
    language: Language = Language.EN


class ExtractAudioRequest(BaseModel):
    audio_b64: str
    language: Language = Language.EN


class ExtractImageRequest(BaseModel):
    symptoms: list[str]
    language: Language = Language.EN


class QuestionOption(BaseModel):
    id: str
    text: str


class Question(BaseModel):
    id: str
    text: str
    type: str
    options: list[QuestionOption]
    voice_b64: str


class QuestionsResponse(BaseModel):
    language: str
    questions: list[Question]


class AnswerAudioResponse(BaseModel):
    question_id: str
    answer_id: str | None = None
    confidence: float
    recognized: bool
    message: str | None = None
    voice_b64: str


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
    voice_b64: str


class ExtractResponse(BaseModel):
    symptoms_en: list[str]
    symptoms_wp: list[str]
    confidence: float
    input_type: str
    language: str
    voice_b64_en: str
    voice_b64_wp: str
