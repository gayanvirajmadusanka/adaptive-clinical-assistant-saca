package org.saca.controller;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.input.MouseEvent;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class DashboardController implements Initializable {

    @FXML
    private SidebarController sidebarController;

    private Node sceneNode;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        sceneNode = sidebarController.getRoot();
    }

    @FXML
    private void handleTextCardClick(MouseEvent event) {
        try {
            NavBarManager.setCurrentView("/view/TextInputView.fxml"); // ← add this

            Parent textInputView = FXMLLoader.load(
                    getClass().getResource("/view/TextInputView.fxml"),
                    LanguageManager.getBundle()
            );
            sceneNode.getScene().setRoot(textInputView);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @FXML
    public void handleVoiceCardClick(MouseEvent mouseEvent) {
        System.out.println("Voice card clicked");
    }

    @FXML
    public void handleBodyCardClick(MouseEvent mouseEvent) {
        System.out.println("Body card clicked");
    }
}
