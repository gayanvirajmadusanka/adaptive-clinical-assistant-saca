from unittest.mock import MagicMock, patch

import pytest

from backend.ml.predictor import SEVERITY_MAP, RECOMMENDED_ACTIONS, TriagePredictor


class TestSeverityMap:

    def test_doctor_high_intensity_critical_is_severe(self):
        assert SEVERITY_MAP[('Doctor Consultation', 2, 1)] == 'Severe'

    def test_doctor_high_intensity_no_critical_is_severe(self):
        assert SEVERITY_MAP[('Doctor Consultation', 2, 0)] == 'Severe'

    def test_doctor_moderate_intensity_critical_is_severe(self):
        assert SEVERITY_MAP[('Doctor Consultation', 1, 1)] == 'Severe'

    def test_doctor_moderate_intensity_no_critical_is_moderate(self):
        assert SEVERITY_MAP[('Doctor Consultation', 1, 0)] == 'Moderate'

    def test_doctor_low_intensity_no_critical_is_moderate(self):
        assert SEVERITY_MAP[('Doctor Consultation', 0, 0)] == 'Moderate'

    def test_otc_low_intensity_no_critical_is_mild(self):
        assert SEVERITY_MAP[('OTC Drug', 0, 0)] == 'Mild'

    def test_otc_high_intensity_escalates_to_moderate(self):
        assert SEVERITY_MAP[('OTC Drug', 2, 0)] == 'Moderate'

    def test_otc_critical_flag_escalates_to_moderate(self):
        assert SEVERITY_MAP[('OTC Drug', 0, 1)] == 'Moderate'

    def test_all_severity_map_keys_have_valid_values(self):
        valid = {'Mild', 'Moderate', 'Severe'}
        for key, val in SEVERITY_MAP.items():
            assert val in valid, f"Invalid severity value {val} for key {key}"


class TestRecommendedActions:

    def test_all_severities_have_actions(self):
        assert 'Mild' in RECOMMENDED_ACTIONS
        assert 'Moderate' in RECOMMENDED_ACTIONS
        assert 'Severe' in RECOMMENDED_ACTIONS

    def test_severe_mentions_000(self):
        assert any('000' in value for value in RECOMMENDED_ACTIONS['Severe'].values())


class TestEncodeAge:

    @pytest.fixture
    def predictor(self):
        # mock the file loading so we dont need actual model files
        with patch('builtins.open', MagicMock()):
            with patch('pickle.load', MagicMock()):
                return TriagePredictor('m.pkl', 't.pkl', 'l.pkl')

    def test_below_5_encodes_to_0(self, predictor):
        assert predictor._encode_age('below 5 years') == 0

    def test_6_15_encodes_to_1(self, predictor):
        assert predictor._encode_age('6-15 years') == 1

    def test_16_45_encodes_to_2(self, predictor):
        assert predictor._encode_age('16-45 years') == 2

    def test_above_60_encodes_to_4(self, predictor):
        assert predictor._encode_age('above 60 years') == 4

    def test_unknown_string_defaults_to_2(self, predictor):
        assert predictor._encode_age('unknown bracket') == 2

    def test_integer_age_3_encodes_to_0(self, predictor):
        assert predictor._encode_age(3) == 0

    def test_integer_age_25_encodes_to_2(self, predictor):
        assert predictor._encode_age(25) == 2

    def test_integer_age_70_encodes_to_4(self, predictor):
        assert predictor._encode_age(70) == 4
