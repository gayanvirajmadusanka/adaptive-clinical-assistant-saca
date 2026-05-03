package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class QuestionsRS {

    @JsonProperty("language")
    private String language;

    @JsonProperty("questions")
    private List<QuestionRS> questions;

    @JsonProperty("voice_b64")
    private String voiceB64;

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public List<QuestionRS> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionRS> q) {
        this.questions = q;
    }

    public String getVoiceB64() {
        return voiceB64;
    }

    public void setVoiceB64(String voiceB64) {
        this.voiceB64 = voiceB64;
    }
}
