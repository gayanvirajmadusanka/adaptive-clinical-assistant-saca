"""
Tests for backend_release/nlp/preprocessor.py
Adapted from backend/tests/test_preprocessor.py.
"""

import unittest

from backend_release_android.nlp.preprocessor import preprocess_text


class TestBasicNormalisation(unittest.TestCase):

    def test_lowercase_conversion(self):
        result = preprocess_text("I Have FEVER")
        self.assertEqual(result["clean_text"], result["clean_text"].lower())

    def test_extra_whitespace_collapsed(self):
        result = preprocess_text("I   have   fever")
        self.assertNotIn("  ", result["clean_text"])

    def test_empty_string_returns_empty(self):
        result = preprocess_text("")
        self.assertEqual(result["clean_text"], "")
        self.assertEqual(result["tokens"], [])

    def test_punctuation_removed(self):
        result = preprocess_text("fever, headache. cough!")
        self.assertNotIn(",", result["clean_text"])
        self.assertNotIn(".", result["clean_text"])
        self.assertNotIn("!", result["clean_text"])

    def test_returns_dict_with_required_keys(self):
        result = preprocess_text("fever")
        self.assertIn("clean_text", result)
        self.assertIn("tokens", result)

    def test_single_symptom_preserved(self):
        result = preprocess_text("fever")
        self.assertIn("fever", result["clean_text"])

    def test_multiple_symptoms_preserved(self):
        result = preprocess_text("I have fever and headache")
        self.assertIn("fever", result["clean_text"])
        self.assertIn("headache", result["clean_text"])

    def test_mixed_case_normalised(self):
        result = preprocess_text("CHEST PAIN and Headache")
        self.assertIn("chest", result["clean_text"])
        self.assertIn("headache", result["clean_text"])

    def test_very_long_text_handled(self):
        long_text = "fever " * 200
        result = preprocess_text(long_text)
        self.assertIn("fever", result["clean_text"])

    def test_warlpiri_text_passthrough(self):
        result = preprocess_text("rdurrurlpu")
        self.assertIsInstance(result["clean_text"], str)


class TestTokenisation(unittest.TestCase):

    def test_tokens_is_list(self):
        result = preprocess_text("I have fever")
        self.assertIsInstance(result["tokens"], list)

    def test_tokens_not_empty_for_valid_input(self):
        result = preprocess_text("fever and cough")
        self.assertGreater(len(result["tokens"]), 0)

    def test_tokens_are_strings(self):
        result = preprocess_text("fever cough")
        for token in result["tokens"]:
            self.assertIsInstance(token, str)

    def test_empty_input_gives_empty_tokens(self):
        result = preprocess_text("")
        self.assertEqual(result["tokens"], [])

    def test_whitespace_only_gives_empty_tokens(self):
        result = preprocess_text("   ")
        self.assertEqual(result["tokens"], [])


class TestEdgeCases(unittest.TestCase):

    def test_numbers_only_handled(self):
        result = preprocess_text("123 456")
        self.assertIsInstance(result["clean_text"], str)

    def test_special_characters_only_handled(self):
        result = preprocess_text("!@#$%^&*()")
        self.assertIsInstance(result["clean_text"], str)

    def test_single_letter_handled(self):
        result = preprocess_text("a")
        self.assertIsInstance(result["clean_text"], str)

    def test_clinical_abbreviation_text(self):
        result = preprocess_text("SOB and CP")
        self.assertIsInstance(result["clean_text"], str)


if __name__ == '__main__':
    unittest.main(verbosity=2)
