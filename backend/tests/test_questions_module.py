from backend.api.questions.questions_module import get_questions, resolve_answers, _find_question_def


class TestGetQuestions:

    def test_returns_mandatory_questions_always(self):
        result = get_questions([], 'en')
        assert result['language'] == 'en'
        # mandatory questions always included even with no symptoms
        assert len(result['questions']) >= 2
        assert result['questions'][0]['id'] == '1'
        assert result['questions'][1]['id'] == '2'

    def test_returns_symptom_questions_for_known_symptom(self):
        result = get_questions(['fever'], 'en')
        question_ids = [q['id'] for q in result['questions']]
        # fever questions are 10 and 11
        assert '10' in question_ids or '11' in question_ids

    def test_unknown_symptom_returns_only_mandatory(self):
        result = get_questions(['some random thing'], 'en')
        assert len(result['questions']) == 2

    def test_max_symptom_questions_capped_at_5(self):
        # pass many symptoms to trigger cap
        symptoms = ['fever', 'headache', 'cough', 'dizziness', 'vomiting', 'diarrhea']
        result = get_questions(symptoms, 'en')
        # mandatory (2) + symptom questions (max 5) = max 7
        assert len(result['questions']) <= 7

    def test_warlpiri_language_returns_wp_text(self):
        result = get_questions([], 'wp')
        assert result['language'] == 'wp'
        # mandatory question text should be warlpiri
        first_q = result['questions'][0]
        assert first_q['text'] == 'Ngurrju-warnu nyinami?'

    def test_yes_no_question_has_yes_no_options(self):
        result = get_questions(['fever'], 'en')
        # find a symptom question (not mandatory ones which have multiple choice)
        symptom_qs = [q for q in result['questions'] if q.get('type') == 'yes_no']
        assert len(symptom_qs) > 0
        options = symptom_qs[0]['options']
        option_ids = [o['id'] for o in options]
        # yes option ends with y, no option ends with n
        assert any(oid.endswith('y') for oid in option_ids)
        assert any(oid.endswith('n') for oid in option_ids)

    def test_mandatory_questions_are_multiple_choice(self):
        result = get_questions([], 'en')
        for q in result['questions'][:2]:
            assert q['type'] == 'multiple_choice'
            assert len(q['options']) > 0


class TestResolveAnswers:

    def test_duration_today_gives_zero(self):
        answers = [{'question_id': '1', 'answer_id': '1a'}]
        result = resolve_answers(answers, [])
        assert result['duration_value'] == 0

    def test_duration_more_than_3_days_gives_one(self):
        answers = [{'question_id': '1', 'answer_id': '1c'}]
        result = resolve_answers(answers, [])
        assert result['duration_value'] == 1

    def test_severity_mild_gives_intensity_zero(self):
        answers = [{'question_id': '2', 'answer_id': '2a'}]
        result = resolve_answers(answers, [])
        assert result['intensity_signal'] == 0

    def test_severity_moderate_gives_intensity_one(self):
        answers = [{'question_id': '2', 'answer_id': '2b'}]
        result = resolve_answers(answers, [])
        assert result['intensity_signal'] == 1

    def test_severity_severe_gives_intensity_two_and_critical(self):
        answers = [{'question_id': '2', 'answer_id': '2c'}]
        result = resolve_answers(answers, [])
        assert result['intensity_signal'] == 2
        assert result['has_critical'] == 1

    def test_critical_symptom_sets_has_critical(self):
        result = resolve_answers([], ['chest pain'])
        assert result['has_critical'] == 1

    def test_non_critical_symptom_does_not_set_flag(self):
        result = resolve_answers([], ['headache'])
        assert result['has_critical'] == 0

    def test_yes_to_critical_question_sets_flag(self):
        # fever question 10 has critical_if yes
        answers = [{'question_id': '10', 'answer_id': '10y'}]
        result = resolve_answers(answers, [])
        assert result['has_critical'] == 1
        assert result['intensity_signal'] == 2

    def test_no_to_critical_question_does_not_set_flag(self):
        answers = [{'question_id': '10', 'answer_id': '10n'}]
        result = resolve_answers(answers, [])
        assert result['has_critical'] == 0

    def test_intensity_takes_max_value(self):
        # mild overall but severe symptom question answer
        answers = [
            {'question_id': '2', 'answer_id': '2a'},  # mild
            {'question_id': '10', 'answer_id': '10y'}  # critical yes
        ]
        result = resolve_answers(answers, [])
        assert result['intensity_signal'] == 2

    def test_empty_answers_returns_defaults(self):
        result = resolve_answers([], [])
        assert result['intensity_signal'] == 0
        assert result['has_critical'] == 0
        assert result['duration_value'] == 0


class TestFindQuestionDef:

    def test_finds_existing_question(self):
        q = _find_question_def('10')
        assert q is not None
        assert q['id'] == '10'

    def test_returns_none_for_unknown_id(self):
        q = _find_question_def('999')
        assert q is None
