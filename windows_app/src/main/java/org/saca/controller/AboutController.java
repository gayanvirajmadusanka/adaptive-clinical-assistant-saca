package org.saca.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import org.saca.utility.manager.LanguageManager;

public class AboutController {

    public void handleBackClick(ActionEvent event) {
        try {
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/WelcomeView.fxml"),
                    LanguageManager.getBundle()
            );

            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.setScene(new Scene(root));

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
