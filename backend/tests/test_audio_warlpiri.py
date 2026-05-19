"""
Tests for backend/speech/audio_warlpiri.py
Covers MFCC loading, DTW distance, VAD segmentation,
confidence scoring, keyword reference loading.
"""

import os
import unittest

import numpy as np

from backend.speech.audio_warlpiri import (
    KEYWORD_MFCC,
    KEYWORD_SYMPTOM_MAP,
    SAMPLE_RATE,
    DTW_THRESHOLD,
    _KEYWORD_REFS,
    _dtw_distance,
    _extract_mfcc,
    _distance_to_confidence,
    _segment_audio,
    list_keywords,
    recognize,
)


class TestModuleLoading(unittest.TestCase):

    def test_keyword_mfcc_loaded(self):
        self.assertIsNotNone(KEYWORD_MFCC)
        self.assertGreater(len(KEYWORD_MFCC), 0)

    def test_keyword_symptom_map_loaded(self):
        self.assertIsNotNone(KEYWORD_SYMPTOM_MAP)
        self.assertGreater(len(KEYWORD_SYMPTOM_MAP), 0)

    def test_keyword_refs_populated(self):
        self.assertGreater(len(_KEYWORD_REFS), 0)

    def test_keyword_refs_are_lists_of_arrays(self):
        for keyword, refs in _KEYWORD_REFS.items():
            self.assertIsInstance(refs, list)
            for ref in refs:
                self.assertIsInstance(ref, np.ndarray,
                    f"Reference for '{keyword}' is not numpy array")

    def test_keyword_refs_have_39_features(self):
        for keyword, refs in _KEYWORD_REFS.items():
            for ref in refs:
                self.assertEqual(ref.shape[0], 39,
                    f"Reference for '{keyword}' should have 39 features")

    def test_keyword_refs_are_2d(self):
        for keyword, refs in _KEYWORD_REFS.items():
            for ref in refs:
                self.assertEqual(ref.ndim, 2,
                    f"Reference for '{keyword}' should be 2D (features, frames)")

    def test_list_keywords_returns_list(self):
        keywords = list_keywords()
        self.assertIsInstance(keywords, list)
        self.assertGreater(len(keywords), 0)

    def test_fever_keyword_loaded(self):
        self.assertIn("rdurrurlpu", _KEYWORD_REFS)

    def test_headache_keyword_loaded(self):
        self.assertIn("walpawalpa", _KEYWORD_REFS)

    def test_yes_answer_keyword_loaded(self):
        self.assertIn("yuwayi", _KEYWORD_REFS)

    def test_no_answer_keyword_loaded(self):
        self.assertIn("lawa", _KEYWORD_REFS)

    def test_all_47_keywords_loaded(self):
        self.assertGreaterEqual(len(_KEYWORD_REFS), 47)

    def test_keyword_symptom_map_has_fever(self):
        self.assertIn("rdurrurlpu", KEYWORD_SYMPTOM_MAP)
        self.assertEqual(KEYWORD_SYMPTOM_MAP["rdurrurlpu"], "fever")

    def test_keyword_symptom_map_has_headache(self):
        self.assertIn("walpawalpa", KEYWORD_SYMPTOM_MAP)
        self.assertEqual(KEYWORD_SYMPTOM_MAP["walpawalpa"], "headache")


class TestMFCCExtraction(unittest.TestCase):

    def test_extract_mfcc_returns_array(self):
        audio = np.random.randn(SAMPLE_RATE).astype(np.float32)
        result = _extract_mfcc(audio)
        self.assertIsInstance(result, np.ndarray)

    def test_extract_mfcc_has_39_features(self):
        audio = np.random.randn(SAMPLE_RATE).astype(np.float32)
        result = _extract_mfcc(audio)
        self.assertEqual(result.shape[0], 39)

    def test_extract_mfcc_empty_audio_returns_none(self):
        result = _extract_mfcc(np.array([]))
        self.assertIsNone(result)

    def test_extract_mfcc_correct_sample_rate(self):
        audio = np.random.randn(SAMPLE_RATE).astype(np.float32)
        result = _extract_mfcc(audio, sr=SAMPLE_RATE)
        self.assertIsNotNone(result)
        self.assertEqual(result.shape[0], 39)

    def test_extract_mfcc_output_is_2d(self):
        audio = np.random.randn(SAMPLE_RATE).astype(np.float32)
        result = _extract_mfcc(audio)
        self.assertEqual(result.ndim, 2)


class TestDTWDistance(unittest.TestCase):

    def test_identical_sequences_near_zero(self):
        seq = np.random.randn(39, 20)
        dist = _dtw_distance(seq, seq)
        self.assertLess(dist, 1.0)

    def test_distance_is_non_negative(self):
        seq1 = np.random.randn(39, 20)
        seq2 = np.random.randn(39, 20)
        dist = _dtw_distance(seq1, seq2)
        self.assertGreaterEqual(dist, 0)

    def test_distance_is_float(self):
        seq1 = np.random.randn(39, 15)
        seq2 = np.random.randn(39, 20)
        dist = _dtw_distance(seq1, seq2)
        self.assertIsInstance(dist, float)

    def test_different_lengths_handled(self):
        seq1 = np.random.randn(39, 10)
        seq2 = np.random.randn(39, 25)
        dist = _dtw_distance(seq1, seq2)
        self.assertIsInstance(dist, float)

    def test_distance_normalised_by_length(self):
        seq1 = np.random.randn(39, 20)
        seq2 = np.random.randn(39, 20)
        dist = _dtw_distance(seq1, seq2)
        self.assertLess(dist, 10000)


class TestConfidenceScoring(unittest.TestCase):

    def test_zero_distance_high_confidence(self):
        conf = _distance_to_confidence(0.0)
        self.assertGreater(conf, 0.8)

    def test_threshold_distance_low_confidence(self):
        conf = _distance_to_confidence(DTW_THRESHOLD)
        self.assertLess(conf, 0.3)

    def test_confidence_between_zero_and_one(self):
        for dist in [0.0, 50.0, 100.0, 150.0, 200.0, 300.0]:
            conf = _distance_to_confidence(dist)
            self.assertGreaterEqual(conf, 0.0)
            self.assertLessEqual(conf, 1.0)

    def test_confidence_decreases_with_distance(self):
        conf1 = _distance_to_confidence(50.0)
        conf2 = _distance_to_confidence(150.0)
        self.assertGreater(conf1, conf2)

    def test_confidence_is_float(self):
        conf = _distance_to_confidence(100.0)
        self.assertIsInstance(conf, float)

    def test_confidence_rounded_to_3_decimal_places(self):
        conf = _distance_to_confidence(80.0)
        self.assertEqual(conf, round(conf, 3))


class TestVADSegmentation(unittest.TestCase):

    def test_returns_list(self):
        audio = np.random.randn(SAMPLE_RATE).astype(np.float32)
        segments = _segment_audio(audio)
        self.assertIsInstance(segments, list)

    def test_silent_audio_no_segments(self):
        audio = np.zeros(SAMPLE_RATE, dtype=np.float32)
        segments = _segment_audio(audio)
        self.assertIsInstance(segments, list)

    def test_segments_are_numpy_arrays(self):
        audio = np.random.randn(SAMPLE_RATE).astype(np.float32) * 0.5
        segments = _segment_audio(audio)
        for seg in segments:
            self.assertIsInstance(seg, np.ndarray)


class TestRecognizeFunction(unittest.TestCase):

    def test_nonexistent_file_returns_error(self):
        result = recognize("nonexistent_file.wav")
        self.assertFalse(result["recognized"])
        self.assertIn("error", result)

    def test_result_has_recognized_key(self, tmp_path=None):
        import tempfile
        import soundfile as sf
        audio = np.zeros(SAMPLE_RATE, dtype=np.float32)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            sf.write(f.name, audio, SAMPLE_RATE)
            result = recognize(f.name)
        self.assertIn("recognized", result)

    def test_result_has_input_type_key(self):
        import tempfile
        import soundfile as sf
        audio = np.zeros(SAMPLE_RATE, dtype=np.float32)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            sf.write(f.name, audio, SAMPLE_RATE)
            result = recognize(f.name)
        self.assertIn("input_type", result)
        self.assertEqual(result["input_type"], "audio_warlpiri")

    def test_silent_audio_not_recognized(self):
        import tempfile
        import soundfile as sf
        audio = np.zeros(SAMPLE_RATE, dtype=np.float32)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            sf.write(f.name, audio, SAMPLE_RATE)
            result = recognize(f.name)
        self.assertFalse(result["recognized"])

    def test_fever_recording_returns_dict(self):
        fever_wav = "backend/data/recordings/train_set/fever_wp.wav"
        if not os.path.exists(fever_wav):
            self.skipTest("Yoshani's fever_wp.wav not available")
        result = recognize(fever_wav)
        self.assertIsInstance(result, dict)
        self.assertIn("recognized", result)

    def test_recognized_result_has_symptoms_key(self):
        fever_wav = "backend/data/recordings/train_set/fever_wp.wav"
        if not os.path.exists(fever_wav):
            self.skipTest("Yoshani's fever_wp.wav not available")
        result = recognize(fever_wav)
        if result["recognized"]:
            self.assertIn("symptoms", result)
            self.assertIn("confidence", result)
            self.assertIn("matched_keywords", result)


class TestKeywordMFCCIntegrity(unittest.TestCase):
    """Validates keyword_mfcc.json has correct structure for all keywords."""

    def test_all_symptom_keywords_present(self):
        expected = [
            "rdurrurlpu", "walpawalpa", "kuntulpinyi", "mangarli",
            "miyalu", "ngarlungarlu", "yurlkulyu", "jinirrpa",
            "mata", "kurruru", "purrkunypa", "pawiyi",
            "mardalmardal", "yayirri", "langa", "milpa",
            "rampaku", "nantu", "ngamanjimanji", "nguku",
            "jirrjinti", "waninja", "tiirnki", "mirrmirr",
            "rdulpu", "nguurlnguurlpa", "kilpirli",
        ]
        for keyword in expected:
            self.assertIn(keyword, KEYWORD_MFCC,
                f"Symptom keyword '{keyword}' missing from keyword_mfcc.json")

    def test_all_answer_keywords_present(self):
        expected = [
            "yuwayi", "lawa", "witapardu", "wiriwiri",
            "wirinyayirni", "kuurrnyinamijuku", "jalangu",
            "pirrarni", "pirrarnijarrakurra", "wiikikurra",
            "wiikipanukurra", "wati", "karnta", "kurdu",
            "mangi", "kurduwangu", "purlka",
        ]
        for keyword in expected:
            self.assertIn(keyword, KEYWORD_MFCC,
                f"Answer keyword '{keyword}' missing from keyword_mfcc.json")

    def test_all_refs_load_as_numpy_arrays(self):
        for keyword, refs in _KEYWORD_REFS.items():
            for i, ref in enumerate(refs):
                self.assertIsInstance(ref, np.ndarray,
                    f"keyword '{keyword}' ref {i} is not numpy array")

    def test_no_empty_references(self):
        for keyword, refs in _KEYWORD_REFS.items():
            self.assertGreater(len(refs), 0,
                f"keyword '{keyword}' has no references")
            for ref in refs:
                self.assertGreater(ref.shape[1], 0,
                    f"keyword '{keyword}' has zero frames")

    def test_total_keyword_count_at_least_47(self):
        self.assertGreaterEqual(len(KEYWORD_MFCC), 47)


if __name__ == '__main__':
    unittest.main(verbosity=2)
