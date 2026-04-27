package org.saca.controller;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.Button;
import javafx.scene.control.TextArea;
import javafx.stage.Stage;
import org.saca.service.ApiService;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;

public class TextInputController implements Initializable {

    @FXML
    private SidebarController sidebarController;
    @FXML
    private Button expandBtn;
    @FXML
    private TextArea symptomInput;

    private Node sceneNode;
    private Stage stage;
    private String lastTypedText = ""; // preserves text when navigating back

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        sceneNode = sidebarController.getRoot();

        // Restore previously typed text if user came back from error
        if (!lastTypedText.isEmpty()) {
            symptomInput.setText(lastTypedText);
            symptomInput.positionCaret(lastTypedText.length());
        }
    }

    /**
     * Called externally to restore typed text when navigating back to this screen.
     * e.g. TextInputController ctrl = loader.getController();
     * ctrl.restoreText("I have a headache");
     */
    public void restoreText(String text) {
        this.lastTypedText = text;
        if (symptomInput != null) {
            symptomInput.setText(text);
            symptomInput.positionCaret(text.length());
        }
    }

    /* ── Continue → show loading → call API → show result ── */
    @FXML
    private void handleContinue() {
        String text = symptomInput.getText().trim();

        if (text.isEmpty()) {
            symptomInput.setPromptText(LanguageManager.get("text_input_empty_prompt"));
            return;
        }

        // Store stage + text BEFORE navigating away
        stage = (Stage) sceneNode.getScene().getWindow();
        lastTypedText = text;

        try {
            NavBarManager.setCurrentView("/view/LoadingView.fxml");

            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/LoadingView.fxml"),
                    LanguageManager.getBundle()
            );
            Parent loadingView = loader.load();
            LoadingController loadingCtrl = loader.getController();

            loadingCtrl.setTitle(LanguageManager.get("loading_symptom_title"));
            loadingCtrl.setDuration(Integer.MAX_VALUE);

            // Call Python API asynchronously
            ApiService.detectSymptoms(
                    text,

                    // ── Success ──
                    symptoms -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        navigateToResult(symptoms);
                    }),

                    // ── API / network error ──
                    errorMsg -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        showErrorAndReturn(
                                "Connection Error",
                                "Could not reach the symptom detection service",
                                errorMsg
                        );
                    })
            );

            stage.getScene().setRoot(loadingView);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /* ── Navigate to TextResultView — validates symptoms first ── */
    private void navigateToResult(List<String> symptoms) {

        // ── Validate: null or empty list ──
        if (symptoms == null || symptoms.isEmpty()) {
            showErrorAndReturn(
                    "No Symptoms Detected",
                    "We could not detect any symptoms from your description",
                    "Please try describing your symptoms in more detail and try again."
            );
            return;
        }

        if (symptoms.size() == 1 &&
                symptoms.get(0).toLowerCase().contains("could not detect")) {
            showErrorAndReturn(
                    "No Symptoms Detected",
                    "We could not identify specific symptoms",
                    symptoms.get(0) + "\n\nPlease try to be more descriptive."
            );
            return;
        }

        try {
            NavBarManager.setCurrentView("/view/TextResultView.fxml");

            FXMLLoader resultLoader = new FXMLLoader(
                    getClass().getResource("/view/TextResultView.fxml"),
                    LanguageManager.getBundle()
            );
            Parent resultView = resultLoader.load();

            TextResultController resultCtrl = resultLoader.getController();
            resultCtrl.setSymptoms(symptoms);

            stage.getScene().setRoot(resultView);

        } catch (IOException e) {
            e.printStackTrace();
            showErrorAndReturn(
                    "Navigation Error",
                    "Could not load the results screen",
                    e.getMessage()
            );
        }
    }

    /**
     * Show an error alert then navigate back to TextInputView
     * with the previously typed text restored.
     */
    private void showErrorAndReturn(String title,
                                    String header,
                                    String content) {

        if (DialogManager.errorDialog(title, header, content)) {
            try {
                NavBarManager.setCurrentView("/view/TextInputView.fxml");

                FXMLLoader loader = new FXMLLoader(
                        getClass().getResource("/view/TextInputView.fxml"),
                        LanguageManager.getBundle()
                );
                Parent root = loader.load();

                TextInputController ctrl = loader.getController();
                ctrl.restoreText(lastTypedText);

                stage.getScene().setRoot(root);

            } catch (IOException e) {
                e.printStackTrace();
            }
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

            Stage s = (Stage) ((Node) event.getSource()).getScene().getWindow();
            s.getScene().setRoot(root);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
