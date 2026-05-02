package org.saca.utility.manager;

import org.saca.model.request.AnswerRQ;
import org.saca.model.response.ClassifyRS;
import org.saca.model.response.QuestionsRS;
import org.saca.model.response.TextResultRS;

import java.util.ArrayList;
import java.util.List;

public class CacheManager {

    private static TextResultRS textResultRS = null;

    private static QuestionsRS questionsRS = null;

    private static ClassifyRS classifyRS = null;

    private static String lastSymptomText = "";

    private static List<AnswerRQ> savedAnswers = new ArrayList<>();

    public static TextResultRS getTextResultRS() {
        return textResultRS;
    }

    public static void setTextResultRS(TextResultRS textResultRS) {
        CacheManager.textResultRS = textResultRS;
    }

    public static void clearTextResultRS() {
        textResultRS = null;
    }

    public static QuestionsRS getQuestionsRS() {
        return questionsRS;
    }

    public static void setQuestionsRS(QuestionsRS questionsRS) {
        CacheManager.questionsRS = questionsRS;
    }

    public static void clearQuestionsRS() {
        questionsRS = null;
    }

    public static ClassifyRS getClassifyRS() {
        return classifyRS;
    }

    public static void setClassifyRS(ClassifyRS classifyRS) {
        CacheManager.classifyRS = classifyRS;
    }

    public static void clearClassifyRS() {
        classifyRS = null;
    }

    public static String getLastSymptomText() {
        return lastSymptomText;
    }

    public static void setLastSymptomText(String lastSymptomText) {
        CacheManager.lastSymptomText = lastSymptomText;
    }

    public static List<AnswerRQ> getSavedAnswers() {
        return savedAnswers;
    }

    public static void setSavedAnswers(List<AnswerRQ> savedAnswers) {
        CacheManager.savedAnswers = savedAnswers;
    }

    public static void clearSavedAnswers() {
        savedAnswers = new ArrayList<>();
    }
}
