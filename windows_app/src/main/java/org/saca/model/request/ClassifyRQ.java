package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Request model for submitting detected symptoms and user answers
 * to the SACA classification API endpoint.
 *
 * <p>Extends {@link CommonRQ} to inherit the {@code language} field.
 * Sends the list of detected symptom IDs alongside the user's answers
 * to follow-up questions for severity classification.</p>
 *
 * <p>Serialises to the following JSON structure:</p>
 * <pre>{@code
 * {
 *   "language": "en",
 *   "symptoms": ["headache", "fever"],
 *   "answers":  [{ "question_id": "pain_duration", "answer_id": "today" }]
 * }
 * }</pre>
 *
 * @author Gayan Madusanka
 * @see CommonRQ
 * @see AnswerRQ
 */
public class ClassifyRQ extends CommonRQ {

    /**
     * List of detected symptom IDs to classify.
     */
    @JsonProperty("symptoms")
    private List<String> symptoms;

    /**
     * List of user answers to follow-up questions.
     */
    @JsonProperty("answers")
    private List<AnswerRQ> answers;

    /**
     * Returns the list of detected symptom IDs.
     *
     * @return list of symptom ID strings
     */
    public List<String> getSymptoms() {
        return symptoms;
    }

    /**
     * Sets the list of detected symptom IDs.
     *
     * @param symptoms list of symptom ID strings
     */
    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    /**
     * Returns the list of user answers to follow-up questions.
     *
     * @return list of {@link AnswerRQ} objects
     */
    public List<AnswerRQ> getAnswers() {
        return answers;
    }

    /**
     * Sets the list of user answers to follow-up questions.
     *
     * @param answers list of {@link AnswerRQ} objects
     */
    public void setAnswers(List<AnswerRQ> answers) {
        this.answers = answers;
    }
}

