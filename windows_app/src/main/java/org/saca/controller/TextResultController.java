package org.saca.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;
import org.saca.utility.manager.TTSManager;

import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;

public class TextResultController implements Initializable {

    @FXML
    private SidebarController sidebarController;

    @FXML
    private VBox symptomsBox;

    private List<String> symptoms;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        // Placeholder symptoms shown until setSymptoms() is called
        setSymptoms(List.of(
                "Headache and mild fever",
                "Fatigue and body aches",
                "Sore throat",
                "Runny nose"
        ));
    }

    /**
     * Called by the previous controller (e.g. LoadingController) to
     * populate the detected symptoms list before showing this screen.
     * <p>
     * Example:
     * TextResultController ctrl = loader.getController();
     * ctrl.setSymptoms(List.of("Headache", "Fever", "Cough"));
     */
    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
        symptomsBox.getChildren().clear();

        for (String symptom : symptoms) {
            Label item = new Label("•  " + symptom);
            item.getStyleClass().add("result-symptom-item");
            item.setWrapText(true);
            symptomsBox.getChildren().add(item);
        }
    }

    @FXML
    private void handleSpeak() {
        if (symptoms == null || symptoms.isEmpty()) return;

        String text = String.join(". ", symptoms);

        if (TTSManager.isSpeaking()) {
            // Click again to stop
            TTSManager.stop();
        } else {
            TTSManager.speak(text);
        }
    }

    @FXML
    private void handleYes() {
        TTSManager.stopIfSpeaking();
        System.out.println("User confirmed symptoms");
    }

    @FXML
    private void handleNo() {
        try {
            TTSManager.stopIfSpeaking();

            NavBarManager.setCurrentView("/view/TextInputView.fxml");
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/TextInputView.fxml"),
                    LanguageManager.getBundle()
            );
            sidebarController.getRoot().getScene().setRoot(root);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void handleBack(ActionEvent event) {
        try {
            TTSManager.stopIfSpeaking();

            NavBarManager.setCurrentView("/view/TextInputView.fxml");
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/TextInputView.fxml"),
                    LanguageManager.getBundle()
            );
            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.getScene().setRoot(root);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
