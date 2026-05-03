from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from backend.api.main import app
from backend.ml.predictor import PredictorResult

client = TestClient(app)


class TestQuestionsEndpoint:

    def test_questions_returns_200(self):
        response = client.post('/questions', json={
            'symptoms': ['headache', 'fever'],
            'language': 'en'
        })
        assert response.status_code == 200

    def test_questions_response_has_required_fields(self):
        response = client.post('/questions', json={
            'symptoms': ['fever'],
            'language': 'en'
        })
        data = response.json()
        assert 'language' in data
        assert 'questions' in data
        assert isinstance(data['questions'], list)

    def test_questions_mandatory_always_returned(self):
        response = client.post('/questions', json={
            'symptoms': [],
            'language': 'en'
        })
        data = response.json()
        assert len(data['questions']) >= 2

    def test_questions_warlpiri_language(self):
        response = client.post('/questions', json={
            'symptoms': [],
            'language': 'wp'
        })
        data = response.json()
        assert data['language'] == 'wp'

    def test_questions_invalid_body_returns_422(self):
        response = client.post('/questions', json={})
        assert response.status_code == 422


class TestClassifyEndpoint:

    @pytest.fixture(autouse=True)
    def mock_predictor(self):
        with patch('backend.api.services.pipeline_service.predictor') as mock:
            mock.predict.return_value = PredictorResult(
                recommendation='Doctor Consultation',
                severity='Moderate',
                severity_mode='MODERATE',
                confidence=0.91,
                recommended_action='Please visit the clinic today.',
                has_critical=False,
                intensity_signal=1,
                voice_b64=''
            )
            yield mock

    def test_classify_returns_200(self):
        response = client.post('/classify', json={
            'symptoms': ['headache', 'fever'],
            'answers': [
                {'question_id': '0a', 'answer_id': '0a1'},
                {'question_id': '0b', 'answer_id': '0b3'},
                {'question_id': '1', 'answer_id': '1b'},
                {'question_id': '2', 'answer_id': '2b'}
            ]
        })
        assert response.status_code == 200

    def test_classify_response_has_required_fields(self):
        response = client.post('/classify', json={
            'symptoms': ['headache'],
            'answers': []
        })
        data = response.json()
        expected_keys = {
            'symptoms', 'severity', 'recommendation',
            'confidence', 'recommended_action',
            'has_critical', 'intensity_signal',
            'age_group', 'gender'
        }
        assert expected_keys.issubset(data.keys())

    def test_classify_severity_is_valid_value(self):
        response = client.post('/classify', json={
            'symptoms': ['fever'],
            'answers': []
        })
        data = response.json()
        assert data['severity'] in {'Mild', 'Moderate', 'Severe'}

    def test_classify_invalid_body_returns_422(self):
        response = client.post('/classify', json={})
        assert response.status_code == 422

    def test_classify_confidence_between_0_and_1(self):
        response = client.post('/classify', json={
            'symptoms': ['fever'],
            'answers': []
        })
        data = response.json()
        assert 0.0 <= data['confidence'] <= 1.0


def test_extract_text_coverage():
    response = client.post('/extract/text', json={
        'text': 'I have a headache',
        'language': 'en'
    })
    assert response.status_code == 200


def test_extract_audio_coverage():
    import base64
    silent_wav = b'RIFF$\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x80>\x00\x00\x00}\x00\x00\x02\x00\x10\x00data\x00\x00\x00\x00'
    response = client.post('/extract/audio', json={
        'audio_b64': base64.b64encode(silent_wav).decode(),
        'language': 'en'
    })
    assert response.status_code == 200


def test_extract_image_coverage():
    response = client.post('/extract/image', json={
        'symptoms': ['headache', 'fever'],
        'language': 'en'
    })
    assert response.status_code == 200


def test_answer_audio_coverage():
    import base64
    silent_wav = b'RIFF$\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x80>\x00\x00\x00}\x00\x00\x02\x00\x10\x00data\x00\x00\x00\x00'
    response = client.post('/answer/audio', json={
        'audio_b64': base64.b64encode(silent_wav).decode(),
        'question_id': '10',
        'language': 'en'
    })
    assert response.status_code == 200
