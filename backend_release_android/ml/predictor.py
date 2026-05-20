import os
import pickle
from dataclasses import dataclass

import numpy as np
import scipy.sparse

from backend_release_android.api.services.audio_service import get_severity_audio
from backend_release_android.constants import Language, Recommendation, Severity

_RELEASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_MODEL_DIR   = os.path.join(_RELEASE_DIR, "models")


@dataclass
class PredictorResult:
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
    Severity.MILD:     {Language.EN: 'Mild',     Language.WP: 'Witapardu'},
    Severity.MODERATE: {Language.EN: 'Moderate', Language.WP: 'Wiriwiri'},
    Severity.SEVERE:   {Language.EN: 'Severe',   Language.WP: 'Wirinyayirni'}
}

RECOMMENDATION_TRANSLATIONS = {
    Recommendation.DOCTOR_CONSULTATION: {Language.EN: 'Doctor Consultation', Language.WP: 'Ngangkayi nyanyi'},
    Recommendation.OTC_DRUG:            {Language.EN: 'OTC Drug',            Language.WP: 'Mirrijini'}
}


class TriagePredictor:
    def __init__(self, model_path: str, tfidf_path: str, le_path: str):
        with open(model_path, 'rb') as f: self.model = pickle.load(f)
        with open(tfidf_path, 'rb') as f: self.tfidf = pickle.load(f)
        with open(le_path,    'rb') as f: self.le    = pickle.load(f)

    def predict(
        self, symptoms: list, age: str, gender: str, duration_value: int,
        intensity_signal: int, has_critical: int, severity_context: int = 1,
        language: Language = Language.EN
    ) -> PredictorResult:
        gender_enc  = 1 if (gender or '').lower() == 'female' else 0
        age_enc     = self._encode_age(age)
        symptom_str = ' '.join(s.lower().replace('_', ' ') for s in symptoms)
        x_tfidf     = self.tfidf.transform([symptom_str])
        demo        = scipy.sparse.csr_matrix(np.array([[gender_enc, duration_value, age_enc]]))
        sev_feat    = scipy.sparse.csr_matrix(np.array([[severity_context]]))
        x           = scipy.sparse.hstack([x_tfidf, demo, sev_feat])

        prediction     = self.model.predict(x)[0]
        proba          = self.model.predict_proba(x)[0]
        confidence     = float(max(proba))
        recommendation = self.le.inverse_transform([prediction])[0]

        severity = SEVERITY_MAP.get(
            (recommendation, intensity_signal, has_critical), Severity.MODERATE
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
        return {'child': 1, 'youth': 1, 'adult': 2, 'elder': 4}.get(
            (age or '').lower().strip(), 2
        )
