package org.saca.model.body;

import org.saca.utility.manager.LanguageManager;

public class BodySymptom {

    private final String id;

    private final String labelEn;

    private final String labelWp;

    private final String audioEn;

    private final String audioWp;

    public BodySymptom(String id, String labelEn, String labelWp,
                       String audioEn, String audioWp) {
        this.id = id;
        this.labelEn = labelEn;
        this.labelWp = labelWp;
        this.audioEn = audioEn;
        this.audioWp = audioWp;
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

    public String getLabel() {
        return LanguageManager.isLanguageEnglish() ? labelEn : labelWp;
    }

    public String getAudio() {
        return LanguageManager.isLanguageEnglish() ? audioEn : audioWp;
    }
}
