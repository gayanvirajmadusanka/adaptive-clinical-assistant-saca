package org.saca.utility.manager;

import org.saca.model.request.AnswerRQ;
import org.saca.model.response.ClassifyRS;
import org.saca.model.response.QuestionsRS;
import org.saca.model.response.TextResultRS;
import org.saca.model.response.VoiceResultRS;

import java.util.ArrayList;
import java.util.List;

public class CacheManager {

    private static TextResultRS textResultRS = null;

    private static VoiceResultRS voiceResultRS = null;

    private static QuestionsRS questionsRS = null;

    private static ClassifyRS classifyRS = null;

    private static String lastSymptomText = "";

    private static String lastRecordedAudio = "";

    private static List<AnswerRQ> savedAnswers = new ArrayList<>();

    private static List<String> cachedSymptomsEn = new ArrayList<>();

    private static boolean isTextResultLoadFromShow = false;

    private static String cachedBodyPartKey = "";

    private static List<String> cachedBodySymptomIds = new ArrayList<>();

    private static List<String> cachedBodySymptomLabels = new ArrayList<>();

    public static TextResultRS getTextResultRS() {
        return textResultRS;
    }

    public static void setTextResultRS(TextResultRS r) {
        textResultRS = r;
    }

    public static void clearTextResultRS() {
        textResultRS = null;
    }

    public static VoiceResultRS getVoiceResultRS() {
        return voiceResultRS;
    }

    public static void setVoiceResultRS(VoiceResultRS r) {
        voiceResultRS = r;
    }

    public static void clearVoiceResultRS() {
        voiceResultRS = null;
    }

    public static QuestionsRS getQuestionsRS() {
        return questionsRS;
    }

    public static void setQuestionsRS(QuestionsRS q) {
        questionsRS = q;
    }

    public static void clearQuestionsRS() {
        questionsRS = null;
    }

    public static ClassifyRS getClassifyRS() {
        return classifyRS;
    }

    public static void setClassifyRS(ClassifyRS r) {
        classifyRS = r;
    }

    public static void clearClassifyRS() {
        classifyRS = null;
    }

    public static String getLastSymptomText() {
        return lastSymptomText;
    }

    public static void setLastSymptomText(String text) {
        lastSymptomText = text;
    }

    public static String getLastRecordedAudio() {
        return lastRecordedAudio;
    }

    public static void setLastRecordedAudio(String audio) {
        lastRecordedAudio = audio;
    }

    public static List<AnswerRQ> getSavedAnswers() {
        return savedAnswers;
    }

    public static void setSavedAnswers(List<AnswerRQ> answers) {
        savedAnswers = answers;
    }

    public static void clearSavedAnswers() {
        savedAnswers = new ArrayList<>();
    }

    public static List<String> getCachedSymptomsEn() {
        return cachedSymptomsEn;
    }

    public static void setCachedSymptomsEn(List<String> s) {
        cachedSymptomsEn = s != null ? s : new ArrayList<>();
    }

    public static void clearCachedSymptomsEn() {
        cachedSymptomsEn = new ArrayList<>();
    }

    public static boolean isIsTextResultLoadFromShow() {
        return isTextResultLoadFromShow;
    }

    public static void setIsTextResultLoadFromShow(boolean v) {
        isTextResultLoadFromShow = v;
    }

    public static String getCachedBodyPartKey() {
        return cachedBodyPartKey;
    }

    public static void setCachedBodyPartKey(String key) {
        cachedBodyPartKey = key != null ? key : "";
    }

    public static void clearCachedBodyPartKey() {
        cachedBodyPartKey = "";
    }

    public static List<String> getCachedBodySymptomIds() {
        return cachedBodySymptomIds;
    }

    public static void setCachedBodySymptomIds(List<String> ids) {
        cachedBodySymptomIds = ids != null ? ids : new ArrayList<>();
    }

    public static void clearCachedBodySymptomIds() {
        cachedBodySymptomIds = new ArrayList<>();
    }

    public static List<String> getCachedBodySymptomLabels() {
        return cachedBodySymptomLabels;
    }

    public static void setCachedBodySymptomLabels(List<String> labels) {
        cachedBodySymptomLabels = labels != null ? labels : new ArrayList<>();
    }

    public static void clearCachedBodySymptomLabels() {
        cachedBodySymptomLabels = new ArrayList<>();
    }
}
