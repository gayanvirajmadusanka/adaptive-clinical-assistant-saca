package org.saca.model.request;

import org.saca.utility.util.CommonUtil;

import java.util.ArrayList;
import java.util.List;

public class QuestionFetchRQ extends CommonRQ {

    private List<String> symptoms;

    public List<String> getSymptoms() {
        if (CommonUtil.isListEmpty(this.symptoms)) {
            symptoms = new ArrayList<>();
        }
        return symptoms;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    public void addSymptom(String symptom) {
        this.getSymptoms().add(symptom);
    }
}
