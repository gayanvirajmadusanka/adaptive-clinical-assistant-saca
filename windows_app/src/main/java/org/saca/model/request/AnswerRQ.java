package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Request model representing a single answer to a follow-up question
 * in the SACA symptom classification flow.
 *
 * <p>Encapsulates the question identifier, the selected answer identifier,
 * and an optional Base64-encoded audio recording of the user's voice answer.
 * Null fields are excluded from JSON serialisation via
 * {@link JsonInclude.Include#NON_NULL}.</p>
 *
 * <p>Serialises to the following JSON structure:</p>
 * <pre>{@code
 * {
 *   "question_id": "0a",
 *   "answer_id":   "0a1",
 *   "audio_b64":   "<base64-encoded WAV audio>"  // optional
 * }
 * }</pre>
 *
 * @author Gayan Madusanka
 * @see ClassifyRQ
 * @see AnswerAudioRQ
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AnswerRQ {

    /**
     * Unique identifier of the question being answered.
     */
    @JsonProperty("question_id")
    private String questionId;

    /**
     * Unique identifier of the selected answer option.
     */
    @JsonProperty("answer_id")
    private String answerId;

    /**
     * Optional Base64-encoded WAV audio of the user's voice answer.
     * Excluded from JSON if {@code null}.
     */
    @JsonProperty("audio_b64")
    private String audioB64;

    /**
     * Constructs an {@code AnswerRQ} with a question ID and answer ID.
     *
     * @param questionId unique identifier of the question
     * @param answerId   unique identifier of the selected answer option
     */
    public AnswerRQ(String questionId, String answerId) {
        this.questionId = questionId;
        this.answerId = answerId;
    }

    /**
     * Returns the question identifier.
     *
     * @return question ID string
     */
    public String getQuestionId() {
        return questionId;
    }

    /**
     * Sets the question identifier.
     *
     * @param questionId question ID string
     */
    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    /**
     * Returns the selected answer identifier.
     *
     * @return answer ID string
     */
    public String getAnswerId() {
        return answerId;
    }

    /**
     * Sets the selected answer identifier.
     *
     * @param answerId answer ID string
     */
    public void setAnswerId(String answerId) {
        this.answerId = answerId;
    }

    /**
     * Returns the optional Base64-encoded audio of the voice answer.
     *
     * @return Base64 WAV audio string, or {@code null} if not provided
     */
    public String getAudioB64() {
        return audioB64;
    }

    /**
     * Sets the optional Base64-encoded audio of the voice answer.
     *
     * @param audioB64 Base64 WAV audio string
     */
    public void setAudioB64(String audioB64) {
        this.audioB64 = audioB64;
    }
}
