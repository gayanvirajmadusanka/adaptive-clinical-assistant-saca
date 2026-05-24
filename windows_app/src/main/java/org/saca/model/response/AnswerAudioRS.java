package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Response model for a voice answer submission to the SACA API.
 *
 * <p>Returned after the user submits a recorded voice answer to a
 * follow-up question. Contains the recognition result, confidence score,
 * matched answer ID, and an optional Base64-encoded audio response
 * from the API for playback feedback.</p>
 *
 * <p>Example JSON response:</p>
 * <pre>{@code
 * {
 *   "question_id": "0a",
 *   "answer_id":   "today",
 *   "confidence":  0.0,
 *   "recognized":  false,
 *   "message":     "Answer recognised successfully",
 *   "voice_b64":   "<base64-encoded WAV audio>"
 * }
 * }</pre>
 *
 * @author Gayan Madusanka
 * @see org.saca.model.request.AnswerAudioRQ
 */
public class AnswerAudioRS {

    /**
     * Identifier of the question that was answered.
     */
    @JsonProperty("question_id")
    private String questionId;

    /**
     * Identifier of the answer option matched from the voice recording.
     * May be {@code null} if the voice was not recognised.
     */
    @JsonProperty("answer_id")
    private String answerId;

    /**
     * Confidence score of the speech recognition result, between 0.0 and 1.0.
     */
    @JsonProperty("confidence")
    private float confidence;

    /**
     * Indicates whether the voice recording was successfully recognised
     * and matched to a valid answer option.
     */
    @JsonProperty("recognized")
    private boolean recognized;

    /**
     * Human-readable message from the API describing the recognition outcome.
     * Used for display in unrecognised voice popups.
     */
    @JsonProperty("message")
    private String message;

    /**
     * Optional Base64-encoded WAV audio response from the API,
     * played back to the user when the voice is not recognised.
     */
    @JsonProperty("voice_b64")
    private String voiceB64;

    /**
     * Returns the identifier of the question that was answered.
     *
     * @return question ID string
     */
    public String getQuestionId() {
        return questionId;
    }

    /**
     * Sets the identifier of the question that was answered.
     *
     * @param questionId question ID string
     */
    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    /**
     * Returns the matched answer option identifier.
     *
     * @return answer ID string, or {@code null} if not recognised
     */
    public String getAnswerId() {
        return answerId;
    }

    /**
     * Sets the matched answer option identifier.
     *
     * @param answerId answer ID string
     */
    public void setAnswerId(String answerId) {
        this.answerId = answerId;
    }

    /**
     * Returns the confidence score of the speech recognition result.
     *
     * @return confidence value between {@code 0.0} and {@code 1.0}
     */
    public float getConfidence() {
        return confidence;
    }

    /**
     * Sets the confidence score of the speech recognition result.
     *
     * @param confidence confidence value between {@code 0.0} and {@code 1.0}
     */
    public void setConfidence(float confidence) {
        this.confidence = confidence;
    }

    /**
     * Returns whether the voice recording was successfully recognised.
     *
     * @return {@code true} if recognised, {@code false} otherwise
     */
    public boolean isRecognized() {
        return recognized;
    }

    /**
     * Sets whether the voice recording was successfully recognised.
     *
     * @param recognized {@code true} if recognised, {@code false} otherwise
     */
    public void setRecognized(boolean recognized) {
        this.recognized = recognized;
    }

    /**
     * Returns the human-readable message describing the recognition outcome.
     *
     * @return message string from the API
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets the human-readable message describing the recognition outcome.
     *
     * @param message message string
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * Returns the optional Base64-encoded audio response from the API.
     *
     * @return Base64 WAV audio string, or {@code null} if not provided
     */
    public String getVoiceB64() {
        return voiceB64;
    }

    /**
     * Sets the optional Base64-encoded audio response from the API.
     *
     * @param voiceB64 Base64 WAV audio string
     */
    public void setVoiceB64(String voiceB64) {
        this.voiceB64 = voiceB64;
    }
}
