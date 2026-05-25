"""
Tests for pipeline_service.process_text() — the function behind /extract/text,
which is the primary path for Android English voice input (native STT → text → this function).
"""

import unittest

from backend_release_android.api.services.pipeline_service import process_text
from backend_release_android.constants import Language


class TestProcessTextEnglish(unittest.TestCase):

    def test_returns_dict_with_required_keys(self):
        result = process_text("I have a fever", Language.EN)
        self.assertIn("symptoms_en", result)
        self.assertIn("symptoms_wp", result)
        self.assertIn("confidence", result)

    def test_clear_symptom_detected(self):
        result = process_text("I have a fever and headache", Language.EN)
        self.assertTrue(len(result["symptoms_en"]) > 0)

    def test_english_symptoms_wp_empty(self):
        # EN input → symptoms_wp should always be empty
        result = process_text("fever and cough", Language.EN)
        self.assertEqual(result["symptoms_wp"], [])

    def test_empty_string_returns_empty(self):
        result = process_text("", Language.EN)
        self.assertEqual(result["symptoms_en"], [])
        self.assertEqual(result["symptoms_wp"], [])
        self.assertEqual(result["confidence"], 0.0)

    def test_whitespace_only_returns_empty(self):
        result = process_text("   ", Language.EN)
        self.assertEqual(result["symptoms_en"], [])

    def test_unrelated_text_low_confidence(self):
        result = process_text("the weather is nice today", Language.EN)
        # may or may not detect symptoms but confidence should reflect that
        self.assertIsInstance(result["confidence"], float)

    def test_symptoms_are_strings(self):
        result = process_text("chest pain and shortness of breath", Language.EN)
        for s in result["symptoms_en"]:
            self.assertIsInstance(s, str)

    def test_confidence_is_nonzero_when_symptoms_detected(self):
        result = process_text("fever", Language.EN)
        if result["symptoms_en"]:
            self.assertGreater(result["confidence"], 0.0)

    def test_case_insensitive(self):
        lower = process_text("fever", Language.EN)
        upper = process_text("FEVER", Language.EN)
        self.assertEqual(lower["symptoms_en"], upper["symptoms_en"])

    def test_noisy_input_does_not_crash(self):
        result = process_text("um... so like, I've been feeling really bad, you know?", Language.EN)
        self.assertIsInstance(result["symptoms_en"], list)


class TestProcessTextWarlpiri(unittest.TestCase):

    def test_warlpiri_path_returns_dict(self):
        # Warlpiri text goes through translation first
        result = process_text("ngurlu", Language.WP)
        self.assertIn("symptoms_en", result)
        self.assertIn("symptoms_wp", result)

    def test_warlpiri_empty_returns_empty(self):
        result = process_text("", Language.WP)
        self.assertEqual(result["symptoms_en"], [])


if __name__ == "__main__":
    unittest.main()
