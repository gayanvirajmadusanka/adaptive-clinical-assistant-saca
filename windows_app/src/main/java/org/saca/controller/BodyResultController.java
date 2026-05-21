package org.saca.controller;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.Tooltip;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import org.saca.model.body.BodyPart;
import org.saca.model.body.BodyPartsData;
import org.saca.model.request.QuestionFetchRQ;
import org.saca.model.request.TextInputRQ;
import org.saca.model.response.QuestionsRS;
import org.saca.model.response.TextResultRS;
import org.saca.service.ApiService;
import org.saca.service.AudioService;
import org.saca.utility.constant.AppsConstants;
import org.saca.utility.manager.CacheManager;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;

import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;

public class BodyResultController implements Initializable {

    @FXML
    private SidebarController sidebarController;

    @FXML
    private VBox symptomsBox;

    @FXML
    private Button speakerBtn;

    @FXML
    private ImageView speakerIcon;

    @FXML
    private VBox yesCard;

    @FXML
    private VBox noCard;

    private TextResultRS symptomResult;

    private Stage stage;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        Tooltip.install(yesCard, new Tooltip(LanguageManager.get("result_yes")));
        Tooltip.install(noCard, new Tooltip(LanguageManager.get("result_no")));

        TextResultRS saved = CacheManager.getTextResultRS();
        if (saved == null) return;

        String savedLang = saved.getLanguage();
        String currentLang = LanguageManager.isLanguageEnglish()
                ? AppsConstants.AppLanguage.EN.getShortDescription()
                : AppsConstants.AppLanguage.WP.getShortDescription();

        if (savedLang != null && !savedLang.equals(currentLang)) {
            reFetchSymptoms();
        } else {
            setSymptomResult(saved);
        }
    }

    public void setSymptomResult(TextResultRS result) {
        this.symptomResult = result;
        CacheManager.setTextResultRS(result);
        if (result.getSymptomsEn() != null && !result.getSymptomsEn().isEmpty()) {
            CacheManager.setCachedSymptomsEn(result.getSymptomsEn());
        }
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

    private void reFetchSymptoms() {
        Label loading = new Label(LanguageManager.get("loading_symptom_title"));
        loading.getStyleClass().add("result-symptom-item");
        symptomsBox.getChildren().setAll(loading);

        String symptomText = String.join(", ", CacheManager.getCachedBodySymptomLabels());
        if (symptomText.isBlank()) {
            TextResultRS cached = CacheManager.getTextResultRS();
            if (cached != null) setSymptomResult(cached);
            return;
        }

        TextInputRQ rq = new TextInputRQ();
        rq.setText(symptomText);

        ApiService.detectSymptomsText(
                rq,
                result -> Platform.runLater(() -> setSymptomResult(result)),
                errorMsg -> Platform.runLater(() -> {
                    TextResultRS cached = CacheManager.getTextResultRS();
                    if (cached != null) setSymptomResult(cached);
                    else DialogManager.errorDialog("Connection Error",
                            "Could not reload symptoms", errorMsg);
                })
        );
    }

    @FXML
    private void handleSpeak() {
        if (symptomResult == null) return;

        if (AudioService.isPlaying()) {
            AudioService.stop();
            resetSpeakerIcon();
            return;
        }

        String voiceB64 = LanguageManager.isLanguageEnglish()
                ? symptomResult.getVoiceB64En()
                : symptomResult.getVoiceB64Wp();

        if (voiceB64 == null || voiceB64.isBlank()) return;

        setSpeakerStopIcon();
        AudioService.playBase64Wav(
                voiceB64,
                err -> Platform.runLater(this::resetSpeakerIcon),
                () -> Platform.runLater(this::resetSpeakerIcon)
        );
    }

    @FXML
    private void handleYes() {
        AudioService.stop();
        resetSpeakerIcon();
        if (symptomResult == null) return;

        stage = (Stage) sidebarController.getRoot().getScene().getWindow();

        try {
            NavBarManager.setCurrentView("/view/LoadingView.fxml");
            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/LoadingView.fxml"),
                    LanguageManager.getBundle());
            Parent loadingView = loader.load();
            LoadingController loadingCtrl = loader.getController();
            loadingCtrl.setTitle(LanguageManager.get("loading_symptom_title"));
            loadingCtrl.setDuration(Integer.MAX_VALUE);

            QuestionFetchRQ rq = new QuestionFetchRQ();
            rq.setSymptoms(symptomResult.getSymptomsEn());

            ApiService.fetchQuestions(
                    rq,
                    questionsRS -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        navigateToTellUsMore(questionsRS);
                    }),
                    errorMsg -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        DialogManager.errorDialog("Connection Error",
                                "Could not load questions", errorMsg);
                        try {
                            FXMLLoader rl = new FXMLLoader(
                                    getClass().getResource("/view/BodyResultView.fxml"),
                                    LanguageManager.getBundle());
                            Parent rv = rl.load();
                            ((BodyResultController) rl.getController())
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
        AudioService.stop();
        navigateBackToSymptoms(sidebarController.getRoot().getScene());
    }

    @FXML
    private void handleBack(ActionEvent event) {
        AudioService.stop();
        navigateBackToSymptoms(((Node) event.getSource()).getScene());
    }

    private void navigateBackToSymptoms(Scene scene) {
        try {
            String partKey = CacheManager.getCachedBodyPartKey();
            BodyPart part = partKey != null ? BodyPartsData.get(partKey) : null;

            CacheManager.setIsTextResultLoadFromShow(false);
            NavBarManager.setCurrentView("/view/BodySymptomsView.fxml");

            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/BodySymptomsView.fxml"),
                    LanguageManager.getBundle());
            Parent root = loader.load();
            if (part != null) {
                ((BodySymptomsController) loader.getController()).setPart(part);
            }
            scene.setRoot(root);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void navigateToTellUsMore(QuestionsRS questionsRS) {
        try {
            NavBarManager.setCurrentView("/view/TellUsMoreBodyView.fxml");
            CacheManager.setQuestionsRS(questionsRS);

            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/TellUsMoreBodyView.fxml"),
                    LanguageManager.getBundle());
            Parent view = loader.load();
            ((TellUsMoreBodyController) loader.getController()).setQuestions(questionsRS);
            stage.getScene().setRoot(view);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void setSpeakerStopIcon() {
        speakerIcon.setImage(new Image(
                getClass().getResource("/icons/mute.png").toExternalForm()));
    }

    private void resetSpeakerIcon() {
        speakerIcon.setImage(new Image(
                getClass().getResource("/icons/speaker.png").toExternalForm()));
    }
}
