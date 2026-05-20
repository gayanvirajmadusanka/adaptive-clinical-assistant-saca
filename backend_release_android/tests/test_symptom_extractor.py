"""
Tests for backend_release/nlp/symptom_extractor.py
Adapted from backend/tests/test_symptom_extractor.py.
"""

import unittest

from backend_release_android.nlp.symptom_extractor import extract_symptoms


class TestStage1ExactMatch(unittest.TestCase):

    def test_fever_extracted(self):
        self.assertIn("fever", extract_symptoms("fever"))

    def test_headache_extracted(self):
        self.assertIn("headache", extract_symptoms("headache"))

    def test_cough_extracted(self):
        self.assertIn("cough", extract_symptoms("cough"))

    def test_chest_pain_extracted(self):
        self.assertIn("chest pain", extract_symptoms("chest pain"))

    def test_abdominal_pain_extracted(self):
        self.assertIn("abdominal pain", extract_symptoms("abdominal pain"))

    def test_nausea_extracted(self):
        self.assertIn("nausea", extract_symptoms("nausea"))

    def test_vomiting_extracted(self):
        self.assertIn("vomiting", extract_symptoms("vomiting"))

    def test_diarrhea_extracted(self):
        self.assertIn("diarrhea", extract_symptoms("diarrhea"))

    def test_fatigue_extracted(self):
        self.assertIn("fatigue", extract_symptoms("fatigue"))

    def test_dizziness_extracted(self):
        self.assertIn("dizziness", extract_symptoms("dizziness"))

    def test_multiple_symptoms_extracted(self):
        symptoms = extract_symptoms("fever and headache")
        self.assertIn("fever", symptoms)
        self.assertIn("headache", symptoms)

    def test_returns_list(self):
        self.assertIsInstance(extract_symptoms("fever"), list)

    def test_no_duplicates(self):
        symptoms = extract_symptoms("fever fever fever")
        self.assertLessEqual(symptoms.count("fever"), 1)


class TestStage1SynonymMatching(unittest.TestCase):

    def test_high_temperature_maps_to_fever(self):
        self.assertIn("fever", extract_symptoms("high temperature", raw_text="high temperature"))

    def test_feeling_nauseous_maps_to_nausea(self):
        self.assertIn("nausea", extract_symptoms("feeling nauseous", raw_text="feeling nauseous"))

    def test_throwing_up_maps_to_vomiting(self):
        self.assertIn("vomiting", extract_symptoms("throwing up", raw_text="throwing up"))

    def test_stomach_ache_maps_to_abdominal_pain(self):
        self.assertIn("abdominal pain", extract_symptoms("stomach ache", raw_text="stomach ache"))


class TestFuzzyMatching(unittest.TestCase):

    def test_misspelled_fever_matched(self):
        self.assertIn("fever", extract_symptoms("feever", raw_text="feever"))

    def test_misspelled_headache_matched(self):
        self.assertIn("headache", extract_symptoms("headche", raw_text="headche"))

    def test_word_order_variation_matched(self):
        self.assertIn("chest pain", extract_symptoms("pain chest", raw_text="pain chest"))


class TestEmptyAndEdgeCases(unittest.TestCase):

    def test_empty_string_returns_empty_list(self):
        self.assertEqual(extract_symptoms(""), [])

    def test_whitespace_only_returns_empty_list(self):
        self.assertEqual(extract_symptoms("   "), [])

    def test_numbers_only_returns_list(self):
        self.assertIsInstance(extract_symptoms("123 456"), list)

    def test_unrelated_text_returns_list(self):
        self.assertIsInstance(extract_symptoms("the weather is nice today"), list)

    def test_raw_text_parameter_optional(self):
        self.assertIsInstance(extract_symptoms("fever"), list)


class TestAllCanonicalSymptoms(unittest.TestCase):
    """Each canonical symptom string should be extractable by name."""

    def _assert_symptom(self, symptom: str):
        symptoms = extract_symptoms(symptom, raw_text=symptom)
        self.assertIn(symptom, symptoms, f"Expected '{symptom}' to be extracted")

    def test_fever(self):             self._assert_symptom("fever")
    def test_headache(self):          self._assert_symptom("headache")
    def test_cough(self):             self._assert_symptom("cough")
    def test_chest_pain(self):        self._assert_symptom("chest pain")
    def test_abdominal_pain(self):    self._assert_symptom("abdominal pain")
    def test_nausea(self):            self._assert_symptom("nausea")
    def test_vomiting(self):          self._assert_symptom("vomiting")
    def test_diarrhea(self):          self._assert_symptom("diarrhea")
    def test_fatigue(self):           self._assert_symptom("fatigue")
    def test_dizziness(self):         self._assert_symptom("dizziness")
    def test_body_pain(self):         self._assert_symptom("body pain")
    def test_back_pain(self):         self._assert_symptom("back pain")
    def test_rash(self):              self._assert_symptom("rash")
    def test_sore_throat(self):       self._assert_symptom("sore throat")
    def test_runny_nose(self):        self._assert_symptom("runny nose")
    def test_chills(self):            self._assert_symptom("chills")
    def test_weakness(self):          self._assert_symptom("weakness")
    def test_dehydration(self):       self._assert_symptom("dehydration")
    def test_stiff_neck(self):        self._assert_symptom("stiff neck")
    def test_sneezing(self):          self._assert_symptom("sneezing")


if __name__ == '__main__':
    unittest.main(verbosity=2)
