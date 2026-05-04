from unittest.mock import patch

import pytest

from backend.api.schemas.request_response import ClassifyResponse
from backend.api.services.pipeline_service import classify
from backend.ml.predictor import PredictorResult


class TestClassify:

    @pytest.fixture(autouse=True)
    def mock_predictor(self):
        with patch('backend.api.services.pipeline_service.predictor') as mock:
            mock.predict.return_value = PredictorResult(
                recommendation='Doctor Consultation',
                severity='Moderate',
                severity_mode='MODERATE',
                confidence=0.91,
                recommended_action='Please visit the clinic or health worker today.',
                has_critical=False,
                intensity_signal=1,
                voice_b64=''
            )
            yield mock

    def test_classify_returns_symptoms_in_response(self):
        result = classify(
            symptoms=['headache', 'fever'],
            answers=[
                {'question_id': '0a', 'answer_id': '0a1'},
                {'question_id': '0b', 'answer_id': '0b3'},
                {'question_id': '1', 'answer_id': '1b'},
                {'question_id': '2', 'answer_id': '2b'}
            ]
        )
        assert result.symptoms == ['headache', 'fever']

    def test_classify_calls_predictor_with_resolved_signals(self, mock_predictor):
        classify(
            symptoms=['fever'],
            answers=[
                {'question_id': '0a', 'answer_id': '0a2'},
                {'question_id': '0b', 'answer_id': '0b3'},
                {'question_id': '1', 'answer_id': '1d'},
                {'question_id': '2', 'answer_id': '2e'}
            ]
        )
        call_kwargs = mock_predictor.predict.call_args.kwargs
        assert call_kwargs['duration_value'] == 1
        assert call_kwargs['intensity_signal'] == 2
        assert call_kwargs['has_critical'] == 1
        assert call_kwargs['gender'] == 'female'

    def test_classify_returns_classify_response(self):
        result = classify(
            symptoms=['headache'],
            answers=[]
        )
        assert isinstance(result, ClassifyResponse)

    def test_critical_symptom_sets_has_critical_in_predictor_call(self, mock_predictor):
        classify(
            symptoms=['chest pain'],
            answers=[]
        )
        call_kwargs = mock_predictor.predict.call_args.kwargs
        assert call_kwargs['has_critical'] == 1

    def test_gender_resolved_from_answers(self, mock_predictor):
        classify(
            symptoms=['headache'],
            answers=[{'question_id': '0a', 'answer_id': '0a1'}]
        )
        call_kwargs = mock_predictor.predict.call_args.kwargs
        assert call_kwargs['gender'] == 'male'

    def test_age_group_resolved_from_answers(self):
        result = classify(
            symptoms=['headache'],
            answers=[{'question_id': '0b', 'answer_id': '0b1'}]
        )
        assert result.age_group == 'child'
