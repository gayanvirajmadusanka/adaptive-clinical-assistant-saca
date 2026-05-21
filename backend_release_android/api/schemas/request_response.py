from typing import List, Optional

from pydantic import BaseModel

from backend_release_android.constants import Language


class QuestionsRequest(BaseModel):
    symptoms: List[str]
    language: Language = Language.EN


class Answer(BaseModel):
    question_id: str
    answer_id: str


class AnswerAudioRequest(BaseModel):
    audio_b64: str
    question_id: str
    language: Language = Language.EN


class ClassifyRequest(BaseModel):
    symptoms: List[str]
    answers: List[Answer]
    language: Language = Language.EN


class ExtractTextRequest(BaseModel):
    text: str
    language: Language = Language.EN


class ExtractAudioRequest(BaseModel):
    audio_b64: str
    language: Language = Language.EN


class ExtractImageRequest(BaseModel):
    symptoms: List[str]
    language: Language = Language.EN


class QuestionOption(BaseModel):
    id: str
    text: str


class Question(BaseModel):
    id: str
    text: str
    type: str
    options: List[QuestionOption]
    voice_b64: str


class QuestionsResponse(BaseModel):
    language: str
    questions: List[Question]


class AnswerAudioResponse(BaseModel):
    question_id: str
    answer_id: Optional[str] = None
    confidence: float
    recognized: bool
    message: Optional[str] = None
    voice_b64: str


class ClassifyResponse(BaseModel):
    symptoms: List[str]
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
    symptoms_en: List[str]
    symptoms_wp: List[str]
    confidence: float
    input_type: str
    language: str
    voice_b64_en: str
    voice_b64_wp: str
