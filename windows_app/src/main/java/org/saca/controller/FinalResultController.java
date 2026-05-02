package org.saca.controller;

import javafx.animation.KeyFrame;
import javafx.animation.KeyValue;
import javafx.animation.Timeline;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.util.Duration;
import org.saca.model.request.ClassifyRQ;
import org.saca.model.response.ClassifyRS;
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

public class FinalResultController implements Initializable {

    @FXML
    private SidebarController sidebarController;

    @FXML
    private StackPane bgPane;

    @FXML
    private Label severityLabel;

    @FXML
    private Button callBtn;

    @FXML
    private Label recommendationLabel;

    @FXML
    private Label recommendedActionLabel;

    @FXML
    private VBox symptomsBox;

    @FXML
    private Button recSpeakerBtn;

    @FXML
    private ImageView recSpeakerIcon;

    private ClassifyRS result;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        ClassifyRS cached = CacheManager.getClassifyRS();
        if (cached == null) return;

        String savedLang = cached.getLanguage() != null ? cached.getLanguage() : "";
        String currentLang = LanguageManager.isLanguageEnglish()
                ? AppsConstants.AppLanguage.EN.getShortDescription()
                : AppsConstants.AppLanguage.WP.getShortDescription();

        if (!savedLang.isEmpty() && !savedLang.equalsIgnoreCase(currentLang)) {
            reFetchClassify(cached);
        } else {
            setResult(cached);
        }
    }

    public void setResult(ClassifyRS result) {
        this.result = result;
        CacheManager.setClassifyRS(result);
        renderResult(result);
    }

    private void reFetchClassify(ClassifyRS cached) {
        symptomsBox.getChildren().clear();
        Label loading = new Label(LanguageManager.get("loading_symptom_title"));
        loading.getStyleClass().add("symptom-item");
        symptomsBox.getChildren().add(loading);

        TextResultRS textResult = CacheManager.getTextResultRS();
        ClassifyRQ classifyRQ = new ClassifyRQ();
        classifyRQ.setSymptoms(textResult.getSymptomsEn());
        classifyRQ.setAnswers(CacheManager.getSavedAnswers());
        classifyRQ.setLanguage(LanguageManager.isLanguageEnglish()
                ? AppsConstants.AppLanguage.EN.getShortDescription()
                : AppsConstants.AppLanguage.WP.getShortDescription());

        ApiService.classify(
                classifyRQ,
                classifyRS -> Platform.runLater(() -> setResult(classifyRS)),
                errorMsg -> Platform.runLater(() -> {
                    setResult(cached);
                    DialogManager.errorDialog("Connection Error", "Could not reload results", errorMsg);
                })
        );
    }

    private void renderResult(ClassifyRS rs) {
        AppsConstants.SeverityMode severityMode = AppsConstants.SeverityMode.resolveSeverityMode(rs.getSeverityMode());

        applyTheme();

        switch (severityMode) {
            case SEVERE -> {
                StringBuilder sb = new StringBuilder();
                sb.append("⚠  ");
                sb.append(LanguageManager.get("severe"));
                sb.append(" - ");
                sb.append(LanguageManager.get("seek_help_now"));
                severityLabel.setText(sb.toString());
                severityLabel.getStyleClass().setAll("severity-banner", "severity-severe");
            }
            case MODERATE -> {
                StringBuilder sb = new StringBuilder();
                sb.append(LanguageManager.get("severity"));
                sb.append(" : ");
                sb.append(LanguageManager.get("moderate"));
                severityLabel.setText(sb.toString());
                severityLabel.getStyleClass().setAll("severity-banner", "severity-moderate");
            }
            default -> {
                StringBuilder sb = new StringBuilder();
                sb.append(LanguageManager.get("severity"));
                sb.append(" : ");
                sb.append(LanguageManager.get("mild"));
                severityLabel.setText(sb.toString());
                severityLabel.getStyleClass().setAll("severity-banner", "severity-mild");
            }
        }

        boolean showCall = severityMode == AppsConstants.SeverityMode.SEVERE && rs.isHasCritical();
        callBtn.setVisible(showCall);
        callBtn.setManaged(showCall);

        if (showCall) {
            bounceCallButton();
        }

        recommendationLabel.setText(rs.getRecommendation() != null ? rs.getRecommendation() : "");
        recommendedActionLabel.setText(rs.getRecommendedAction() != null ? rs.getRecommendedAction() : "");

        boolean hasAudio = rs.getVoiceB64() != null && !rs.getVoiceB64().isBlank();
        recSpeakerBtn.setVisible(hasAudio);
        recSpeakerBtn.setManaged(hasAudio);

        symptomsBox.getChildren().clear();
        List<String> symptoms = rs.getSymptoms();
        if (symptoms != null) {
            for (String s : symptoms) {
                Label lbl = new Label("•  " + s);
                lbl.getStyleClass().add("symptom-item");
                lbl.setWrapText(true);
                lbl.setMaxWidth(Double.MAX_VALUE);
                symptomsBox.getChildren().add(lbl);
            }
        }
    }

    private void applyTheme() {
        StackPane root = getRootPane();
        if (root == null) return;
        root.getStyleClass().add("root");
    }

    private StackPane getRootPane() {
        try {
            return (StackPane) bgPane.getScene().getRoot();
        } catch (Exception e) {
            return null;
        }
    }

    @FXML
    private void handleSpeak() {
        if (result == null) {
            return;
        }

        if (AudioService.isPlaying()) {
            AudioService.stop();
            resetSpeakerIcon();
            return;
        }

        String voiceB64 = result.getVoiceB64();
        if (voiceB64 == null || voiceB64.isBlank()) {
            return;
        }

        setMuteIcon();

        AudioService.playBase64Wav(
                voiceB64,
                err -> Platform.runLater(this::resetSpeakerIcon),
                () -> Platform.runLater(this::resetSpeakerIcon)
        );
    }

    @FXML
    private void handleCallForHelp() {
        AudioService.stop();
        resetSpeakerIcon();
        DialogManager.warningDialog(
                LanguageManager.get("call_for_help"),
                LanguageManager.get("call_000"),
                LanguageManager.get("seek_emergency_medical_attention_immediately_or_call_000")
        );
    }

    @FXML
    private void handleStartAgain() {
        AudioService.stop();
        CacheManager.clearClassifyRS();
        CacheManager.clearTextResultRS();
        CacheManager.clearQuestionsRS();
        CacheManager.clearSavedAnswers();

        try {
            NavBarManager.setCurrentView("/view/DashboardView.fxml");
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/DashboardView.fxml"),
                    LanguageManager.getBundle()
            );
            Stage stage = (Stage) bgPane.getScene().getWindow();
            stage.getScene().setRoot(root);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void handleBack(ActionEvent event) {
        AudioService.stop();
        try {
            NavBarManager.setCurrentView("/view/TellUsMoreText.fxml");
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/TellUsMoreText.fxml"),
                    LanguageManager.getBundle()
            );
            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.getScene().setRoot(root);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void bounceCallButton() {
        Timeline bounce = new Timeline(
                new KeyFrame(Duration.ZERO,
                        new KeyValue(callBtn.scaleYProperty(), 1.0),
                        new KeyValue(callBtn.scaleXProperty(), 1.0)),
                new KeyFrame(Duration.millis(300),
                        new KeyValue(callBtn.scaleYProperty(), 1.07),
                        new KeyValue(callBtn.scaleXProperty(), 1.07)),
                new KeyFrame(Duration.millis(600),
                        new KeyValue(callBtn.scaleYProperty(), 1.0),
                        new KeyValue(callBtn.scaleXProperty(), 1.0)),
                new KeyFrame(Duration.millis(800),
                        new KeyValue(callBtn.scaleYProperty(), 1.0),
                        new KeyValue(callBtn.scaleXProperty(), 1.0))
        );
        bounce.setCycleCount(Timeline.INDEFINITE);
        bounce.play();
    }

    private void setMuteIcon() {
        recSpeakerIcon.setImage(new Image(
                getClass().getResource("/icons/mute.png").toExternalForm()
        ));
    }

    private void resetSpeakerIcon() {
        recSpeakerIcon.setImage(new Image(
                getClass().getResource("/icons/speaker.png").toExternalForm()
        ));
    }
}
