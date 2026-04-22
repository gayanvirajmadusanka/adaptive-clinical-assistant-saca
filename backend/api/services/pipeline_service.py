import os

from backend.api.questions.questions_module import resolve_answers
from backend.ml.predictor import TriagePredictor

_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

predictor = TriagePredictor(
    model_path=os.path.join(_BASE_DIR, '../models', 'stacking_mlp_xgb.pkl'),
    tfidf_path=os.path.join(_BASE_DIR, '../models', 'tfidf_vectorizer.pkl'),
    le_path=os.path.join(_BASE_DIR, '../models', 'label_encoder.pkl')
)


def classify(symptoms: list, answers: list, age, gender: str, language='en') -> dict:
    """
    Orchestrate the full classification pipeline.
    Resolves answers to signals then runs ML inference.
    :param symptoms: List of extracted English symptom strings
    :param answers: List of answer dicts from frontend
    :param age: Patient age as string or integer
    :param gender: Patient gender string
    :return: Full triage result dict for API response
    """
    resolved = resolve_answers(answers, symptoms)

    result = predictor.predict(
        symptoms=symptoms,
        age=age,
        gender=gender,
        duration_value=resolved['duration_value'],
        intensity_signal=resolved['intensity_signal'],
        has_critical=resolved['has_critical'],
        severity_context=resolved['intensity_signal'],
        language=language
    )

    return {
        'symptoms': symptoms,
        **result
    }
