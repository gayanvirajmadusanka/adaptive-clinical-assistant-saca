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

    @JsonProperty("voice_b64_en")
    private String voiceB64En;

    @JsonProperty("voice_b64_wp")
    private String voiceB64Wp;

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

    public String getVoiceB64En() {
        return voiceB64En;
    }

    public void setVoiceB64En(String voiceB64En) {
        this.voiceB64En = voiceB64En;
    }

    public String getVoiceB64Wp() {
        return voiceB64Wp;
    }

    public void setVoiceB64Wp(String voiceB64Wp) {
        this.voiceB64Wp = voiceB64Wp;
    }

    /**
     * Returns the correct symptom list based on current app language.
     */
    public List<String> getSymptomsForCurrentLanguage() {
        return LanguageManager.isLanguageEnglish() ? symptomsEn : symptomsWp;
    }
}
