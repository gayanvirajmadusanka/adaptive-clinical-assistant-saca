package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OptionRS {

    @JsonProperty("id")
    private String id;

    @JsonProperty("text")
    private String text;

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
}
