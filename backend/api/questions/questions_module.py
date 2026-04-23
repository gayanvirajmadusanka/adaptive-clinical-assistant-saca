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
    Mandatory questions are included first, followed by
    up to 2 symptom-specific questions per symptom (max 3 total).
    :param symptoms: List of extracted symptom strings
    :param language: Language code - 'en' or 'wp'
    :return: Dict with language and list of formatted questions
    """
    questions = []

    for question in MANDATORY_QUESTIONS:
        questions.append(_format_question(question, language))

    symptom_questions_added = 0
    for symptom in symptoms:
        symptom_lower = symptom.lower().strip()
        if symptom_lower in SYMPTOM_QUESTIONS and symptom_questions_added < 3:
            for question in SYMPTOM_QUESTIONS[symptom_lower][:2]:
                questions.append(_format_question(question, language))
                symptom_questions_added += 1

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
            {ID: question[ID] + 'n', TEXT: "No" if language == LANG_EN else "Wiya"}
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

        # mandatory - duration question
        if qid == '1':
            if aid == '1a':
                duration_value = 0  # today
            elif aid == '1b':
                duration_value = 0  # 1-3 days
            elif aid == '1c':
                duration_value = 1  # more than 3 days

        # mandatory - overall severity question
        elif qid == '2':
            if aid == '2a':
                intensity_signal = max(intensity_signal, 0)
            elif aid == '2b':
                intensity_signal = max(intensity_signal, 1)
            elif aid == '2c':
                intensity_signal = max(intensity_signal, 2)
                has_critical = 1  # self-reported severe always escalates

        # symptom-specific questions
        else:
            q_def = _find_question_def(qid)
            if q_def and q_def.get('critical_if') == 'yes' and aid.endswith('y'):  # yes answer
                has_critical = 1
                intensity_signal = max(intensity_signal, 2)

    return {
        'intensity_signal': intensity_signal,
        'has_critical': has_critical,
        'duration_value': duration_value
    }


def _find_question_def(question_id: str):
    """
    Look up a question definition by ID.
    :param question_id: The question ID string
    :return: Question dict if found, None otherwise
    """
    return _QUESTION_LOOKUP.get(question_id)
