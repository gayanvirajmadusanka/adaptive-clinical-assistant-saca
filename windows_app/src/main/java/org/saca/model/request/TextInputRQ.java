package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Request model for submitting free-text symptom descriptions
 * to the SACA symptom detection API endpoint.
 *
 * <p>Extends {@link CommonRQ} to inherit the {@code language} field.
 * The user's typed symptom description is sent as plain text for
 * natural language processing and symptom extraction.</p>
 *
 * <p>Serialises to the following JSON structure:</p>
 * <pre>{@code
 * {
 *   "language": "en",
 *   "text":     "I have a headache and fever"
 * }
 * }</pre>
 *
 * @author Gayan Madusanka
 * @see CommonRQ
 */
public class TextInputRQ extends CommonRQ {

    /**
     * Free-text symptom description entered by the user.
     */
    @JsonProperty("text")
    private String text;

    /**
     * Returns the free-text symptom description.
     *
     * @return symptom description string
     */
    public String getText() {
        return text;
    }

    /**
     * Sets the free-text symptom description.
     *
     * @param text symptom description string
     */
    public void setText(String text) {
        this.text = text;
    }
}
