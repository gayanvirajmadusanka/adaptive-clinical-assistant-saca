package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AnswerRQ {

    @JsonProperty("question_id")
    private String questionId;

    @JsonProperty("answer_id")
    private String answerId;

    public AnswerRQ(String questionId, String answerId) {
        this.questionId = questionId;
        this.answerId = answerId;
    }

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public String getAnswerId() {
        return answerId;
    }

    public void setAnswerId(String answerId) {
        this.answerId = answerId;
    }
}
