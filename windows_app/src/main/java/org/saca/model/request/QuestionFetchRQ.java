package org.saca.model.request;

import org.saca.utility.util.CommonUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * Request model for fetching follow-up questions based on detected symptoms.
 *
 * <p>Extends {@link CommonRQ} to inherit the {@code language} field.
 * Sends a list of symptom IDs to the SACA API, which returns relevant
 * follow-up questions for the user to answer.</p>
 *
 * @author Gayan Madusanka
 * @see CommonRQ
 */
public class QuestionFetchRQ extends CommonRQ {

    /**
     * List of detected symptom IDs for which questions are to be fetched.
     */
    private List<String> symptoms;

    /**
     * Returns the list of symptom IDs, initialising to an empty list if null.
     *
     * @return list of symptom ID strings, never {@code null}
     */
    public List<String> getSymptoms() {
        if (CommonUtil.isListEmpty(this.symptoms)) {
            symptoms = new ArrayList<>();
        }
        return symptoms;
    }

    /**
     * Sets the list of symptom IDs.
     *
     * @param symptoms list of symptom ID strings
     */
    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    /**
     * Adds a single symptom ID to the symptoms list.
     *
     * @param symptom symptom ID string to add
     */
    public void addSymptom(String symptom) {
        this.getSymptoms().add(symptom);
    }
}
