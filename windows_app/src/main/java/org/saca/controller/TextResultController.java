package org.saca.controller;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import org.saca.model.request.QuestionFetchRQ;
import org.saca.model.response.QuestionsRS;
import org.saca.model.response.TextResultRS;
import org.saca.service.ApiService;
import org.saca.utility.manager.DialogManager;
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

    private TextResultRS symptomResult;

    private Stage stage;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        TextResultRS textResultRS = NavBarManager.getTextResultRS();
        if (textResultRS != null) {
            setSymptomResult(textResultRS);
        }
    }

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

    @FXML
    private void handleYes() {
        if (symptomResult == null) return;

        stage = (Stage) sidebarController.getRoot().getScene().getWindow();

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

            QuestionFetchRQ questionFetchRQ = buildQuestionFetchRQ();

            ApiService.fetchQuestions(
                    questionFetchRQ,

                    questionsRS -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        navigateToTellUsMore(questionsRS);
                    }),

                    errorMsg -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        DialogManager.errorDialog(
                                "Connection Error",
                                "Could not load questions",
                                errorMsg
                        );

                        try {
                            FXMLLoader rl = new FXMLLoader(
                                    getClass().getResource("/view/TextResultView.fxml"),
                                    LanguageManager.getBundle()
                            );
                            Parent rv = rl.load();
                            ((TextResultController) rl.getController())
                                    .setSymptomResult(symptomResult);
                            stage.getScene().setRoot(rv);
                        } catch (Exception ex) {
                            ex.printStackTrace();
                        }
                    })
            );

            stage.getScene().setRoot(loadingView);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void handleNo() {
        navigateToTextInput(sidebarController.getRoot().getScene());
    }

    @FXML
    private void handleBack(ActionEvent event) {
        navigateToTextInput(((Node) event.getSource()).getScene());
    }

    private void navigateToTextInput(Scene scene) {
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

    private void navigateToTellUsMore(QuestionsRS questionsRS) {
        try {
            NavBarManager.setCurrentView("/view/TellUsMoreText.fxml");
            NavBarManager.setQuestionsRS(questionsRS);

            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/TellUsMoreText.fxml"),
                    LanguageManager.getBundle()
            );
            Parent view = loader.load();

            TellUsMoreTextController ctrl = loader.getController();
            ctrl.setQuestions(questionsRS);

            stage.getScene().setRoot(view);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private QuestionFetchRQ buildQuestionFetchRQ() {
        QuestionFetchRQ questionFetchRQ = new QuestionFetchRQ();

        if (LanguageManager.isLanguageEnglish()) {
            questionFetchRQ.setSymptoms(symptomResult.getSymptomsEn());
        } else {
            questionFetchRQ.setSymptoms(symptomResult.getSymptomsWp());
        }

        return questionFetchRQ;
    }
}
