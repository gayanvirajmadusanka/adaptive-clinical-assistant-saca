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
import org.saca.model.request.TextInputRQ;
import org.saca.model.response.TextResultRS;
import org.saca.service.ApiService;
import org.saca.utility.manager.CacheManager;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;
import org.saca.utility.util.CommonUtil;

import java.io.IOException;
import java.net.URL;
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

    private String lastTypedText = "";

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        sceneNode = sidebarController.getRoot();
    }

    public void restoreText(String text) {
        this.lastTypedText = text;
        if (symptomInput != null) {
            symptomInput.setText(text);
            symptomInput.positionCaret(text.length());
        }
    }

    @FXML
    private void handleContinue() {
        String text = symptomInput.getText().trim();

        if (text.isEmpty()) {
            symptomInput.setPromptText(LanguageManager.get("text_input_empty_prompt"));
            return;
        }

        stage = (Stage) sceneNode.getScene().getWindow();
        lastTypedText = text;
        CacheManager.setLastSymptomText(text);

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

            TextInputRQ textInputRQ = new TextInputRQ();
            textInputRQ.setText(text);

            ApiService.detectSymptomsText(
                    textInputRQ,

                    result -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        navigateToResult(result);
                    }),

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

    private void navigateToResult(TextResultRS result) {
        if (result == null
                || (CommonUtil.isListEmpty(result.getSymptomsEn())
                && CommonUtil.isListEmpty(result.getSymptomsWp()))) {
            showErrorAndReturn(
                    "No Symptoms Detected",
                    "We could not detect any symptoms from your description",
                    "Please try describing your symptoms in more detail."
            );
            return;
        }

        try {
            NavBarManager.setCurrentView("/view/TextResultView.fxml");
            CacheManager.setTextResultRS(result);

            FXMLLoader resultLoader = new FXMLLoader(
                    getClass().getResource("/view/TextResultView.fxml"),
                    LanguageManager.getBundle()
            );
            Parent resultView = resultLoader.load();

            TextResultController resultCtrl = resultLoader.getController();
            resultCtrl.setSymptomResult(result);

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

    private void showErrorAndReturn(String title, String header, String content) {
        DialogManager.errorDialog(title, header, content);

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
