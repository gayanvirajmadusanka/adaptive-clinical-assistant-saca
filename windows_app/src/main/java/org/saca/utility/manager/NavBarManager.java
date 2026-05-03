package org.saca.utility.manager;

import org.saca.model.response.QuestionsRS;
import org.saca.model.response.TextResultRS;
import org.saca.utility.constant.AppsConstants;

public class NavBarManager {

    private static AppsConstants.YesNo isNavBarVisible = AppsConstants.YesNo.Y;

    private static String currentView = "/view/DashboardView.fxml";

    private static TextResultRS textResultRS;

    private static QuestionsRS questionsRS;

    public static AppsConstants.YesNo getIsNavBarVisible() {
        return isNavBarVisible;
    }

    public static void setIsNavBarVisible(AppsConstants.YesNo value) {
        isNavBarVisible = value;
    }

    public static String getCurrentView() {
        return currentView;
    }

    public static void setCurrentView(String fxmlPath) {
        currentView = fxmlPath;
    }

    public static TextResultRS getTextResultRS() {
        return textResultRS;
    }

    public static void setTextResultRS(TextResultRS textResultRS) {
        NavBarManager.textResultRS = textResultRS;
    }

    public static void clearTextResultRS() {
        textResultRS = null;
    }

    public static QuestionsRS getQuestionsRS() {
        return questionsRS;
    }

    public static void setQuestionsRS(QuestionsRS questionsRS) {
        NavBarManager.questionsRS = questionsRS;
    }
}
