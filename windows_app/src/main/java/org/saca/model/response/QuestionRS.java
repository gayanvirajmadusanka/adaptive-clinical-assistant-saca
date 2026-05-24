package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Represents a single follow-up question returned by the SACA API
 * during the symptom assessment flow.
 *
 * <p>Each question has a unique identifier, display text, a type
 * indicating the expected answer format, a list of selectable
 * {@link OptionRS} answer options, and an optional Base64-encoded
 * audio for text-to-speech playback of the question.</p>
 *
 * <p>Example JSON representation:</p>
 * <pre>{@code
 * {
 *   "id":       "pain_duration",
 *   "text":     "How long have you had these symptoms?",
 *   "type":     "single_choice",
 *   "options":  [{ "id": "0a1", "text": "Today" }, ...],
 *   "voice_b64":"<base64-encoded WAV audio>"
 * }
 * }</pre>
 *
 * <p>Supported question types include:</p>
 * <ul>
 *   <li>{@code "single_choice"} — user selects one option from a list</li>
 *   <li>{@code "yes_no"} — user selects Yes or No, displayed as image cards</li>
 * </ul>
 *
 * @author Gayan Madusanka
 * @see OptionRS
 * @see QuestionsRS
 */
public class QuestionRS {

    /**
     * Unique identifier for this question (e.g. {@code "pain_duration"}, {@code "confirm_symptoms"}).
     */
    @JsonProperty("id")
    private String id;

    /**
     * Display text of the question shown to the user.
     */
    @JsonProperty("text")
    private String text;

    /**
     * Question type determining the UI presentation.
     * Common values: {@code "single_choice"}, {@code "yes_no"}.
     */
    @JsonProperty("type")
    private String type;

    /**
     * List of selectable answer options for this question.
     */
    @JsonProperty("options")
    private List<OptionRS> options;

    /**
     * Optional Base64-encoded WAV audio of the question text,
     * auto-played when the question is displayed.
     */
    @JsonProperty("voice_b64")
    private String voiceB64;

    /**
     * Returns the unique identifier of this question.
     *
     * @return question ID string
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the unique identifier of this question.
     *
     * @param id question ID string
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Returns the display text of the question.
     *
     * @return question text string
     */
    public String getText() {
        return text;
    }

    /**
     * Sets the display text of the question.
     *
     * @param text question text string
     */
    public void setText(String text) {
        this.text = text;
    }

    /**
     * Returns the question type determining the UI presentation.
     *
     * @return question type string (e.g. {@code "single_choice"}, {@code "yes_no"})
     */
    public String getType() {
        return type;
    }

    /**
     * Sets the question type determining the UI presentation.
     *
     * @param type question type string
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * Returns the list of selectable answer options.
     *
     * @return list of {@link OptionRS} objects
     */
    public List<OptionRS> getOptions() {
        return options;
    }

    /**
     * Sets the list of selectable answer options.
     *
     * @param o list of {@link OptionRS} objects
     */
    public void setOptions(List<OptionRS> o) {
        this.options = o;
    }

    /**
     * Returns the optional Base64-encoded audio of the question text.
     *
     * @return Base64 WAV audio string, or {@code null} if not provided
     */
    public String getVoiceB64() {
        return voiceB64;
    }

    /**
     * Sets the optional Base64-encoded audio of the question text.
     *
     * @param voiceB64 Base64 WAV audio string
     */
    public void setVoiceB64(String voiceB64) {
        this.voiceB64 = voiceB64;
    }
}
