package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.saca.utility.manager.LanguageManager;

import java.util.List;

public class TextResultRS extends CommonRS {

    @JsonProperty("symptoms_en")
    private List<String> symptomsEn;

    @JsonProperty("symptoms_wp")
    private List<String> symptomsWp;

    @JsonProperty("confidence")
    private double confidence;

    @JsonProperty("input_type")
    private String inputType;

    @JsonProperty("voice_b64")
    private String voiceB64;

    public List<String> getSymptomsEn() {
        return symptomsEn;
    }

    public void setSymptomsEn(List<String> symptomsEn) {
        this.symptomsEn = symptomsEn;
    }

    public List<String> getSymptomsWp() {
        return symptomsWp;
    }

    public void setSymptomsWp(List<String> symptomsWp) {
        this.symptomsWp = symptomsWp;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public String getInputType() {
        return inputType;
    }

    public void setInputType(String inputType) {
        this.inputType = inputType;
    }

    public String getVoiceB64() {
        return voiceB64;
    }

    public void setVoiceB64(String voiceB64) {
        this.voiceB64 = voiceB64;
    }

    /**
     * Returns the correct symptom list based on current app language.
     */
    public List<String> getSymptomsForCurrentLanguage() {
        return LanguageManager.isLanguageEnglish() ? symptomsEn : symptomsWp;
    }
}
