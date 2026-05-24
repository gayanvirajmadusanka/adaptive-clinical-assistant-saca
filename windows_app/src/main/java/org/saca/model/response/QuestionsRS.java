package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Response model for the SACA follow-up questions API endpoint.
 *
 * <p>Returned after the user confirms detected symptoms and the application
 * requests follow-up questions for severity assessment. Contains the full
 * list of {@link QuestionRS} questions to be presented to the user,
 * along with the response language and an optional introductory audio.</p>
 *
 * <p>Example JSON response:</p>
 * <pre>{@code
 * {
 *   "language":  "en",
 *   "voice_b64": "<base64-encoded WAV audio>",
 *   "questions": [
 *     {
 *       "id":      "0a1",
 *       "text":    "How long have you had these symptoms?",
 *       "type":    "single_choice",
 *       "options": [{ "id": "today", "text": "Today" }, ...]
 *     }
 *   ]
 * }
 * }</pre>
 *
 * @author Gayan Madusanka
 * @see QuestionRS
 * @see org.saca.model.request.QuestionFetchRQ
 */
public class QuestionsRS {

    /**
     * Language code of the response (e.g. {@code "en"} or {@code "wp"}).
     */
    @JsonProperty("language")
    private String language;

    /**
     * Ordered list of follow-up questions to present to the user.
     */
    @JsonProperty("questions")
    private List<QuestionRS> questions;

    /**
     * Optional Base64-encoded WAV audio introduction played before
     * the first question is shown.
     */
    @JsonProperty("voice_b64")
    private String voiceB64;

    /**
     * Returns the language code of the response.
     *
     * @return language code string (e.g. {@code "en"} or {@code "wp"})
     */
    public String getLanguage() {
        return language;
    }

    /**
     * Sets the language code of the response.
     *
     * @param language language code string
     */
    public void setLanguage(String language) {
        this.language = language;
    }

    /**
     * Returns the ordered list of follow-up questions.
     *
     * @return list of {@link QuestionRS} objects
     */
    public List<QuestionRS> getQuestions() {
        return questions;
    }

    /**
     * Sets the ordered list of follow-up questions.
     *
     * @param q list of {@link QuestionRS} objects
     */
    public void setQuestions(List<QuestionRS> q) {
        this.questions = q;
    }

    /**
     * Returns the optional Base64-encoded introductory audio.
     *
     * @return Base64 WAV audio string, or {@code null} if not provided
     */
    public String getVoiceB64() {
        return voiceB64;
    }

    /**
     * Sets the optional Base64-encoded introductory audio.
     *
     * @param voiceB64 Base64 WAV audio string
     */
    public void setVoiceB64(String voiceB64) {
        this.voiceB64 = voiceB64;
    }
}
