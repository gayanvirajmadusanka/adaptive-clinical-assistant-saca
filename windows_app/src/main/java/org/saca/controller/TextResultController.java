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
import org.saca.model.response.TextResultRS;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;
import org.saca.utility.manager.TTSManager;

import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;

public class TextResultController implements Initializable {

    @FXML private SidebarController sidebarController;
    @FXML private VBox              symptomsBox;

    private TextResultRS symptomResult;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        TextResultRS saved = NavBarManager.getTextResultRS();
        if (saved != null) {
            setSymptomResult(saved);
        }
    }

    /**
     * Called by TextInputController after loader.load().
     * Also saves to NavBarManager so language reloads can restore it.
     */
    public void setSymptomResult(TextResultRS result) {
        this.symptomResult = result;
        NavBarManager.setTextResultRS(result);
        displaySymptoms(result.getSymptomsForCurrentLanguage());
    }

    private void displaySymptoms(List<String> symptoms) {
        symptomsBox.getChildren().clear();

        if (symptoms == null || symptoms.isEmpty()) return;

        for (String symptom : symptoms) {
            Label item = new Label("•  " + symptom);
            item.getStyleClass().add("result-symptom-item");
            item.setWrapText(true);
            symptomsBox.getChildren().add(item);
        }
    }

    /* ── Speaker ── */
    @FXML
    private void handleSpeak() {
        if (symptomResult == null) return;

        List<String> symptoms = symptomResult.getSymptomsForCurrentLanguage();
        if (symptoms == null || symptoms.isEmpty()) return;

        String text = String.join(". ", symptoms);

        if (TTSManager.isSpeaking()) {
            TTSManager.stop();
        } else {
            TTSManager.speak(text);
        }
    }

    /* ── YES ── */
    @FXML
    private void handleYes() {
        System.out.println("User confirmed symptoms");
        // Navigate to next screen
    }

    /* ── NO → back to TextInput ── */
    @FXML
    private void handleNo() {
        navigateToTextInput(sidebarController.getRoot().getScene());
    }

    /* ── Back ── */
    @FXML
    private void handleBack(ActionEvent event) {
        navigateToTextInput(((Node) event.getSource()).getScene());
    }

    private void navigateToTextInput(javafx.scene.Scene scene) {
        try {
            NavBarManager.setCurrentView("/view/TextInputView.fxml");
            NavBarManager.clearTextResultRS();
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/TextInputView.fxml"),
                    LanguageManager.getBundle()
            );
            scene.setRoot(root);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /* ── Exit ── */
    @FXML
    private void handleExit() {
        if (DialogManager.confirmExit()) System.exit(0);
    }
}
