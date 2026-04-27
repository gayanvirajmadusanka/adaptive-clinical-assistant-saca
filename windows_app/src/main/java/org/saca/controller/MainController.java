package org.saca.controller;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.layout.StackPane;
import org.saca.utility.manager.LanguageManager;

public class MainController {

    @FXML
    private StackPane contentArea;

    @FXML
    public void initialize() {
        // Load Dashboard first when app starts
        loadView("WelcomeView.fxml");

//        loadView("DashboardView.fxml"); // TODO Remove after testing
//        loadView("TextInputView.fxml"); // TODO Remove after testing
    }

    private void loadView(String fxml) {
        try {
            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/" + fxml),
                    LanguageManager.getBundle()   // TODO Remove after testing
            );

            Node view = loader.load();

            // Make it fill the space
            view.setStyle("-fx-max-width: Infinity; -fx-max-height: Infinity;");

            contentArea.getChildren().setAll(view);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
