package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class QuestionRS {

    @JsonProperty("id")
    private String id;

    @JsonProperty("text")
    private String text;

    @JsonProperty("type")
    private String type;

    @JsonProperty("options")
    private List<OptionRS> options;

    @JsonProperty("voice_b64")
    private String voiceB64;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<OptionRS> getOptions() {
        return options;
    }

    public void setOptions(List<OptionRS> o) {
        this.options = o;
    }

    public String getVoiceB64() {
        return voiceB64;
    }

    public void setVoiceB64(String voiceB64) {
        this.voiceB64 = voiceB64;
    }
}
