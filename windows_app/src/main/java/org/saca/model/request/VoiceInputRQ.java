package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class VoiceInputRQ {

    @JsonProperty("audio_b64")
    private String audioB64;

    @JsonProperty("language")
    private String language;

    public String getAudioB64() {
        return audioB64;
    }

    public void setAudioB64(String audioB64) {
        this.audioB64 = audioB64;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
