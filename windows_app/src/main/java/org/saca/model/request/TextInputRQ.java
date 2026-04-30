package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TextInputRQ extends CommonRQ {

    @JsonProperty("text")
    private String text;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
