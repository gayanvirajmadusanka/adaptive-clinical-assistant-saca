package org.saca.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import org.saca.utility.manager.LanguageManager;

/**
 * Controller for the About screen
 *
 * <p>Handles user interactions on the About view, including
 * navigating back to the Welcome screen.</p>
 *
 * @author Gayan Madusanka
 */
public class AboutController {

    /**
     * Handles the back button click event on the About screen.
     *
     * <p>Loads the {@code WelcomeView.fxml} and sets it as the
     * current scene, effectively navigating the user back to
     * the Welcome screen.</p>
     *
     * @param event the {@link ActionEvent} triggered by the back button
     */
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
