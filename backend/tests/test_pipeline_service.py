from unittest.mock import patch

import pytest

from backend.api.services.pipeline_service import classify


class TestClassify:

    @pytest.fixture(autouse=True)
    def mock_predictor(self):
        # mock predictor so tests don't need actual model files
        with patch('backend.api.services.pipeline_service.predictor') as mock:
            mock.predict.return_value = {
                'recommendation': 'Doctor Consultation',
                'severity': 'Moderate',
                'confidence': 0.91,
                'recommended_action': 'Please visit the clinic or health worker today.',
                'has_critical': False,
                'intensity_signal': 1
            }
            yield mock

    def test_classify_returns_symptoms_in_response(self):
        result = classify(
            symptoms=['headache', 'fever'],
            answers=[
                {'question_id': '1', 'answer_id': '1b'},
                {'question_id': '2', 'answer_id': '2b'}
            ],
            age='16-45 years',
            gender='male'
        )
        assert result['symptoms'] == ['headache', 'fever']

    def test_classify_calls_predictor_with_resolved_signals(self, mock_predictor):
        classify(
            symptoms=['fever'],
            answers=[
                {'question_id': '1', 'answer_id': '1c'},  # more than 3 days
                {'question_id': '2', 'answer_id': '2c'}  # severe
            ],
            age='16-45 years',
            gender='female'
        )
        call_kwargs = mock_predictor.predict.call_args.kwargs
        assert call_kwargs['duration_value'] == 1
        assert call_kwargs['intensity_signal'] == 2
        assert call_kwargs['has_critical'] == 1
        assert call_kwargs['gender'] == 'female'

    def test_classify_returns_all_expected_fields(self):
        result = classify(
            symptoms=['headache'],
            answers=[],
            age='16-45 years',
            gender='male'
        )
        expected_keys = {
            'symptoms', 'recommendation', 'severity',
            'confidence', 'recommended_action', 'has_critical', 'intensity_signal'
        }
        assert expected_keys.issubset(result.keys())

    def test_critical_symptom_sets_has_critical_in_predictor_call(self, mock_predictor):
        classify(
            symptoms=['chest pain'],
            answers=[],
            age='16-45 years',
            gender='male'
        )
        call_kwargs = mock_predictor.predict.call_args.kwargs
        assert call_kwargs['has_critical'] == 1
