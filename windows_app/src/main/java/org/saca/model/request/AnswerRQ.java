package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AnswerRQ {

    @JsonProperty("question_id")
    private String questionId;

    @JsonProperty("answer_id")
    private String answerId;

    @JsonProperty("audio_b64")
    private String audioB64;

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

    public String getAudioB64() {
        return audioB64;
    }

    public void setAudioB64(String audioB64) {
        this.audioB64 = audioB64;
    }
}
