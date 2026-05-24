package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.saca.utility.constant.AppsConstants;
import org.saca.utility.manager.LanguageManager;

/**
 * Base request model inherited by all SACA API request classes.
 *
 * <p>Provides a shared {@code language} field that is automatically
 * resolved from the current application locale, and a utility method
 * to serialise the request to a JSON string.</p>
 *
 * @author Gayan Madusanka
 * @see ClassifyRQ
 * @see TextInputRQ
 * @see QuestionFetchRQ
 */
public class CommonRQ {

    /**
     * Shared Jackson {@link ObjectMapper} instance for JSON serialisation.
     */
    private static final ObjectMapper mapper = new ObjectMapper();

    /**
     * Language code for the request, resolved from the current application locale.
     * Serialised as {@code "language"} in JSON.
     */
    @JsonProperty("language")
    private String language;

    /**
     * Returns the language code for the current application session.
     *
     * <p>Resolved dynamically from the active {@link LanguageManager} locale.
     * Returns {@code "en"} for English or {@code "wp"} for Warlpiri.</p>
     *
     * @return language code string
     */
    public String getLanguage() {
        return LanguageManager.getBundle()
                .getLocale().getLanguage()
                .equals(AppsConstants.AppLanguage.EN.getShortDescription())
                ? AppsConstants.AppLanguage.EN.getShortDescription() : AppsConstants.AppLanguage.WP.getShortDescription();
    }

    /**
     * Sets the language code explicitly, overriding the locale-based resolution.
     *
     * @param language language code (e.g. {@code "en"} or {@code "wp"})
     */
    public void setLanguage(String language) {
        this.language = language;
    }

    /**
     * Serialises this request object to a JSON string.
     *
     * @return JSON representation of this request
     * @throws JsonProcessingException if serialisation fails
     */
    public String toJSON() throws JsonProcessingException {
        return mapper.writeValueAsString(this);
    }
}
