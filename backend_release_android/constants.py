from enum import Enum


class Language(str, Enum):
    EN = "en"
    WP = "wp"


class Severity(str, Enum):
    MILD = "Mild"
    MODERATE = "Moderate"
    SEVERE = "Severe"


class Recommendation(str, Enum):
    DOCTOR_CONSULTATION = "Doctor Consultation"
    OTC_DRUG = "OTC Drug"


class InputType(str, Enum):
    TEXT = "text"
    AUDIO = "audio"
    IMAGE = "image"


class AgeGroup(str, Enum):
    CHILD = "child"
    YOUTH = "youth"
    ADULT = "adult"
    ELDER = "elder"


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
