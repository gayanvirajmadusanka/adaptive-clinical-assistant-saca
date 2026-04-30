import base64
import io
import os
import tempfile

from fastapi import APIRouter

from backend.api.questions.questions_module import get_questions
from backend.api.schemas.request_response import QuestionsRequest, QuestionsResponse, ClassifyRequest, ClassifyResponse, \
    ExtractResponse, ExtractTextRequest, ExtractAudioRequest
from backend.api.services.pipeline_service import classify as run_classify

from backend.nlp.preprocessor import preprocess_text
from backend.nlp.symptom_extractor import extract_symptoms
from backend.translation.warlpiri_text import translate as translate_warlpiri
from backend.speech.audio_english import transcribe
from backend.nlp.audio_warlpiri import match_warlpiri_audio

LANG_WP = "wp"
LANG_EN = "en"

router = APIRouter()


@router.post("/extract/text", response_model=ExtractResponse)
def extract_text(req: ExtractTextRequest) -> dict:
    english_text = req.text
    symptoms_wp  = []

    if req.language == LANG_WP:
        translation  = translate_warlpiri(req.text)
        english_text = translation.get("translated_text") or req.text
        if translation.get("translated_text"):
            symptoms_wp = [req.text]

    result = extract_symptoms(english_text, raw_text=req.text)

    return {
        "symptoms_en": result["symptoms"],
        "symptoms_wp": symptoms_wp,
        "confidence":  max(result["symptom_confidence"].values()) if result["symptom_confidence"] else 0.0,
        "input_type":  "text",
        "language":    req.language
    }


@router.post("/extract/audio", response_model=ExtractResponse)
def extract_audio(req: ExtractAudioRequest) -> dict:
    audio_bytes  = base64.b64decode(req.audio_b64)
    symptoms_wp  = []
    english_text = ""
    speech_conf  = 0.0

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        if req.language == LANG_EN:
            asr_result   = transcribe(tmp_path)
            english_text = asr_result.get("text", "") or ""
            speech_conf  = asr_result.get("confidence") or 0.0

        elif req.language == LANG_WP:
            wp_result    = match_warlpiri_audio(tmp_path)
            english_text = wp_result.get("translated_text", "") or ""
            speech_conf  = wp_result.get("confidence", 0.0)
            if wp_result.get("original_phrase"):
                symptoms_wp = [wp_result["original_phrase"]]

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    if not english_text.strip():
        return {
            "symptoms_en": [],
            "symptoms_wp": symptoms_wp,
            "confidence":  0.0,
            "input_type":  "audio",
            "language":    req.language
        }

    result = extract_symptoms(english_text, raw_text=english_text)

    return {
        "symptoms_en": result["symptoms"],
        "symptoms_wp": symptoms_wp,
        "confidence":  speech_conf,
        "input_type":  "audio",
        "language":    req.language
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
