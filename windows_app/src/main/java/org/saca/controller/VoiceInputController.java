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
import javafx.scene.layout.HBox;
import javafx.stage.Stage;
import javafx.util.Duration;
import org.saca.model.response.TextResultRS;
import org.saca.service.AudioRecorderService;
import org.saca.utility.manager.CacheManager;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;
import org.saca.utility.util.CommonUtil;

import java.net.URL;
import java.util.ResourceBundle;

public class VoiceInputController implements Initializable {

    @FXML
    private SidebarController sidebarController;

    @FXML
    private Button micBtn;

    @FXML
    private ImageView micIcon;

    @FXML
    private Label micHintLabel;

    @FXML
    private HBox playbackBar;

    @FXML
    private Label durationLabel;

    @FXML
    private Button playBtn;

    @FXML
    private ImageView playIcon;

    @FXML
    private Button deleteBtn;

    private Timeline recordingPulse;

    private Timeline durationTimer;

    private long recordingStartMillis;

    private Stage stage;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        stage = null;
    }

    @FXML
    private void handleMic() {
        if (AudioRecorderService.isRecording()) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    private void startRecording() {
        AudioRecorderService.clearRecording();
        showPlaybackBar(false);

        AudioRecorderService.startRecording(
                () -> Platform.runLater(() -> {
                    micIcon.setImage(new Image(
                            getClass().getResource("/icons/microphone.png").toExternalForm()
                    ));
                    micHintLabel.setText(LanguageManager.get("speak_recording"));
                    micBtn.getStyleClass().add("speak-mic-btn-recording");
                    startPulse();
                    startDurationTimer();
                }),
                err -> Platform.runLater(() ->
                        DialogManager.errorDialog("Microphone Error", "Cannot start recording", err)
                )
        );
    }

    private void stopRecording() {
        AudioRecorderService.stopRecording(
                err -> Platform.runLater(() ->
                        DialogManager.errorDialog("Recording Error", "Failed to save recording", err)
                )
        );

        Platform.runLater(() -> {
            stopPulse();
            stopDurationTimer();
            micIcon.setImage(new Image(
                    getClass().getResource("/icons/microphone.png").toExternalForm()
            ));
            micBtn.getStyleClass().remove("speak-mic-btn-recording");
            micHintLabel.setText(LanguageManager.get("speak_hint"));

            if (AudioRecorderService.hasRecording()) {
                double secs = AudioRecorderService.getDurationSeconds();
                durationLabel.setText(String.format("%.2f", secs));
                showPlaybackBar(true);
            }
        });
    }

    @FXML
    private void handlePlay() {
        if (AudioRecorderService.isPlayingBack()) {
            AudioRecorderService.stopPlayback();
            resetPlayIcon();
            return;
        }

        setPlayingIcon();

        AudioRecorderService.playRecording(
                err -> Platform.runLater(this::resetPlayIcon),
                () -> Platform.runLater(this::resetPlayIcon)
        );
    }

    @FXML
    private void handleDelete() {
        AudioRecorderService.stopPlayback();
        AudioRecorderService.clearRecording();
        resetPlayIcon();
        showPlaybackBar(false);
        micHintLabel.setText(LanguageManager.get("speak_hint"));
    }

    @FXML
    private void handleSubmit() {
        System.out.println("Auido Submit");
/*        if (!AudioRecorderService.hasRecording()) {
            DialogManager.warningDialog(
                    LanguageManager.get("no_recording"),
                    LanguageManager.get("please_record_audio"),
                    LanguageManager.get("tap_mic_to_record")
            );
            return;
        }

        AudioRecorderService.stopPlayback();
        resetPlayIcon();

        String audioB64 = AudioRecorderService.getBase64Wav();
        if (audioB64 == null) return;

        stage = (Stage) micBtn.getScene().getWindow();

        VoiceInputRQ rq = new VoiceInputRQ();
        rq.setAudioB64(audioB64);
        rq.setLanguage(LanguageManager.isLanguageEnglish()
                ? AppsConstants.AppLanguage.EN.getShortDescription()
                : AppsConstants.AppLanguage.WP.getShortDescription());

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

            ApiService.extractAudio(
                    rq,
                    result -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        navigateToResult(result);
                    }),
                    errorMsg -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        DialogManager.errorDialog("Connection Error",
                                "Could not process audio", errorMsg);
                        try {
                            FXMLLoader rl = new FXMLLoader(
                                    getClass().getResource("/view/VoiceInputView.fxml"),
                                    LanguageManager.getBundle()
                            );
                            stage.getScene().setRoot(rl.load());
                        } catch (Exception ex) {
                            ex.printStackTrace();
                        }
                    })
            );

            stage.getScene().setRoot(loadingView);

        } catch (Exception e) {
            e.printStackTrace();
        }*/
    }

    private void navigateToResult(TextResultRS result) {
        if (result == null
                || (CommonUtil.isListEmpty(result.getSymptomsEn())
                && CommonUtil.isListEmpty(result.getSymptomsWp()))) {
            DialogManager.errorDialog(
                    "No Symptoms Detected",
                    "We could not detect any symptoms from your recording",
                    "Please try recording again more clearly."
            );
            try {
                NavBarManager.setCurrentView("/view/VoiceInputView.fxml");
                FXMLLoader rl = new FXMLLoader(
                        getClass().getResource("/view/VoiceInputView.fxml"),
                        LanguageManager.getBundle()
                );
                stage.getScene().setRoot(rl.load());
            } catch (Exception ex) {
                ex.printStackTrace();
            }
            return;
        }

        try {
            NavBarManager.setCurrentView("/view/TextResultView.fxml");
            CacheManager.setTextResultRS(result);

            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/TextResultView.fxml"),
                    LanguageManager.getBundle()
            );
            Parent view = loader.load();

            TextResultController ctrl = loader.getController();
            ctrl.setSymptomResult(result);

            stage.getScene().setRoot(view);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void handleBack(ActionEvent event) {
        AudioRecorderService.stopPlayback();
        if (AudioRecorderService.isRecording()) {
            AudioRecorderService.stopRecording(err -> {
            });
        }
        stopPulse();
        stopDurationTimer();

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

    private void showPlaybackBar(boolean show) {
        playbackBar.setVisible(show);
        playbackBar.setManaged(show);
    }

    private void setPlayingIcon() {
        playIcon.setImage(new Image(
                getClass().getResource("/icons/mute.png").toExternalForm()
        ));
    }

    private void resetPlayIcon() {
        playIcon.setImage(new Image(
                getClass().getResource("/icons/play.png").toExternalForm()
        ));
    }

    private void startPulse() {
        recordingPulse = new Timeline(
                new KeyFrame(Duration.ZERO,
                        new KeyValue(micBtn.scaleXProperty(), 1.0),
                        new KeyValue(micBtn.scaleYProperty(), 1.0)),
                new KeyFrame(Duration.millis(500),
                        new KeyValue(micBtn.scaleXProperty(), 1.12),
                        new KeyValue(micBtn.scaleYProperty(), 1.12)),
                new KeyFrame(Duration.millis(1000),
                        new KeyValue(micBtn.scaleXProperty(), 1.0),
                        new KeyValue(micBtn.scaleYProperty(), 1.0))
        );
        recordingPulse.setCycleCount(Timeline.INDEFINITE);
        recordingPulse.play();
    }

    private void stopPulse() {
        if (recordingPulse != null) {
            recordingPulse.stop();
            micBtn.setScaleX(1.0);
            micBtn.setScaleY(1.0);
        }
    }

    private void startDurationTimer() {
        recordingStartMillis = System.currentTimeMillis();
        durationTimer = new Timeline(
                new KeyFrame(Duration.millis(100), e -> {
                    long elapsed = System.currentTimeMillis() - recordingStartMillis;
                    double secs = elapsed / 1000.0;
                    durationLabel.setText(String.format("%.2f", secs));
                })
        );
        durationTimer.setCycleCount(Timeline.INDEFINITE);
        durationTimer.play();
    }

    private void stopDurationTimer() {
        if (durationTimer != null) durationTimer.stop();
    }
}
