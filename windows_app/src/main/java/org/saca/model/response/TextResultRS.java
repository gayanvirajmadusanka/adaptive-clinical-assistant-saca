package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.saca.utility.manager.LanguageManager;

import java.util.List;

/**
 * Response model for the SACA text-based symptom detection API endpoint.
 *
 * <p>Returned after the user submits a free-text symptom description
 * or body map symptom selection. Contains detected symptom lists in
 * both English and Warlpiri, a confidence score, and optional
 * Base64-encoded audio responses for each language.</p>
 *
 * <p>Extends {@link CommonRS} to inherit the {@code language} field,
 * which is used to detect language mismatches and trigger re-fetching
 * when the user changes the application language.</p>
 *
 * <p>Example JSON response:</p>
 * <pre>{@code
 * {
 *   "language":     "en",
 *   "symptoms_en":  ["Headache", "Fever"],
 *   "symptoms_wp":  ["Walpawalpa", "Rdurrurlpu"],
 *   "confidence":   0.91,
 *   "input_type":   "text",
 *   "voice_b64_en": "<base64-encoded WAV audio>",
 *   "voice_b64_wp": "<base64-encoded WAV audio>"
 * }
 * }</pre>
 *
 * @author Gayan Madusanka
 * @see CommonRS
 * @see org.saca.model.request.TextInputRQ
 * @see org.saca.controller.TextResultController
 */
public class TextResultRS extends CommonRS {

    /**
     * List of detected symptom labels in English.
     */
    @JsonProperty("symptoms_en")
    private List<String> symptomsEn;

    /**
     * List of detected symptom labels in Warlpiri.
     */
    @JsonProperty("symptoms_wp")
    private List<String> symptomsWp;

    /**
     * Confidence score of the symptom detection result, between 0.0 and 1.0.
     */
    @JsonProperty("confidence")
    private double confidence;

    /**
     * Input type indicating how the symptoms were submitted.
     * Typical values: {@code "text"}, {@code "body_map"}.
     */
    @JsonProperty("input_type")
    private String inputType;

    /**
     * Optional Base64-encoded WAV audio of the detected symptoms
     * read aloud in English.
     */
    @JsonProperty("voice_b64_en")
    private String voiceB64En;

    /**
     * Optional Base64-encoded WAV audio of the detected symptoms
     * read aloud in Warlpiri.
     */
    @JsonProperty("voice_b64_wp")
    private String voiceB64Wp;

    /**
     * Returns the list of detected symptom labels in English.
     *
     * @return list of English symptom label strings
     */
    public List<String> getSymptomsEn() {
        return symptomsEn;
    }

    /**
     * Sets the list of detected symptom labels in English.
     *
     * @param symptomsEn list of English symptom label strings
     */
    public void setSymptomsEn(List<String> symptomsEn) {
        this.symptomsEn = symptomsEn;
    }

    /**
     * Returns the list of detected symptom labels in Warlpiri.
     *
     * @return list of Warlpiri symptom label strings
     */
    public List<String> getSymptomsWp() {
        return symptomsWp;
    }

    /**
     * Sets the list of detected symptom labels in Warlpiri.
     *
     * @param symptomsWp list of Warlpiri symptom label strings
     */
    public void setSymptomsWp(List<String> symptomsWp) {
        this.symptomsWp = symptomsWp;
    }

    /**
     * Returns the confidence score of the symptom detection result.
     *
     * @return confidence value between {@code 0.0} and {@code 1.0}
     */
    public double getConfidence() {
        return confidence;
    }

    /**
     * Sets the confidence score of the symptom detection result.
     *
     * @param confidence confidence value between {@code 0.0} and {@code 1.0}
     */
    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    /**
     * Returns the input type indicating how symptoms were submitted.
     *
     * @return input type string (e.g. {@code "text"}, {@code "body_map"})
     */
    public String getInputType() {
        return inputType;
    }

    /**
     * Sets the input type indicating how symptoms were submitted.
     *
     * @param inputType input type string
     */
    public void setInputType(String inputType) {
        this.inputType = inputType;
    }

    /**
     * Returns the optional Base64-encoded English audio of the result.
     *
     * @return Base64 WAV audio string in English, or {@code null} if not provided
     */
    public String getVoiceB64En() {
        return voiceB64En;
    }

    /**
     * Sets the optional Base64-encoded English audio of the result.
     *
     * @param voiceB64En Base64 WAV audio string in English
     */
    public void setVoiceB64En(String voiceB64En) {
        this.voiceB64En = voiceB64En;
    }

    /**
     * Returns the optional Base64-encoded Warlpiri audio of the result.
     *
     * @return Base64 WAV audio string in Warlpiri, or {@code null} if not provided
     */
    public String getVoiceB64Wp() {
        return voiceB64Wp;
    }

    /**
     * Sets the optional Base64-encoded Warlpiri audio of the result.
     *
     * @param voiceB64Wp Base64 WAV audio string in Warlpiri
     */
    public void setVoiceB64Wp(String voiceB64Wp) {
        this.voiceB64Wp = voiceB64Wp;
    }

    /**
     * Returns the symptom list for the current application language.
     *
     * <p>Automatically selects the English or Warlpiri list based on
     * the active language in {@link LanguageManager}.</p>
     *
     * @return English symptom list if the current language is English,
     * Warlpiri symptom list otherwise
     */
    public List<String> getSymptomsForCurrentLanguage() {
        return LanguageManager.isLanguageEnglish() ? symptomsEn : symptomsWp;
    }
}
