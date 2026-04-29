package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class TextInputRQ extends CommonRQ {
    private static final ObjectMapper mapper = new ObjectMapper();

    @JsonProperty("text")
    private String text;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String toJSON() throws JsonProcessingException {
        return mapper.writeValueAsString(this);
    }
}
