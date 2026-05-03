package org.saca.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AnswerAudioRS {

    @JsonProperty("question_id")
    private String questionId;

    @JsonProperty("answer_id")
    private String answerId;

    @JsonProperty("confidence")
    private float confidence;

    @JsonProperty("recognized")
    private boolean recognized;

    @JsonProperty("message")
    private String message;

    @JsonProperty("voice_b64")
    private String voiceB64;

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

    public float getConfidence() {
        return confidence;
    }

    public void setConfidence(float confidence) {
        this.confidence = confidence;
    }

    public boolean isRecognized() {
        return recognized;
    }

    public void setRecognized(boolean recognized) {
        this.recognized = recognized;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getVoiceB64() {
        return voiceB64;
    }

    public void setVoiceB64(String voiceB64) {
        this.voiceB64 = voiceB64;
    }
}
