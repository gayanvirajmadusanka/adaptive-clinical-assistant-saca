package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class ClassifyRS {

    @JsonProperty("symptoms")
    private List<String> symptoms;

    @JsonProperty("severity")
    private String severity;

    @JsonProperty("recommendation")
    private String recommendation;

    @JsonProperty("confidence")
    private double confidence;

    @JsonProperty("recommended_action")
    private String recommendedAction;

    @JsonProperty("has_critical")
    private boolean hasCritical;

    @JsonProperty("intensity_signal")
    private int intensitySignal;

    @JsonProperty("age_group")
    private String ageGroup;

    @JsonProperty("gender")
    private String gender;

    @JsonProperty("voice_b64")
    private String voiceB64;

    @JsonProperty("language")
    private String language;

    @JsonProperty("severity_mode")
    private String severityMode;

    public List<String> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String action) {
        this.recommendedAction = action;
    }

    public boolean isHasCritical() {
        return hasCritical;
    }

    public void setHasCritical(boolean hasCritical) {
        this.hasCritical = hasCritical;
    }

    public int getIntensitySignal() {
        return intensitySignal;
    }

    public void setIntensitySignal(int intensitySignal) {
        this.intensitySignal = intensitySignal;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getVoiceB64() {
        return voiceB64;
    }

    public void setVoiceB64(String voiceB64) {
        this.voiceB64 = voiceB64;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getSeverityMode() {
        return severityMode;
    }

    public void setSeverityMode(String severityMode) {
        this.severityMode = severityMode;
    }
}
