"""
Tests for backend/nlp/symptom_extractor.py
Covers Stage 1 rule-based extraction, Stage 2 ML fallback,
negation filtering, synonym matching, all canonical symptoms.
"""

import unittest

from backend.nlp.symptom_extractor import extract_symptoms


class TestStage1ExactMatch(unittest.TestCase):

    def test_fever_extracted(self):
        symptoms = extract_symptoms("fever")
        self.assertIn("fever", symptoms)

    def test_headache_extracted(self):
        symptoms = extract_symptoms("headache")
        self.assertIn("headache", symptoms)

    def test_cough_extracted(self):
        symptoms = extract_symptoms("cough")
        self.assertIn("cough", symptoms)

    def test_chest_pain_extracted(self):
        symptoms = extract_symptoms("chest pain")
        self.assertIn("chest pain", symptoms)

    def test_abdominal_pain_extracted(self):
        symptoms = extract_symptoms("abdominal pain")
        self.assertIn("abdominal pain", symptoms)

    def test_nausea_extracted(self):
        symptoms = extract_symptoms("nausea")
        self.assertIn("nausea", symptoms)

    def test_vomiting_extracted(self):
        symptoms = extract_symptoms("vomiting")
        self.assertIn("vomiting", symptoms)

    def test_diarrhea_extracted(self):
        symptoms = extract_symptoms("diarrhea")
        self.assertIn("diarrhea", symptoms)

    def test_fatigue_extracted(self):
        symptoms = extract_symptoms("fatigue")
        self.assertIn("fatigue", symptoms)

    def test_dizziness_extracted(self):
        symptoms = extract_symptoms("dizziness")
        self.assertIn("dizziness", symptoms)

    def test_multiple_symptoms_extracted(self):
        symptoms = extract_symptoms("fever and headache")
        self.assertIn("fever", symptoms)
        self.assertIn("headache", symptoms)

    def test_returns_list(self):
        symptoms = extract_symptoms("fever")
        self.assertIsInstance(symptoms, list)

    def test_no_duplicates(self):
        symptoms = extract_symptoms("fever fever fever")
        self.assertLessEqual(symptoms.count("fever"), 1)


class TestStage1SynonymMatching(unittest.TestCase):

    def test_high_temperature_maps_to_fever(self):
        symptoms = extract_symptoms("high temperature", raw_text="high temperature")
        self.assertIn("fever", symptoms)

    def test_pyrexia_maps_to_fever(self):
        symptoms = extract_symptoms("pyrexia", raw_text="pyrexia")
        self.assertIn("fever", symptoms)

    def test_feeling_nauseous_maps_to_nausea(self):
        symptoms = extract_symptoms("feeling nauseous", raw_text="feeling nauseous")
        self.assertIn("nausea", symptoms)

    def test_throwing_up_maps_to_vomiting(self):
        symptoms = extract_symptoms("throwing up", raw_text="throwing up")
        self.assertIn("vomiting", symptoms)

    def test_stomach_ache_maps_to_abdominal_pain(self):
        symptoms = extract_symptoms("stomach ache", raw_text="stomach ache")
        self.assertIn("abdominal pain", symptoms)


class TestFuzzyMatching(unittest.TestCase):

    def test_misspelled_fever_matched(self):
        symptoms = extract_symptoms("feever", raw_text="feever")
        self.assertIn("fever", symptoms)

    def test_misspelled_headache_matched(self):
        symptoms = extract_symptoms("headche", raw_text="headche")
        self.assertIn("headache", symptoms)

    def test_word_order_variation_matched(self):
        symptoms = extract_symptoms("pain chest", raw_text="pain chest")
        self.assertIn("chest pain", symptoms)


class TestNegationFiltering(unittest.TestCase):

    def test_no_fever_excluded(self):
        symptoms = extract_symptoms("no fever", raw_text="no fever")
        self.assertNotIn("fever", symptoms)

    def test_denies_chest_pain_excluded(self):
        symptoms = extract_symptoms("denies chest pain", raw_text="denies chest pain")
        self.assertNotIn("chest pain", symptoms)

    def test_positive_symptom_retained_with_negated(self):
        symptoms = extract_symptoms(
            "has cough but no fever", raw_text="has cough but no fever"
        )
        self.assertIn("cough", symptoms)
        self.assertNotIn("fever", symptoms)


class TestEmptyAndEdgeCases(unittest.TestCase):

    def test_empty_string_returns_empty_list(self):
        symptoms = extract_symptoms("")
        self.assertEqual(symptoms, [])

    def test_whitespace_only_returns_empty_list(self):
        symptoms = extract_symptoms("   ")
        self.assertEqual(symptoms, [])

    def test_numbers_only_returns_list(self):
        symptoms = extract_symptoms("123 456")
        self.assertIsInstance(symptoms, list)

    def test_unrelated_text_returns_list(self):
        symptoms = extract_symptoms("the weather is nice today")
        self.assertIsInstance(symptoms, list)

    def test_raw_text_parameter_optional(self):
        symptoms = extract_symptoms("fever")
        self.assertIsInstance(symptoms, list)


class TestAllCanonicalSymptoms(unittest.TestCase):
    """Each canonical symptom string should be extractable by name."""

    def _assert_symptom(self, symptom: str):
        symptoms = extract_symptoms(symptom, raw_text=symptom)
        self.assertIn(symptom, symptoms, f"Expected '{symptom}' to be extracted")

    def test_fever(self):
        self._assert_symptom("fever")

    def test_headache(self):
        self._assert_symptom("headache")

    def test_cough(self):
        self._assert_symptom("cough")

    def test_chest_pain(self):
        self._assert_symptom("chest pain")

    def test_abdominal_pain(self):
        self._assert_symptom("abdominal pain")

    def test_nausea(self):
        self._assert_symptom("nausea")

    def test_vomiting(self):
        self._assert_symptom("vomiting")

    def test_diarrhea(self):
        self._assert_symptom("diarrhea")

    def test_fatigue(self):
        self._assert_symptom("fatigue")

    def test_dizziness(self):
        self._assert_symptom("dizziness")

    def test_body_pain(self):
        self._assert_symptom("body pain")

    def test_back_pain(self):
        self._assert_symptom("back pain")

    def test_rash(self):
        self._assert_symptom("rash")

    def test_sore_throat(self):
        self._assert_symptom("sore throat")

    def test_runny_nose(self):
        self._assert_symptom("runny nose")

    def test_chills(self):
        self._assert_symptom("chills")

    def test_weakness(self):
        self._assert_symptom("weakness")

    def test_dehydration(self):
        self._assert_symptom("dehydration")

    def test_stiff_neck(self):
        self._assert_symptom("stiff neck")

    def test_sneezing(self):
        self._assert_symptom("sneezing")


if __name__ == '__main__':
    unittest.main(verbosity=2)
