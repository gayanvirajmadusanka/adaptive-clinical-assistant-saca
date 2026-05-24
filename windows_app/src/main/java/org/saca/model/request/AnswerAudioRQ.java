package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Request model for submitting a recorded voice answer to the SACA API.
 *
 * <p>Used when the user answers a follow-up question via voice recording.
 * The audio is encoded as a Base64 string and submitted along with the
 * question identifier and the current application language.</p>
 *
 * <p>Serialises to the following JSON structure:</p>
 * <pre>{@code
 * {
 *   "audio_b64":   "<base64-encoded WAV audio>",
 *   "question_id": "confirm_symptoms",
 *   "language":    "en"
 * }
 * }</pre>
 *
 * @author Gayan Madusanka
 * @see org.saca.service.ApiService
 */
public class AnswerAudioRQ {

    /**
     * Base64-encoded WAV audio data recorded by the user.
     */
    @JsonProperty("audio_b64")
    private String audioB64;

    /**
     * Unique identifier of the question being answered.
     */
    @JsonProperty("question_id")
    private String questionId;

    /**
     * Language code of the current session (e.g. {@code "en"} or {@code "wp"}).
     */
    @JsonProperty("language")
    private String language;

    /**
     * Returns the Base64-encoded audio data.
     *
     * @return Base64 WAV audio string
     */
    public String getAudioB64() {
        return audioB64;
    }

    /**
     * Sets the Base64-encoded audio data.
     *
     * @param audioB64 Base64 WAV audio string
     */
    public void setAudioB64(String audioB64) {
        this.audioB64 = audioB64;
    }

    /**
     * Returns the identifier of the question being answered.
     *
     * @return question ID string
     */
    public String getQuestionId() {
        return questionId;
    }

    /**
     * Sets the identifier of the question being answered.
     *
     * @param questionId question ID string
     */
    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    /**
     * Returns the language code for the current session.
     *
     * @return language code (e.g. {@code "en"} or {@code "wp"})
     */
    public String getLanguage() {
        return language;
    }

    /**
     * Sets the language code for the current session.
     *
     * @param language language code (e.g. {@code "en"} or {@code "wp"})
     */
    public void setLanguage(String language) {
        this.language = language;
    }
}
