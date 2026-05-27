"""
Flask server for Android (Chaquopy).
Replaces FastAPI + uvicorn — Werkzeug's make_server uses blocking I/O
(no asyncio) so it works reliably in a background thread on Android.
All service logic is unchanged; only the HTTP layer is different.
"""

import base64

from flask import Flask, jsonify, request as flask_request

from backend_release_android.api.questions.questions_module import get_questions
from backend_release_android.api.services.answer_audio_service import resolve_answer_audio
from backend_release_android.api.services.audio_service import get_detected_symptoms_audio
from backend_release_android.api.services.pipeline_service import (
    classify as run_classify, process_text, process_audio, symptoms_to_ids,
)
from backend_release_android.constants import InputType, Language


def create_app() -> Flask:
    app = Flask(__name__)

    @app.get('/health')
    def health():
        return jsonify({"status": "ok"})

    @app.post('/extract/text')
    def extract_text():
        data     = flask_request.get_json(force=True)
        text     = data.get('text', '')
        language = data.get('language', Language.EN)

        result       = process_text(text, language)
        symptom_ids  = symptoms_to_ids(result['symptoms_en'])
        voice_b64_en = get_detected_symptoms_audio(symptom_ids, Language.EN)
        voice_b64_wp = get_detected_symptoms_audio(symptom_ids, Language.WP)

        return jsonify({
            'symptoms_en': result['symptoms_en'],
            'symptoms_wp': result['symptoms_wp'],
            'confidence':  result['confidence'],
            'language':    language,
            'input_type':  InputType.TEXT,
            'voice_b64_en': voice_b64_en,
            'voice_b64_wp': voice_b64_wp,
        })

    @app.post('/extract/audio')
    def extract_audio():
        data        = flask_request.get_json(force=True)
        audio_bytes = base64.b64decode(data.get('audio_b64', ''))
        language    = data.get('language', Language.EN)

        result       = process_audio(audio_bytes, language)
        symptom_ids  = symptoms_to_ids(result['symptoms_en'])
        voice_b64_en = get_detected_symptoms_audio(symptom_ids, Language.EN)
        voice_b64_wp = get_detected_symptoms_audio(symptom_ids, Language.WP)

        return jsonify({
            'symptoms_en': result['symptoms_en'],
            'symptoms_wp': result['symptoms_wp'],
            'confidence':  result['confidence'],
            'language':    language,
            'input_type':  InputType.AUDIO,
            'voice_b64_en': voice_b64_en,
            'voice_b64_wp': voice_b64_wp,
        })

    @app.post('/extract/image')
    def extract_image():
        data     = flask_request.get_json(force=True)
        symptoms = data.get('symptoms', [])
        language = data.get('language', Language.EN)

        voice_b64_en = get_detected_symptoms_audio(symptoms, Language.EN)
        voice_b64_wp = get_detected_symptoms_audio(symptoms, Language.WP)

        return jsonify({
            'symptoms_en': symptoms,
            'symptoms_wp': symptoms,
            'confidence':  1.0,
            'language':    language,
            'input_type':  InputType.IMAGE,
            'voice_b64_en': voice_b64_en,
            'voice_b64_wp': voice_b64_wp,
        })

    @app.post('/questions')
    def questions_endpoint():
        data     = flask_request.get_json(force=True)
        symptoms = data.get('symptoms', [])
        language = data.get('language', Language.EN)

        response = get_questions(symptoms, language)
        return jsonify(response.dict())

    @app.post('/answer/audio')
    def answer_audio_endpoint():
        data        = flask_request.get_json(force=True)
        audio_b64   = data.get('audio_b64', '')
        question_id = data.get('question_id', '')
        language    = data.get('language', Language.EN)

        response = resolve_answer_audio(
            audio_b64=audio_b64, question_id=question_id, language=language
        )
        return jsonify(response.dict())

    @app.post('/classify')
    def classify_endpoint():
        data     = flask_request.get_json(force=True)
        symptoms = data.get('symptoms', [])
        answers  = [
            {'question_id': a['question_id'], 'answer_id': a['answer_id']}
            for a in data.get('answers', [])
        ]
        language = data.get('language', Language.EN)

        response = run_classify(symptoms=symptoms, answers=answers, language=language)
        return jsonify(response.dict())

    return app
