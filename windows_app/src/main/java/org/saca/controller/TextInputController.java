package org.saca.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.TextArea;
import javafx.stage.Stage;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;

import java.io.IOException;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

public class TextInputController implements Initializable {

    @FXML
    private SidebarController sidebarController;

    @FXML
    private TextArea symptomInput;

    private Node sceneNode;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        sceneNode = sidebarController.getRoot();
    }

    @FXML
    private void handleContinue() {
        String text = symptomInput.getText().trim();

        if (text.isEmpty()) {
            symptomInput.setPromptText(
                    LanguageManager.get("text_input_empty_prompt"));
            return;
        }

        try {
            NavBarManager.setCurrentView("/view/LoadingView.fxml");

            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/LoadingView.fxml"),
                    LanguageManager.getBundle()
            );
            Parent loadingView = loader.load();
            LoadingController loadingCtrl = loader.getController();

            loadingCtrl.setTitle(LanguageManager.get("loading_symptom_title"));
//            loadingCtrl.setDuration(3000); FIXME This should load with API call
            loadingCtrl.setDuration(3);

            loadingCtrl.setOnComplete(() -> {
                try {
                    NavBarManager.setCurrentView("/view/TextResultView.fxml");

                    FXMLLoader resultLoader = new FXMLLoader(
                            getClass().getResource("/view/TextResultView.fxml"),
                            LanguageManager.getBundle()
                    );
                    Parent resultView = resultLoader.load();

                    TextResultController resultCtrl = resultLoader.getController();
                    resultCtrl.setSymptoms(parseSymptoms(text));

                    loadingCtrl.getCanvas().getScene().setRoot(resultView);

                } catch (IOException e) {
                    e.printStackTrace();
                }
            });

            sceneNode.getScene().setRoot(loadingView);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void handleBack(ActionEvent event) {
        try {
            NavBarManager.setCurrentView("/view/DashboardView.fxml");
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

    private List<String> parseSymptoms(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of(LanguageManager.get("result_no_symptoms"));
        }

        // Multi-line input → split by line
        String[] lines = raw.split("\\r?\\n");
        if (lines.length > 1) {
            return Arrays.stream(lines)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        }

        String[] sentences = raw.split("\\.\\s+");
        if (sentences.length > 1) {
            return Arrays.stream(sentences)
                    .map(s -> s.trim().replaceAll("\\.$", ""))
                    .filter(s -> !s.isEmpty())
                    .toList();
        }

        return List.of(raw.trim());
    }
}
