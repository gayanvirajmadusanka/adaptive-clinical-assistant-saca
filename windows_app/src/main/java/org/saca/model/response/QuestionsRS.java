package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class QuestionsRS {

    @JsonProperty("language")
    private String language;

    @JsonProperty("questions")
    private List<QuestionRS> questions;

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
}
