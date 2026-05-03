package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class ClassifyRQ extends CommonRQ {

    @JsonProperty("symptoms")
    private List<String> symptoms;

    @JsonProperty("answers")
    private List<AnswerRQ> answers;

    public List<String> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    public List<AnswerRQ> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerRQ> answers) {
        this.answers = answers;
    }
}

