"""
Tests for answer_audio_service.py - English path only.
Tests keyword matching and answer resolution without real audio.
Mocks transcribe_english to avoid loading Whisper model.
"""

import base64
import unittest
from unittest.mock import patch

from backend.api.services.answer_audio_service import (
    _match_keywords,
    resolve_answer_audio, _resolve_keyword, KEYWORD_TO_ANSWER,
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


class TestKeywordToAnswerMap(unittest.TestCase):

    def test_yes_no_keywords_present(self):
        self.assertEqual(KEYWORD_TO_ANSWER['yes'], 'yes')
        self.assertEqual(KEYWORD_TO_ANSWER['yuwayi'], 'yes')
        self.assertEqual(KEYWORD_TO_ANSWER['no'], 'no')
        self.assertEqual(KEYWORD_TO_ANSWER['lawa'], 'no')

    def test_gender_keywords_present(self):
        self.assertEqual(KEYWORD_TO_ANSWER['male'], '0a1')
        self.assertEqual(KEYWORD_TO_ANSWER['wati'], '0a1')
        self.assertEqual(KEYWORD_TO_ANSWER['female'], '0a2')
        self.assertEqual(KEYWORD_TO_ANSWER['karnta'], '0a2')

    def test_age_keywords_present(self):
        self.assertEqual(KEYWORD_TO_ANSWER['child'], '0b1')
        self.assertEqual(KEYWORD_TO_ANSWER['kurdu'], '0b1')
        self.assertEqual(KEYWORD_TO_ANSWER['elder'], '0b4')
        self.assertEqual(KEYWORD_TO_ANSWER['purlka'], '0b4')

    def test_duration_keywords_present(self):
        self.assertEqual(KEYWORD_TO_ANSWER['today'], '1a')
        self.assertEqual(KEYWORD_TO_ANSWER['jalangu'], '1a')
        self.assertEqual(KEYWORD_TO_ANSWER['week'], '1d')
        self.assertEqual(KEYWORD_TO_ANSWER['wiikikurra'], '1d')

    def test_pain_keywords_present(self):
        self.assertEqual(KEYWORD_TO_ANSWER['unbearable'], '2e')
        self.assertEqual(KEYWORD_TO_ANSWER['kuurrnyinamijuku'], '2e')

    def test_lawa_maps_to_no_not_2a(self):
        # lawa should remain 'no' not be overwritten by answer_none (2a)
        self.assertEqual(KEYWORD_TO_ANSWER['lawa'], 'no')


class TestResolveKeyword(unittest.TestCase):

    def test_yes_resolves_to_dynamic_id(self):
        self.assertEqual(_resolve_keyword('yes', '10'), '10y')
        self.assertEqual(_resolve_keyword('yuwayi', '10'), '10y')
        self.assertEqual(_resolve_keyword('yeah', '12'), '12y')

    def test_no_resolves_to_dynamic_id(self):
        self.assertEqual(_resolve_keyword('no', '10'), '10n')
        self.assertEqual(_resolve_keyword('lawa', '12'), '12n')

    def test_gender_keyword_english(self):
        self.assertEqual(_resolve_keyword('male', '0a'), '0a1')
        self.assertEqual(_resolve_keyword('female', '0a'), '0a2')

    def test_gender_keyword_warlpiri(self):
        self.assertEqual(_resolve_keyword('wati', '0a'), '0a1')
        self.assertEqual(_resolve_keyword('karnta', '0a'), '0a2')

    def test_age_keyword_english(self):
        self.assertEqual(_resolve_keyword('child', '0b'), '0b1')
        self.assertEqual(_resolve_keyword('elder', '0b'), '0b4')

    def test_age_keyword_warlpiri(self):
        self.assertEqual(_resolve_keyword('kurdu', '0b'), '0b1')
        self.assertEqual(_resolve_keyword('purlka', '0b'), '0b4')

    def test_unknown_keyword_returns_none(self):
        self.assertIsNone(_resolve_keyword('unknown_word', '10'))

    def test_case_insensitive(self):
        self.assertEqual(_resolve_keyword('MALE', '0a'), '0a1')
        self.assertEqual(_resolve_keyword('YES', '10'), '10y')


class TestMatchKeywords(unittest.TestCase):

    def test_exact_match_scores_1(self):
        result = _match_keywords('male', '0a')
        self.assertIsNotNone(result)
        answer_id, score = result
        self.assertEqual(answer_id, '0a1')
        self.assertEqual(score, 1.0)

    def test_partial_match_scores_085(self):
        result = _match_keywords('i am male', '0a')
        self.assertIsNotNone(result)
        answer_id, score = result
        self.assertEqual(answer_id, '0a1')
        self.assertEqual(score, 0.85)

    def test_no_match_returns_none(self):
        result = _match_keywords('blah blah blah', '0a')
        self.assertIsNone(result)

    def test_yes_no_question_matches_yes(self):
        result = _match_keywords('yes', '10')
        self.assertIsNotNone(result)
        self.assertEqual(result[0], '10y')

    def test_yes_no_question_matches_no(self):
        result = _match_keywords('no', '10')
        self.assertIsNotNone(result)
        self.assertEqual(result[0], '10n')

    def test_warlpiri_keyword_matches(self):
        result = _match_keywords('wati', '0a')
        self.assertIsNotNone(result)
        self.assertEqual(result[0], '0a1')

    def test_case_insensitive(self):
        result = _match_keywords('MALE', '0a')
        self.assertIsNotNone(result)
        self.assertEqual(result[0], '0a1')


class TestResolveAnswerAudioEnglish(unittest.TestCase):

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_yes_no_yes_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('yes')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '10', language='en')
        self.assertTrue(result.recognized)
        self.assertEqual(result.answer_id, '10y')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_yes_no_no_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('no')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '10', language='en')
        self.assertTrue(result.recognized)
        self.assertEqual(result.answer_id, '10n')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_gender_male_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('male')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '0a', language='en')
        self.assertTrue(result.recognized)
        self.assertEqual(result.answer_id, '0a1')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_gender_female_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('female')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '0a', language='en')
        self.assertTrue(result.recognized)
        self.assertEqual(result.answer_id, '0a2')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_age_child_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('child')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '0b', language='en')
        self.assertTrue(result.recognized)
        self.assertEqual(result.answer_id, '0b1')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_age_elder_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('elder')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '0b', language='en')
        self.assertTrue(result.recognized)
        self.assertEqual(result.answer_id, '0b4')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_duration_today_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('today')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '1', language='en')
        self.assertTrue(result.recognized)
        self.assertEqual(result.answer_id, '1a')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_pain_unbearable_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('unbearable')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '2', language='en')
        self.assertTrue(result.recognized)
        self.assertEqual(result.answer_id, '2e')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_unrecognized_text_returns_not_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('something completely random')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '0a', language='en')
        self.assertFalse(result.recognized)
        self.assertIsNone(result.answer_id)

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_transcription_failure_returns_not_recognized(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe_fail()
        result = resolve_answer_audio(_DUMMY_WAV_B64, '10', language='en')
        self.assertFalse(result.recognized)
        self.assertIsNone(result.answer_id)

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_partial_phrase_still_matches(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('i think yes definitely')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '10', language='en')
        self.assertTrue(result.recognized)
        self.assertEqual(result.answer_id, '10y')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_yeah_matches_yes(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('yeah')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '11', language='en')
        self.assertTrue(result.recognized)
        self.assertEqual(result.answer_id, '11y')

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_unknown_question_id_still_resolves_if_keyword_matches(self, mock_transcribe):
        # with flat map, yes still resolves even for unknown question
        # but since 999 not in YES_NO_QUESTION_IDS it returns 'yes' not '999y'
        mock_transcribe.return_value = _mock_transcribe('male')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '999', language='en')
        # male maps to 0a1 regardless of question_id
        self.assertTrue(result.recognized)
        self.assertEqual(result.answer_id, '0a1')

    def test_invalid_b64_returns_not_recognized(self):
        result = resolve_answer_audio('not_valid_base64!!!', '10', language='en')
        self.assertFalse(result.recognized)
        self.assertIsNone(result.answer_id)

    @patch('backend.api.services.answer_audio_service.transcribe_english')
    def test_response_has_voice_b64(self, mock_transcribe):
        mock_transcribe.return_value = _mock_transcribe('yes')
        result = resolve_answer_audio(_DUMMY_WAV_B64, '10', language='en')
        self.assertTrue(hasattr(result, 'voice_b64'))
        self.assertIsInstance(result.voice_b64, str)


if __name__ == '__main__':
    unittest.main(verbosity=2)
