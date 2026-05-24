package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Base response model inherited by all SACA API response classes.
 *
 * <p>Provides a shared {@code language} field that identifies the
 * language in which the API response was generated. Subclasses use
 * this to detect language mismatches and trigger re-fetching when
 * the user changes the application language.</p>
 *
 * @author Gayan Madusanka
 * @see TextResultRS
 * @see VoiceResultRS
 * @see QuestionsRS
 * @see ClassifyRS
 */
public class CommonRS {

    /**
     * Language code of the API response (e.g. {@code "en"} or {@code "wp"}).
     */
    @JsonProperty("language")
    private String language;

    /**
     * Returns the language code of the API response.
     *
     * @return language code string (e.g. {@code "en"} or {@code "wp"})
     */
    public String getLanguage() {
        return language;
    }

    /**
     * Sets the language code of the API response.
     *
     * @param language language code string
     */
    public void setLanguage(String language) {
        this.language = language;
    }
}
