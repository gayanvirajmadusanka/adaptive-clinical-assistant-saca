package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Response model for the SACA symptom classification API endpoint.
 *
 * <p>Returned after the user's symptoms and follow-up answers are submitted
 * for severity classification. Contains the severity level, recommendations,
 * confidence score, and an optional Base64-encoded audio response for
 * text-to-speech playback of the result.</p>
 *
 * <p>Example JSON response:</p>
 * <pre>{@code
 * {
 *   "symptoms":          ["headache", "fever"],
 *   "severity":          "Moderate",
 *   "severity_mode":     "moderate",
 *   "recommendation":    "Doctor Consultation",
 *   "recommended_action":"Please visit the clinic or health worker today.",
 *   "confidence":        0.87,
 *   "has_critical":      false,
 *   "intensity_signal":  2,
 *   "age_group":         "adult",
 *   "gender":            "male",
 *   "language":          "en",
 *   "voice_b64":         "<base64-encoded WAV audio>"
 * }
 * }</pre>
 *
 * @author Gayan Madusanka
 * @see org.saca.model.request.ClassifyRQ
 * @see org.saca.controller.FinalResultController
 */
public class ClassifyRS {

    /**
     * List of symptom IDs that were classified.
     */
    @JsonProperty("symptoms")
    private List<String> symptoms;

    /**
     * Human-readable severity label (e.g. {@code "Mild"}, {@code "Moderate"}, {@code "Severe"}).
     */
    @JsonProperty("severity")
    private String severity;

    /**
     * Recommended action category (e.g. {@code "Doctor Consultation"}, {@code "OTC Drug"}).
     */
    @JsonProperty("recommendation")
    private String recommendation;

    /**
     * Confidence score of the classification result, between 0.0 and 1.0.
     */
    @JsonProperty("confidence")
    private double confidence;

    /**
     * Detailed recommended action text displayed on the Final Result screen.
     */
    @JsonProperty("recommended_action")
    private String recommendedAction;

    /**
     * Indicates whether any critical symptoms were detected.
     * When {@code true} and severity is severe, the Call for Help button is shown.
     */
    @JsonProperty("has_critical")
    private boolean hasCritical;

    /**
     * Numeric intensity signal used internally to indicate symptom severity strength.
     */
    @JsonProperty("intensity_signal")
    private int intensitySignal;

    /**
     * Age group context used during classification (e.g. {@code "adult"}, {@code "child"}).
     */
    @JsonProperty("age_group")
    private String ageGroup;

    /**
     * Gender context used during classification (e.g. {@code "male"}, {@code "female"}).
     */
    @JsonProperty("gender")
    private String gender;

    /**
     * Optional Base64-encoded WAV audio of the classification result,
     * played back to the user on the Final Result screen.
     */
    @JsonProperty("voice_b64")
    private String voiceB64;

    /**
     * Language code of the response (e.g. {@code "en"} or {@code "wp"}).
     */
    @JsonProperty("language")
    private String language;

    /**
     * Machine-readable severity mode used to apply UI themes.
     * One of {@code "mild"}, {@code "moderate"}, or {@code "severe"}.
     */
    @JsonProperty("severity_mode")
    private String severityMode;

    /**
     * Returns the list of classified symptom IDs.
     *
     * @return list of symptom ID strings
     */
    public List<String> getSymptoms() {
        return symptoms;
    }

    /**
     * Sets the list of classified symptom IDs.
     *
     * @param symptoms list of symptom ID strings
     */
    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    /**
     * Returns the human-readable severity label.
     *
     * @return severity label string
     */
    public String getSeverity() {
        return severity;
    }

    /**
     * Sets the human-readable severity label.
     *
     * @param severity severity label string
     */
    public void setSeverity(String severity) {
        this.severity = severity;
    }

    /**
     * Returns the recommended action category.
     *
     * @return recommendation string
     */
    public String getRecommendation() {
        return recommendation;
    }

    /**
     * Sets the recommended action category.
     *
     * @param recommendation recommendation string
     */
    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    /**
     * Returns the confidence score of the classification result.
     *
     * @return confidence value between {@code 0.0} and {@code 1.0}
     */
    public double getConfidence() {
        return confidence;
    }

    /**
     * Sets the confidence score of the classification result.
     *
     * @param confidence confidence value between {@code 0.0} and {@code 1.0}
     */
    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    /**
     * Returns the detailed recommended action text.
     *
     * @return recommended action string
     */
    public String getRecommendedAction() {
        return recommendedAction;
    }

    /**
     * Sets the detailed recommended action text.
     *
     * @param action recommended action string
     */
    public void setRecommendedAction(String action) {
        this.recommendedAction = action;
    }

    /**
     * Returns whether any critical symptoms were detected.
     *
     * @return {@code true} if critical symptoms are present, {@code false} otherwise
     */
    public boolean isHasCritical() {
        return hasCritical;
    }

    /**
     * Sets whether any critical symptoms were detected.
     *
     * @param hasCritical {@code true} if critical symptoms are present
     */
    public void setHasCritical(boolean hasCritical) {
        this.hasCritical = hasCritical;
    }

    /**
     * Returns the numeric intensity signal of the classification.
     *
     * @return intensity signal integer
     */
    public int getIntensitySignal() {
        return intensitySignal;
    }

    /**
     * Sets the numeric intensity signal of the classification.
     *
     * @param intensitySignal intensity signal integer
     */
    public void setIntensitySignal(int intensitySignal) {
        this.intensitySignal = intensitySignal;
    }

    /**
     * Returns the age group context used during classification.
     *
     * @return age group string
     */
    public String getAgeGroup() {
        return ageGroup;
    }

    /**
     * Sets the age group context used during classification.
     *
     * @param ageGroup age group string
     */
    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    /**
     * Returns the gender context used during classification.
     *
     * @return gender string
     */
    public String getGender() {
        return gender;
    }

    /**
     * Sets the gender context used during classification.
     *
     * @param gender gender string
     */
    public void setGender(String gender) {
        this.gender = gender;
    }

    /**
     * Returns the optional Base64-encoded audio of the classification result.
     *
     * @return Base64 WAV audio string, or {@code null} if not provided
     */
    public String getVoiceB64() {
        return voiceB64;
    }

    /**
     * Sets the optional Base64-encoded audio of the classification result.
     *
     * @param voiceB64 Base64 WAV audio string
     */
    public void setVoiceB64(String voiceB64) {
        this.voiceB64 = voiceB64;
    }

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
     * Returns the machine-readable severity mode used for UI theming.
     *
     * @return severity mode string — one of {@code "mild"}, {@code "moderate"}, or {@code "severe"}
     */
    public String getSeverityMode() {
        return severityMode;
    }

    /**
     * Sets the machine-readable severity mode used for UI theming.
     *
     * @param severityMode severity mode string
     */
    public void setSeverityMode(String severityMode) {
        this.severityMode = severityMode;
    }
}
