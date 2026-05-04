"""
Shared constants and enumerations used across the SACA backend.
"""
from enum import Enum


class Language(str, Enum):
    """Supported output languages."""
    EN = "en"
    WP = "wp"


class Severity(str, Enum):
    """Triage severity levels."""
    MILD = "Mild"
    MODERATE = "Moderate"
    SEVERE = "Severe"


class Recommendation(str, Enum):
    """ML model output class labels."""
    DOCTOR_CONSULTATION = "Doctor Consultation"
    OTC_DRUG = "OTC Drug"


class InputType(str, Enum):
    """Input modality for symptom extraction endpoints."""
    TEXT = "text"
    AUDIO = "audio"
    IMAGE = "image"


class AgeGroup(str, Enum):
    """Patient age group labels used in question answers and ML encoding."""
    CHILD = "child"
    YOUTH = "youth"
    ADULT = "adult"
    ELDER = "elder"


class Gender(str, Enum):
    """Patient gender labels used in question answers and ML encoding."""
    MALE = "male"
    FEMALE = "female"
