import json
import os

from backend_release_android.api.schemas.request_response import Question, QuestionOption, QuestionsResponse
from backend_release_android.api.services.audio_service import get_question_audio
from backend_release_android.constants import Language

_questions_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    'data', 'questions.json'
)
with open(_questions_path) as _f:
    QUESTIONS_DATA = json.load(_f)

CRITICAL_SYMPTOMS  = set(QUESTIONS_DATA['critical_symptoms'])
SYMPTOM_QUESTIONS  = QUESTIONS_DATA['symptom_questions']
MANDATORY_QUESTIONS = QUESTIONS_DATA['mandatory']

ID      = "id"
TEXT    = "text"
TEXT_WP = "text_wp"
OPTIONS = "options"

_QUESTION_LOOKUP = {
    question[ID]: question
    for symptom_questions in SYMPTOM_QUESTIONS.values()
    for question in symptom_questions
}


def get_questions(symptoms: list, language: Language = Language.EN) -> QuestionsResponse:
    questions = [_format_question(q, language) for q in MANDATORY_QUESTIONS]

    matched = [s for s in symptoms if s.lower().strip() in SYMPTOM_QUESTIONS]

    if len(matched) == 1:
        symptom = matched[0].lower().strip()
        for q in SYMPTOM_QUESTIONS[symptom][:2]:
            questions.append(_format_question(q, language))
    elif len(matched) >= 2:
        for symptom in matched[:2]:
            first_q = SYMPTOM_QUESTIONS[symptom.lower().strip()][0]
            questions.append(_format_question(first_q, language))

    return QuestionsResponse(language=language, questions=questions)


def _format_question(question: dict, language: Language) -> Question:
    text = question.get(TEXT_WP) if language == Language.WP else question.get(TEXT)

    if OPTIONS in question:
        q_type       = 'multiple_choice'
        options_data = [
            {
                ID:   option[ID],
                TEXT: option.get(TEXT_WP) if language == Language.WP else option.get(TEXT)
            }
            for option in question[OPTIONS]
        ]
    else:
        q_type       = 'yes_no'
        options_data = [
            {ID: question[ID] + 'y', TEXT: "Yes" if language == Language.EN else "Yuwayi"},
            {ID: question[ID] + 'n', TEXT: "No"  if language == Language.EN else "Lawa"}
        ]

    voice_b64 = get_question_audio(question[ID], options_data, language)
    return Question(
        id=question[ID], text=text or question[TEXT], type=q_type,
        options=[QuestionOption(id=o[ID], text=o[TEXT]) for o in options_data],
        voice_b64=voice_b64,
    )


def resolve_answers(answers: list, symptoms: list) -> dict:
    gender           = None
    age_group        = None
    intensity_signal = 0
    has_critical     = 0
    duration_value   = 0

    for symptom in symptoms:
        if symptom.lower().strip() in CRITICAL_SYMPTOMS:
            has_critical = 1
            break

    for answer in answers:
        qid = answer.get('question_id', '')
        aid = answer.get('answer_id', '')

        if qid == '0a':
            gender = 'male' if aid == '0a1' else 'female' if aid == '0a2' else None
        elif qid == '0b':
            age_group = {'0b1': 'child', '0b2': 'youth', '0b3': 'adult', '0b4': 'elder'}.get(aid)
        elif qid == '1':
            duration_value = 0 if aid in ('1a', '1b', '1c') else 1
        elif qid == '2':
            if aid in ('2a', '2b'):
                intensity_signal = 0
            elif aid == '2c':
                intensity_signal = 1
            elif aid in ('2d', '2e'):
                intensity_signal = 2
            if aid == '2e':
                has_critical = 1
        else:
            q_def = _QUESTION_LOOKUP.get(qid)
            if q_def and q_def.get('critical_if') == 'yes' and aid.endswith('y'):
                has_critical     = 1
                intensity_signal = max(intensity_signal, 2)

    return {
        'intensity_signal': intensity_signal, 'has_critical': has_critical,
        'duration_value':   duration_value,   'gender':       gender,
        'age_group':        age_group
    }


def _find_question_def(question_id: str):
    return _QUESTION_LOOKUP.get(question_id)
