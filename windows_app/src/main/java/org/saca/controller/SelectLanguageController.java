package org.saca.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.stage.Stage;
import org.saca.utility.constant.AppsConstants;
import org.saca.utility.manager.LanguageManager;

public class SelectLanguageController {

    public void handleEnglishClick(ActionEvent event) {
        try {
            LanguageManager.setLanguage(AppsConstants.AppLanguage.EN.getShortDescription());

            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/DashboardView.fxml"),
                    LanguageManager.getBundle()
            );

            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.getScene().setRoot(root);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void handleWarlpiriClick(ActionEvent event) {
        try {
            LanguageManager.setLanguage(AppsConstants.AppLanguage.WP.getShortDescription());

            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/DashboardView.fxml"),
                    LanguageManager.getBundle()
            );

            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.getScene().setRoot(root);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
