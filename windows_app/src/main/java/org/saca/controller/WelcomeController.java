package org.saca.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.Button;
import javafx.stage.Stage;

public class WelcomeController {

    public Button aboutButton;

    public void handleAboutClick(ActionEvent event) {
        try {
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/AboutView.fxml")
            );

            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();

            // Keep same scene size
            stage.getScene().setRoot(root);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void handleStartClick(ActionEvent event) {
        try {
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/SelectLanguageView.fxml")
            );

            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();

            // Keep same scene size
            stage.getScene().setRoot(root);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
