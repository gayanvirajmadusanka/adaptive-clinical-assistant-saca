package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CommonRS {

    @JsonProperty("language")
    private String language;

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
