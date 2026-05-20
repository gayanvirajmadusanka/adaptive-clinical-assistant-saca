"""
Tests for backend_release_android/translation/warlpiri_text.py
Adapted from backend/tests/test_translator.py (script → unittest).
"""

import unittest

from backend_release_android.translation.warlpiri_text import translate


class TestTranslatorOutputShape(unittest.TestCase):

    def _translate(self, text: str) -> dict:
        result = translate(text)
        self.assertIn("translated_text", result)
        self.assertIn("confidence", result)
        self.assertIn("match_type", result)
        return result

    def test_returns_dict_with_required_keys(self):
        self._translate("walpawalpa purrkunypa")

    def test_translated_text_is_string_or_none(self):
        result = self._translate("walpawalpa purrkunypa")
        self.assertIsInstance(result["translated_text"], (str, type(None)))

    def test_confidence_is_float(self):
        result = self._translate("walpawalpa purrkunypa")
        self.assertIsInstance(result["confidence"], float)

    def test_match_type_is_string(self):
        result = self._translate("walpawalpa purrkunypa")
        self.assertIsInstance(result["match_type"], str)


class TestExactPhraseMatch(unittest.TestCase):

    def test_headache_phrase_returns_translation(self):
        result = translate("walpawalpa purrkunypa")  # headache
        self.assertIsNotNone(result["translated_text"])
        self.assertNotEqual(result["translated_text"].strip(), "")

    def test_exact_phrase_high_confidence(self):
        result = translate("walpawalpa purrkunypa")
        self.assertGreater(result["confidence"], 0.9)

    def test_exact_phrase_match_type(self):
        result = translate("walpawalpa purrkunypa")
        self.assertEqual(result["match_type"], "exact_phrase")

    def test_stomach_pain_phrase(self):
        result = translate("miyalu purrkunypa")  # stomach pain
        self.assertIsNotNone(result["translated_text"])
        self.assertGreater(result["confidence"], 0.9)

    def test_chest_pain_phrase(self):
        result = translate("mangarli purrkunypa")  # chest pain
        self.assertIsNotNone(result["translated_text"])
        self.assertGreater(result["confidence"], 0.9)


class TestFuzzyMatch(unittest.TestCase):

    def test_fuzzy_phrase_typo(self):
        # one character dropped from first word
        result = translate("walpawalp purrkunypa")
        self.assertIsNotNone(result["translated_text"])
        self.assertGreater(result["confidence"], 0.5)

    def test_fuzzy_phrase_match_type(self):
        result = translate("walpawalp purrkunypa")
        self.assertEqual(result["match_type"], "fuzzy_phrase")

    def test_fuzzy_always_returns_dict(self):
        result = translate("walpawalp purrkunyp")
        self.assertIn("translated_text", result)


class TestNoMatch(unittest.TestCase):

    def test_unrelated_text_returns_result(self):
        result = translate("xyz abc")
        self.assertIn("translated_text", result)

    def test_unrelated_text_low_confidence(self):
        result = translate("xyz abc")
        self.assertLessEqual(result["confidence"], 0.5)

    def test_empty_string_handled(self):
        result = translate("")
        self.assertIn("translated_text", result)


if __name__ == '__main__':
    unittest.main(verbosity=2)
