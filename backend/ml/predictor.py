import pickle

import numpy as np
import scipy.sparse

from backend.api.services.audio_service import get_severity_audio

DOCTOR_CONSULTATION = "Doctor Consultation"
OTC_DRUG = "OTC Drug"
MILD = "Mild"
MODERATE = "Moderate"
SEVERE = "Severe"

SEVERITY_MAP = {
    (DOCTOR_CONSULTATION, 2, 1): SEVERE,
    (DOCTOR_CONSULTATION, 2, 0): SEVERE,
    (DOCTOR_CONSULTATION, 1, 1): SEVERE,
    (DOCTOR_CONSULTATION, 1, 0): MODERATE,
    (DOCTOR_CONSULTATION, 0, 1): MODERATE,
    (DOCTOR_CONSULTATION, 0, 0): MODERATE,
    (OTC_DRUG, 2, 1): MODERATE,
    (OTC_DRUG, 2, 0): MODERATE,
    (OTC_DRUG, 1, 1): MODERATE,
    (OTC_DRUG, 1, 0): MILD,
    (OTC_DRUG, 0, 1): MODERATE,
    (OTC_DRUG, 0, 0): MILD,
}

RECOMMENDED_ACTIONS = {
    'Mild': {
        'en': 'You can treat this at home with over-the-counter medication. See a doctor if symptoms worsen.',
        'wp': 'Mirrijini nyuntu mardarni. Ngangkayikurra yanta kaji wirinyayirni.'
    },
    'Moderate': {
        'en': 'Please visit the clinic or health worker today.',
        'wp': 'Jalangu ngangkayikurra yanta.'
    },
    'Severe': {
        'en': 'Seek emergency medical attention immediately or call 000.',
        'wp': 'Kapanku ngangkayikurra yanta. 000 wangkaya.'
    }
}

SEVERITY_TRANSLATIONS = {
    'Mild': {'en': 'Mild', 'wp': 'Witapardu'},
    'Moderate': {'en': 'Moderate', 'wp': 'Wiriwiri'},
    'Severe': {'en': 'Severe', 'wp': 'Wirinyayirni'}
}

RECOMMENDATION_TRANSLATIONS = {
    'Doctor Consultation': {'en': 'Doctor Consultation', 'wp': 'Ngangkayi nyanyi'},
    'OTC Drug': {'en': 'OTC Drug', 'wp': 'Mirrijini'}
}


class TriagePredictor:
    """
    Class for predicting triage result
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
            symptoms: list,
            age: str,
            gender: str,
            duration_value: int,
            intensity_signal: int,
            has_critical: int,
            severity_context: int = 1,
            language: str = 'en'
    ) -> dict:
        """
        Run inference on structured symptom and demographic input.
        :param symptoms: List of extracted English symptom strings
        :param age: Age string or integer
        :param gender: Gender string - 'male' or 'female'
        :param duration_value: Encoded duration from questions (0 or 1)
        :param intensity_signal: Pain intensity signal (0, 1, or 2)
        :param has_critical: Critical symptom flag (0 or 1)
        :param severity_context: Severity context feature for ML (default 1)
        :param language: Language (default 'en')
        :return: Dict with recommendation, severity, confidence, action
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
            MODERATE  # safe default - always escalate if unknown
        )

        # get severity audio for the result screen
        voice_b64 = get_severity_audio(severity, language)

        return {
            'recommendation': RECOMMENDATION_TRANSLATIONS[recommendation][language],
            'severity_mode': severity.upper(),
            'severity': SEVERITY_TRANSLATIONS[severity][language],
            'confidence': float(f"{confidence:.4f}"),
            'recommended_action': RECOMMENDED_ACTIONS[severity][language],
            'has_critical': bool(has_critical),
            'intensity_signal': intensity_signal,
            'voice_b64': voice_b64,
        }

    @staticmethod
    def _encode_age(age: str) -> int:
        """
        Convert age group or integer to ordinal encoded value.
        :param age: Age as string group
        :return: Encoded integer 0-4
        """
        # handle age_group strings from questions
        age_group_map = {
            'child': 1,  # maps to 6-15 years bracket
            'youth': 1,  # also 6-15 years bracket
            'adult': 2,  # 16-45 years bracket
            'elder': 4  # above 60 years bracket
        }

        return age_group_map.get((age or '').lower().strip(), 2)  # safe default - adult
