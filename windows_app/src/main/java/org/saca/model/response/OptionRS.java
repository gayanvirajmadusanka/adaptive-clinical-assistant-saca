package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Represents a single selectable answer option for a follow-up question
 * in the SACA symptom assessment flow.
 *
 * <p>Each option has a unique identifier and a display text label,
 * both returned from the API in the current application language.</p>
 *
 * <p>Example JSON representation:</p>
 * <pre>{@code
 * {
 *   "id":   "0b1",
 *   "text": "Today"
 * }
 * }</pre>
 *
 * @author Gayan Madusanka
 * @see QuestionRS
 */
public class OptionRS {

    /**
     * Unique identifier for this answer option (e.g. {@code "today"}, {@code "yes"}, {@code "no"}).
     */
    @JsonProperty("id")
    private String id;

    /**
     * Display text label shown to the user for this option.
     */
    @JsonProperty("text")
    private String text;

    /**
     * Returns the unique identifier of this answer option.
     *
     * @return option ID string
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the unique identifier of this answer option.
     *
     * @param id option ID string
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Returns the display text label for this answer option.
     *
     * @return display text string
     */
    public String getText() {
        return text;
    }

    /**
     * Sets the display text label for this answer option.
     *
     * @param text display text string
     */
    public void setText(String text) {
        this.text = text;
    }
}
