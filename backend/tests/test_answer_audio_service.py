"""
Tests for answer_audio_service.py - English path only.
Tests keyword matching and answer resolution without real audio.
Mocks transcribe_english to avoid loading Whisper model.
"""

import base64
import unittest
from unittest.mock import patch

from backend.api.services.answer_audio_service import (
    _build_answer_map,
    _match_keywords,
    _resolve_warlpiri_keyword,
    resolve_answer_audio,
    YES_NO_QUESTION_IDS,
)

# dummy WAV bytes - minimal valid base64 audio for temp file creation
_DUMMY_WAV_B64 = base64.b64encode(b'RIFF$\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00'
                                  b'\x80>\x00\x00\x00}\x00\x00\x02\x00\x10\x00data\x00\x00\x00\x00').decode()


def _mock_transcribe(text: str):
    """Return a mock transcription result with given text."""
    return {'success': True, 'text': text, 'confidence': 0.95, 'language': 'en', 'segments': []}


def _mock_transcribe_fail():
    """Return a failed transcription result."""
    return {'success': False, 'text': None, 'confidence': None, 'language': 'en', 'segments': []}


class TestBuildAnswerMap(unittest.TestCase):

    def test_yes_no_question_builds_dynamic_ids(self):
        answer_map = _build_answer_map('10')
        self.assertIn('10y', answer_map)
        self.assertIn('10n', answer_map)
        self.assertIn('yes', answer_map['10y'])
        self.assertIn('no', answer_map['10n'])

    def test_yes_no_all_symptom_questions(self):
        for qid in YES_NO_QUESTION_IDS:
            answer_map = _build_answer_map(qid)
            self.assertIsNotNone(answer_map, f'No answer map for question {qid}')
            self.assertIn(qid + 'y', answer_map)
            self.assertIn(qid + 'n', answer_map)

    def test_gender_question(self):
        answer_map = _build_answer_map('0a')
        self.assertIn('0a1', answer_map)
        self.assertIn('0a2', answer_map)

    def test_age_question(self):
        answer_map = _build_answer_map('0b')
        self.assertIn('0b1', answer_map)
        self.assertIn('0b2', answer_map)
        self.assertIn('0b3', answer_map)
        self.assertIn('0b4', answer_map)

    def test_duration_question(self):
        answer_map = _build_answer_map('1')
        self.assertIn('1a', answer_map)
        self.assertIn('1e', answer_map)

    def test_pain_question(self):
        answer_map = _build_answer_map('2')
        self.assertIn('2a', answer_map)
        self.assertIn('2e', answer_map)

    def test_unknown_question_returns_none(self):
        self.assertIsNone(_build_answer_map('999'))


class TestMatchKeywords(unittest.TestCase):

    def test_exact_match_scores_1(self):
        answer_map = {'0a1': ['male', 'man'], '0a2': ['female', 'woman']}
        result = _match_keywords('male', answer_map)
        self.assertIsNotNone(result)
        answer_id, score = result
        self.assertEqual(answer_id, '0a1')
        self.assertEqual(score, 1.0)

    def test_partial_match_scores_085(self):
        answer_map = {'0a1': ['male', 'man'], '0a2': ['female', 'woman']}
        result = _match_keywords('i am male', answer_map)
        self.assertIsNotNone(result)
        answer_id, score = result
        self.assertEqual(answer_id, '0a1')
        self.assertEqual(score, 0.85)

    def test_no_match_returns_none(self):
        answer_map = {'0a1': ['male', 'man'], '0a2': ['female', 'woman']}
        result = _match_keywords('blah blah', answer_map)
        self.assertIsNone(result)

    def test_best_score_wins(self):
        # 'female' appears in both but exact match should win
        answer_map = {'0a1': ['male'], '0a2': ['female']}
        result = _match_keywords('female', answer_map)
        self.assertIsNotNone(result)
        self.assertEqual(result[0], '0a2')

    def test_case_insensitive(self):
        answer_map = {'0a1': ['male'], '0a2': ['female']}
        result = _match_keywords('MALE', answer_map)
        self.assertIsNotNone(result)
        self.assertEqual(result[0], '0a1')


class TestResolveWarlpiryKeyword(unittest.TestCase):

    def test_yes_resolves_to_dynamic_id(self):
        result = _resolve_warlpiri_keyword('yuwayi', '10')
        self.assertEqual(result, '10y')

    def test_no_resolves_to_dynamic_id(self):
        result = _resolve_warlpiri_keyword('lawa', '12')
        self.assertEqual(result, '12n')

    def test_gender_keyword(self):
        result = _resolve_warlpiri_keyword('wati', '0a')
        self.assertEqual(result, '0a1')

    def test_unknown_keyword_returns_none(self):
        result = _resolve_warlpiri_keyword('unknown_word', '10')
        self.assertIsNone(result)


class TestResolveAnswerAudioEnglish(unittest.TestCase):

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_yes_no_yes_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('yes')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '10', language='en')
        self.assertTrue(result['recognized'])
        self.assertEqual(result['answer_id'], '10y')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_yes_no_no_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('no')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '10', language='en')
        self.assertTrue(result['recognized'])
        self.assertEqual(result['answer_id'], '10n')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_gender_male_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('male')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '0a', language='en')
        self.assertTrue(result['recognized'])
        self.assertEqual(result['answer_id'], '0a1')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_gender_female_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('female')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '0a', language='en')
        self.assertTrue(result['recognized'])
        self.assertEqual(result['answer_id'], '0a2')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_age_child_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('child')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '0b', language='en')
        self.assertTrue(result['recognized'])
        self.assertEqual(result['answer_id'], '0b1')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_age_elder_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('elder')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '0b', language='en')
        self.assertTrue(result['recognized'])
        self.assertEqual(result['answer_id'], '0b4')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_duration_today_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('today')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '1', language='en')
        self.assertTrue(result['recognized'])
        self.assertEqual(result['answer_id'], '1a')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_pain_unbearable_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('unbearable')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '2', language='en')
        self.assertTrue(result['recognized'])
        self.assertEqual(result['answer_id'], '2e')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_unrecognized_text_returns_not_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('something completely random')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '0a', language='en')
        self.assertFalse(result['recognized'])
        self.assertIsNone(result['answer_id'])

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_transcription_failure_returns_not_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe_fail()
        result = resolve_answer_audio(_DUMMY_WAV_B64, '10', language='en')
        self.assertFalse(result['recognized'])
        self.assertIsNone(result['answer_id'])

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_partial_phrase_still_matches(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('i think yes definitely')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '10', language='en')
        self.assertTrue(result['recognized'])
        self.assertEqual(result['answer_id'], '10y')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_yeah_matches_yes(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('yeah')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '11', language='en')
        self.assertTrue(result['recognized'])
        self.assertEqual(result['answer_id'], '11y')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_unknown_question_id_returns_not_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('yes')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '999', language='en')
        self.assertFalse(result['recognized'])

    def test_invalid_b64_returns_not_recognized(self):
        result = resolve_answer_audio('not_valid_base64!!!', '10', language='en')
        self.assertFalse(result['recognized'])
        self.assertIsNone(result['answer_id'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
