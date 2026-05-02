"""
Audio integration tests for API endpoints.

Usage (requires a running server at localhost:8000):
    python -m pytest backend/tests/test_audio_output.py -v -s -m live_server
"""

import base64
import subprocess
import time

import requests

BASE_URL = 'http://localhost:8000'
PLAY_AUDIO = False


def _save_and_play(b64_audio: str, label: str) -> int:
    """Decode base64 audio, save to /tmp, play via afplay. Returns file size."""
    audio_bytes = base64.b64decode(b64_audio)
    path = f'/tmp/saca_test_{label}.wav'
    with open(path, 'wb') as f:
        f.write(audio_bytes)
    print(f'\n  Saved: {path} ({len(audio_bytes)} bytes)')
    if PLAY_AUDIO:
        print(f'  Playing: {label}...')
        subprocess.run(['afplay', path])
    return len(audio_bytes)


def _assert_valid_audio(b64_audio: str, label: str):
    """Assert b64 is non-empty and decodes to a reasonably sized WAV."""
    assert b64_audio, f'{label}: voice_b64 is empty'
    size = _save_and_play(b64_audio, label)
    assert size > 1000, f'{label}: audio too small ({size} bytes) - likely silent or corrupt'


class TestQuestionsEndpointAudio:

    def test_questions_english_audio(self):
        """Each question in English response should have playable audio."""
        response = requests.post(f'{BASE_URL}/questions', json={
            'symptoms': ['headache', 'fever'],
            'language': 'en'
        })
        assert response.status_code == 200
        data = response.json()
        assert len(data['questions']) > 0

        for i, question in enumerate(data['questions']):
            assert 'voice_b64' in question, f'Question {i} missing voice_b64'
            _assert_valid_audio(
                question['voice_b64'],
                f'q_en_{i}_{question["id"]}'
            )
            time.sleep(0.3)

    def test_questions_warlpiri_audio(self):
        """Each question in Warlpiri response should have playable audio."""
        response = requests.post(f'{BASE_URL}/questions', json={
            'symptoms': ['headache', 'fever'],
            'language': 'wp'
        })
        assert response.status_code == 200
        data = response.json()

        for i, question in enumerate(data['questions']):
            assert 'voice_b64' in question
            _assert_valid_audio(
                question['voice_b64'],
                f'q_wp_{i}_{question["id"]}'
            )
            time.sleep(0.3)

    def test_questions_mandatory_only_audio(self):
        """Mandatory questions returned with no symptoms still have audio."""
        response = requests.post(f'{BASE_URL}/questions', json={
            'symptoms': [],
            'language': 'en'
        })
        assert response.status_code == 200
        data = response.json()

        for i, question in enumerate(data['questions']):
            assert 'voice_b64' in question
            _assert_valid_audio(
                question['voice_b64'],
                f'q_mandatory_{i}_{question["id"]}'
            )
            time.sleep(0.3)


class TestClassifyEndpointAudio:

    def test_classify_mild_audio(self):
        """Mild severity result should return playable audio."""
        response = requests.post(f'{BASE_URL}/classify', json={
            'symptoms': ['headache', 'fever'],
            'answers': [
                {'question_id': '0a', 'answer_id': '0a1'},
                {'question_id': '0b', 'answer_id': '0b3'},
                {'question_id': '1', 'answer_id': '1a'},
                {'question_id': '2', 'answer_id': '2a'},
                {'question_id': '10', 'answer_id': '10n'},
                {'question_id': '12', 'answer_id': '12n'},
            ],
            'language': 'en'
        })
        assert response.status_code == 200
        data = response.json()
        print(f'\n  Severity: {data["severity"]}')
        assert 'voice_b64' in data
        _assert_valid_audio(data['voice_b64'], 'classify_mild_en')

    def test_classify_moderate_audio(self):
        """Moderate severity result should return playable audio."""
        response = requests.post(f'{BASE_URL}/classify', json={
            'symptoms': ['headache', 'fever'],
            'answers': [
                {'question_id': '0a', 'answer_id': '0a2'},
                {'question_id': '0b', 'answer_id': '0b3'},
                {'question_id': '1', 'answer_id': '1d'},
                {'question_id': '2', 'answer_id': '2c'},
                {'question_id': '10', 'answer_id': '10n'},
                {'question_id': '12', 'answer_id': '12n'},
            ],
            'language': 'en'
        })
        assert response.status_code == 200
        data = response.json()
        print(f'\n  Severity: {data["severity"]}')
        assert 'voice_b64' in data
        _assert_valid_audio(data['voice_b64'], 'classify_moderate_en')

    def test_classify_severe_audio(self):
        """Severe result should return playable audio."""
        response = requests.post(f'{BASE_URL}/classify', json={
            'symptoms': ['chest pain', 'shortness breath'],
            'answers': [
                {'question_id': '0a', 'answer_id': '0a1'},
                {'question_id': '0b', 'answer_id': '0b3'},
                {'question_id': '1', 'answer_id': '1c'},
                {'question_id': '2', 'answer_id': '2c'},
                {'question_id': '14', 'answer_id': '14y'},
                {'question_id': '15', 'answer_id': '15y'},
            ],
            'language': 'en'
        })
        assert response.status_code == 200
        data = response.json()
        print(f'\n  Severity: {data["severity"]}')
        assert 'voice_b64' in data
        _assert_valid_audio(data['voice_b64'], 'classify_severe_en')

    def test_classify_warlpiri_audio(self):
        """Warlpiri language classify should return Warlpiri severity audio."""
        response = requests.post(f'{BASE_URL}/classify', json={
            'symptoms': ['fever'],
            'answers': [
                {'question_id': '0a', 'answer_id': '0a1'},
                {'question_id': '0b', 'answer_id': '0b3'},
                {'question_id': '1', 'answer_id': '1a'},
                {'question_id': '2', 'answer_id': '2b'},
            ],
            'language': 'wp'
        })
        assert response.status_code == 200
        data = response.json()
        print(f'\n  Severity (wp): {data["severity"]}')
        assert 'voice_b64' in data
        _assert_valid_audio(data['voice_b64'], 'classify_wp')


class TestExtractEndpointAudio:

    def test_extract_text_english_audio(self):
        """Extract text endpoint should return stitched detected symptoms audio."""
        response = requests.post(f'{BASE_URL}/extract/text', json={
            'text': 'I have a headache and fever',
            'language': 'en'
        })
        assert response.status_code == 200
        data = response.json()
        print(f'\n  Detected: {data["symptoms_en"]}')
        assert 'voice_b64' in data
        _assert_valid_audio(data['voice_b64'], 'extract_text_en')

    def test_extract_text_warlpiri_audio(self):
        """Extract text endpoint Warlpiri should return Warlpiri audio."""
        response = requests.post(f'{BASE_URL}/extract/text', json={
            'text': 'ngaju rdurrurlpu',
            'language': 'wp'
        })
        assert response.status_code == 200
        data = response.json()
        assert 'voice_b64' in data
        _assert_valid_audio(data['voice_b64'], 'extract_text_wp')

    def test_extract_audio_english(self):
        """Extract audio endpoint should return stitched detected symptoms audio."""
        import base64

        # create a minimal silent wav as dummy input
        silent_wav = (
            b'RIFF$\x00\x00\x00WAVEfmt \x10\x00\x00\x00'
            b'\x01\x00\x01\x00D\xac\x00\x00\x88X\x01\x00'
            b'\x02\x00\x10\x00data\x00\x00\x00\x00'
        )
        audio_b64 = base64.b64encode(silent_wav).decode('utf-8')

        response = requests.post(f'{BASE_URL}/extract/audio', json={
            'audio_b64': audio_b64,
            'language': 'en'
        })
        assert response.status_code == 200
        data = response.json()
        assert 'voice_b64' in data
        _assert_valid_audio(data['voice_b64'], 'extract_audio_en')
