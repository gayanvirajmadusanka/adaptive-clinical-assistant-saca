import json
import os

_questions_path = os.path.join(os.path.dirname(__file__), '../../data/questions.json')
with open(_questions_path) as file:
    QUESTIONS_DATA = json.load(file)

CRITICAL_SYMPTOMS = set(QUESTIONS_DATA['critical_symptoms'])
SYMPTOM_QUESTIONS = QUESTIONS_DATA['symptom_questions']
MANDATORY_QUESTIONS = QUESTIONS_DATA['mandatory']

ID = "id"
TEXT = "text"
TEXT_WP = "text_wp"
LANG_EN = "en"
LANG_WP = "wp"
OPTIONS = "options"
TYPE = "type"

_QUESTION_LOOKUP = {
    question[ID]: question
    for symptom_questions in SYMPTOM_QUESTIONS.values()
    for question in symptom_questions
}


def get_questions(symptoms: list, language: str = LANG_EN) -> dict:
    """
    Build the question list for a given set of symptoms.
    Mandatory questions always included first, followed by exactly
    2 symptom-specific questions selected based on number of symptoms.
    :param symptoms: List of extracted symptom strings
    :param language: Language code - 'en' or 'wp'
    :return: Dict with language and list of formatted questions
    """
    questions = []

    for question in MANDATORY_QUESTIONS:
        questions.append(_format_question(question, language))

    # find symptoms that have questions defined
    matched_symptoms = [
        symptom for symptom in symptoms
        if symptom.lower().strip() in SYMPTOM_QUESTIONS
    ]

    if len(matched_symptoms) == 0:
        pass  # no symptom questions to add

    elif len(matched_symptoms) == 1:
        # 1 symptom - take up to 2 questions from it
        symptom = matched_symptoms[0].lower().strip()
        for question in SYMPTOM_QUESTIONS[symptom][:2]:
            questions.append(_format_question(question, language))

    else:
        # 2+ symptoms - take 1 question from each of first 2 matched symptoms
        for symptom in matched_symptoms[:2]:
            symptom_lower = symptom.lower().strip()
            first_question = SYMPTOM_QUESTIONS[symptom_lower][0]
            questions.append(_format_question(first_question, language))

    return {
        "language": language,
        "questions": questions
    }


def _format_question(question: dict, language: str) -> dict:
    """
    Format a single question for the API response.
    Falls back to English if Warlpiri text is not available.
    :param question: Raw question dict from questions.json
    :param language: Language code - 'en' or 'wp'
    :return: Formatted question dict for API response
    """
    text = question.get(TEXT_WP) if language == LANG_WP else question.get(TEXT)

    formatted = {
        ID: question[ID],
        TEXT: text or question[TEXT],
    }

    if OPTIONS in question:
        formatted[TYPE] = 'multiple_choice'
        formatted[OPTIONS] = [
            {
                ID: option[ID],
                TEXT: option.get(TEXT_WP) if language == LANG_WP else option.get(TEXT)
            }
            for option in question[OPTIONS]
        ]
    else:
        formatted[TYPE] = 'yes_no'
        formatted[OPTIONS] = [
            {ID: question[ID] + 'y', TEXT: "Yes" if language == LANG_EN else "Yuwayi"},
            {ID: question[ID] + 'n', TEXT: "No" if language == LANG_EN else "Lawa"}
        ]

    return formatted


def resolve_answers(answers: list, symptoms: list) -> dict:
    """
    Process the answers array from /classify and derive the signals
    needed by the ML component.
    :param answers: List of dicts with question_id and answer_id
    :param symptoms: List of symptom strings to check against critical list
    :return: Dict with intensity_signal, has_critical, duration_value
    """
    gender = None
    age_group = None
    intensity_signal = 0
    has_critical = 0
    duration_value = 0

    # check if any extracted symptom is inherently critical
    for symptom in symptoms:
        if symptom.lower().strip() in CRITICAL_SYMPTOMS:
            has_critical = 1
            break

    for answer in answers:
        qid = answer.get('question_id', '')
        aid = answer.get('answer_id', '')

        # gender question
        if qid == '0a':
            if aid == '0a1':
                gender = 'male'
            elif aid == '0a2':
                gender = 'female'

        # age group question
        elif qid == '0b':
            age_map = {
                '0b1': 'child',
                '0b2': 'youth',
                '0b3': 'adult',
                '0b4': 'elder'
            }
            age_group = age_map.get(aid)

        # duration question
        elif qid == '1':
            if aid in ('1a', '1b', '1c'):  # today / yesterday / 2-3 days
                duration_value = 0
            elif aid in ('1d', '1e'):  # About a week / More than a week
                duration_value = 1

        # severity question
        elif qid == '2':
            if aid in ('2a', '2b'):  # none / a little
                intensity_signal = 0
            elif aid == '2c':  # moderate
                intensity_signal = 1
            elif aid == '2d':  # very bad
                intensity_signal = 2
            elif aid == '2e':  # unbearable - auto escalate
                intensity_signal = 2
                has_critical = 1

        # symptom-specific questions
        else:
            q_def = _find_question_def(qid)
            if q_def and q_def.get('critical_if') == 'yes' and aid.endswith('y'):
                has_critical = 1
                intensity_signal = max(intensity_signal, 2)

    return {
        'intensity_signal': intensity_signal,
        'has_critical': has_critical,
        'duration_value': duration_value,
        'gender': gender,
        'age_group': age_group
    }


def _find_question_def(question_id: str):
    """
    Look up a question definition by ID.
    :param question_id: The question ID string
    :return: Question dict if found, None otherwise
    """
    return _QUESTION_LOOKUP.get(question_id)
