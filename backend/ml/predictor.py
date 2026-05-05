"""
ML triage predictor module.
Loads a stacking ensemble model and runs inference to produce
severity classification and treatment recommendations.
"""
import pickle
from dataclasses import dataclass

import numpy as np
import scipy.sparse

from backend.api.services.audio_service import get_severity_audio
from backend.constants import Language, Recommendation, Severity


@dataclass
class PredictorResult:
    """Result returned by TriagePredictor.predict."""
    recommendation: str
    severity: str
    severity_mode: str
    confidence: float
    recommended_action: str
    has_critical: bool
    intensity_signal: int
    voice_b64: str


SEVERITY_MAP = {
    (Recommendation.DOCTOR_CONSULTATION, 2, 1): Severity.SEVERE,
    (Recommendation.DOCTOR_CONSULTATION, 2, 0): Severity.SEVERE,
    (Recommendation.DOCTOR_CONSULTATION, 1, 1): Severity.SEVERE,
    (Recommendation.DOCTOR_CONSULTATION, 1, 0): Severity.MODERATE,
    (Recommendation.DOCTOR_CONSULTATION, 0, 1): Severity.MODERATE,
    (Recommendation.DOCTOR_CONSULTATION, 0, 0): Severity.MODERATE,
    (Recommendation.OTC_DRUG, 2, 1): Severity.MODERATE,
    (Recommendation.OTC_DRUG, 2, 0): Severity.MODERATE,
    (Recommendation.OTC_DRUG, 1, 1): Severity.MODERATE,
    (Recommendation.OTC_DRUG, 1, 0): Severity.MILD,
    (Recommendation.OTC_DRUG, 0, 1): Severity.MODERATE,
    (Recommendation.OTC_DRUG, 0, 0): Severity.MILD,
}

RECOMMENDED_ACTIONS = {
    Severity.MILD: {
        Language.EN: 'You can treat this at home with over-the-counter medication. See a doctor if symptoms worsen.',
        Language.WP: 'Mirrijini nyuntu mardarni. Ngangkayikurra yanta kaji wirinyayirni.'
    },
    Severity.MODERATE: {
        Language.EN: 'Please visit the clinic or health worker today.',
        Language.WP: 'Jalangu ngangkayikurra yanta.'
    },
    Severity.SEVERE: {
        Language.EN: 'Seek emergency medical attention immediately or call 000.',
        Language.WP: 'Kapanku ngangkayikurra yanta. 000 wangkaya.'
    }
}

SEVERITY_TRANSLATIONS = {
    Severity.MILD: {Language.EN: 'Mild', Language.WP: 'Witapardu'},
    Severity.MODERATE: {Language.EN: 'Moderate', Language.WP: 'Wiriwiri'},
    Severity.SEVERE: {Language.EN: 'Severe', Language.WP: 'Wirinyayirni'}
}

RECOMMENDATION_TRANSLATIONS = {
    Recommendation.DOCTOR_CONSULTATION: {Language.EN: 'Doctor Consultation', Language.WP: 'Ngangkayi nyanyi'},
    Recommendation.OTC_DRUG: {Language.EN: 'OTC Drug', Language.WP: 'Mirrijini'}
}


class TriagePredictor:
    """
    Loads a stacking ensemble model and runs triage inference.
    Combines TF-IDF symptom features with demographic and severity signals
    to predict a recommendation and severity level.
    """

    def __init__(self, model_path: str, tfidf_path: str, le_path: str):
        """
        Load all serialised model artefacts at startup.
        :param model_path: Path to trained ensemble model pickle
        :param tfidf_path: Path to fitted TF-IDF vectoriser pickle
        :param le_path: Path to fitted label encoder pickle
        """
        with open(model_path, 'rb') as file:
            self.model = pickle.load(file)
        with open(tfidf_path, 'rb') as file:
            self.tfidf = pickle.load(file)
        with open(le_path, 'rb') as file:
            self.le = pickle.load(file)

    def predict(
            self,
            symptoms: list, age: str, gender: str, duration_value: int, intensity_signal: int, has_critical: int,
            severity_context: int = 1, language: str = Language.EN) -> PredictorResult:
        """
        Run inference on structured symptom and demographic input.
        :param symptoms: List of extracted English symptom strings
        :param age: Age group string - 'child', 'youth', 'adult', or 'elder'
        :param gender: Gender string - 'male' or 'female'
        :param duration_value: Encoded duration from questions (0 or 1)
        :param intensity_signal: Pain intensity signal (0, 1, or 2)
        :param has_critical: Critical symptom flag (0 or 1)
        :param severity_context: Severity context feature for ML (default 1)
        :param language: Language code - 'en' or 'wp' (default 'en')
        :return: PredictorResult with recommendation, severity, severity_mode, confidence, and action
        """
        gender_enc = 1 if gender.lower() == 'female' else 0
        age_enc = self._encode_age(age)

        symptom_str = ' '.join([symptom.lower().replace('_', ' ') for symptom in symptoms])
        x_tfidf = self.tfidf.transform([symptom_str])

        demo = scipy.sparse.csr_matrix(
            np.array([[gender_enc, duration_value, age_enc]])
        )
        sev_feat = scipy.sparse.csr_matrix(
            np.array([[severity_context]])
        )
        x = scipy.sparse.hstack([x_tfidf, demo, sev_feat])

        prediction = self.model.predict(x)[0]
        proba = self.model.predict_proba(x)[0]
        confidence = float(max(proba))
        recommendation = self.le.inverse_transform([prediction])[0]

        severity = SEVERITY_MAP.get(
            (recommendation, intensity_signal, has_critical),
            Severity.MODERATE  # safe default - always escalate if unknown
        )

        voice_b64 = get_severity_audio(severity, language)
        return PredictorResult(
            recommendation=RECOMMENDATION_TRANSLATIONS[recommendation][language],
            severity_mode=severity.name,
            severity=SEVERITY_TRANSLATIONS[severity][language],
            confidence=float(f"{confidence:.4f}"),
            recommended_action=RECOMMENDED_ACTIONS[severity][language],
            has_critical=bool(has_critical),
            intensity_signal=intensity_signal,
            voice_b64=voice_b64,
        )

    @staticmethod
    def _encode_age(age: str) -> int:
        """
        Convert age group string to ordinal encoded value.
        :param age: Age group string - 'child', 'youth', 'adult', or 'elder'
        :return: Encoded integer 0-4
        """
        age_group_map = {
            'child': 1,  # 6-15 years bracket
            'youth': 1,  # 6-15 years bracket
            'adult': 2,  # 16-45 years bracket
            'elder': 4  # above 60 years bracket
        }
        return age_group_map.get((age or '').lower().strip(), 2)  # safe default - adult
