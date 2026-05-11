package org.saca.model.body;

import org.saca.utility.manager.LanguageManager;

import java.util.List;

public class BodyPart {
    private final String id;

    private final String labelEn;

    private final String labelWp;

    private final String audioEn;

    private final String audioWp;

    private final List<BodySymptom> symptoms;

    public BodyPart(String id, String labelEn, String labelWp,
                    String audioEn, String audioWp, List<BodySymptom> symptoms) {
        this.id = id;
        this.labelEn = labelEn;
        this.labelWp = labelWp;
        this.audioEn = audioEn;
        this.audioWp = audioWp;
        this.symptoms = symptoms;
    }

    public String getId() {
        return id;
    }

    public String getLabelEn() {
        return labelEn;
    }

    public String getLabelWp() {
        return labelWp;
    }

    public String getAudioEn() {
        return audioEn;
    }

    public String getAudioWp() {
        return audioWp;
    }

    public List<BodySymptom> getSymptoms() {
        return symptoms;
    }

    public String getLabel() {
        return LanguageManager.isLanguageEnglish() ? labelEn : labelWp;
    }

    public String getAudio() {
        return LanguageManager.isLanguageEnglish() ? audioEn : audioWp;
    }
}
