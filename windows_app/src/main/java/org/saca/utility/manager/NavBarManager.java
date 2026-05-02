package org.saca.utility.manager;

import org.saca.utility.constant.AppsConstants;

public class NavBarManager {

    private static AppsConstants.YesNo isNavBarVisible = AppsConstants.YesNo.N;

    private static String currentView = "/view/DashboardView.fxml";

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
}
