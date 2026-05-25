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
import org.saca.model.request.VoiceInputRQ;
import org.saca.model.response.VoiceResultRS;
import org.saca.service.ApiService;
import org.saca.service.AudioRecorderService;
import org.saca.service.AudioService;
import org.saca.utility.constant.AppsConstants;
import org.saca.utility.manager.CacheManager;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;
import org.saca.utility.util.CommonUtil;

import java.net.URL;
import java.util.Base64;
import java.util.ResourceBundle;

/**
 * Controller for the Voice input screen
 *
 * <p>Handles user interactions on the Voice input.</p>
 *
 * @author Gayan Madusanka
 */
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

    @FXML
    private Button submitBtn;

    @FXML
    private Button introSpeakerBtn;

    @FXML
    private ImageView introSpeakerIcon;

    private Timeline recordingPulse;

    private Timeline durationTimer;

    private long recordingStartMillis;

    private Stage stage;

    private Parent voiceInputView;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        stage = null;
        playIntroAudio();
    }

    private void playIntroAudio() {
        String fileName = LanguageManager.isLanguageEnglish()
                ? "describe_symptoms_en.wav"
                : "describe_symptoms_wp.wav";

        URL audioUrl = getClass().getResource("/audio/ui/" + fileName);

        if (audioUrl == null) {
            return;
        }

        try {
            String voiceBase64 = Base64.getEncoder().encodeToString(audioUrl.openStream().readAllBytes());
            setIntroMuteIcon();
            AudioService.playBase64Wav(
                    voiceBase64,
                    err -> Platform.runLater(this::resetIntroSpeakerIcon),
                    () -> Platform.runLater(this::resetIntroSpeakerIcon)
            );
        } catch (Exception e) {
            resetIntroSpeakerIcon();
        }
    }

    @FXML
    private void handleIntroSpeak() {
        if (AudioService.isPlaying()) {
            AudioService.stop();
            resetIntroSpeakerIcon();
        } else {
            playIntroAudio();
        }
    }

    private void setIntroMuteIcon() {
        if (introSpeakerIcon != null)
            introSpeakerIcon.setImage(new Image(
                    getClass().getResource("/icons/mute.png").toExternalForm()));
    }

    private void resetIntroSpeakerIcon() {
        if (introSpeakerIcon != null)
            introSpeakerIcon.setImage(new Image(
                    getClass().getResource("/icons/speaker.png").toExternalForm()));
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
        AudioService.stop();
        resetIntroSpeakerIcon();

        AudioRecorderService.clearRecording();
        setPlaybackBarEnabled(false);
        durationLabel.setText("0.00");

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
                setPlaybackBarEnabled(true);
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
        CacheManager.setLastRecordedAudio(null);
        resetPlayIcon();
        setPlaybackBarEnabled(false);
        durationLabel.setText("0.00");
        micHintLabel.setText(LanguageManager.get("speak_hint"));
    }

    @FXML
    private void handleSubmit() {
        if (!AudioRecorderService.hasRecording()) {
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
        if (audioB64 == null) {
            return;
        }

        CacheManager.setLastRecordedAudio(audioB64);

        stage = (Stage) micBtn.getScene().getWindow();

        VoiceInputRQ voiceInputRQ = new VoiceInputRQ();
        voiceInputRQ.setAudioB64(audioB64);
        voiceInputRQ.setLanguage(LanguageManager.isLanguageEnglish()
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

            voiceInputView = stage.getScene().getRoot();

            ApiService.detectSymptomsAudio(
                    voiceInputRQ,
                    result -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        navigateToResult(result);
                    }),
                    errorMsg -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        DialogManager.errorDialog("Connection Error",
                                "Could not process audio", errorMsg);
                        stage.getScene().setRoot(voiceInputView);
                    })
            );

            stage.getScene().setRoot(loadingView);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void navigateToResult(VoiceResultRS result) {
        if (result == null
                || (CommonUtil.isListEmpty(result.getSymptomsEn())
                && CommonUtil.isListEmpty(result.getSymptomsWp()))) {

            if (result != null) {
                if (LanguageManager.isLanguageEnglish()) {
                    showUnrecognizedPopup(result.getVoiceB64En());
                } else {
                    showUnrecognizedPopup(result.getVoiceB64Wp());
                }
            }

            stage.getScene().setRoot(voiceInputView);
            return;
        }

        try {
            NavBarManager.setCurrentView("/view/VoiceResultView.fxml");
            CacheManager.setVoiceResultRS(result);

            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/VoiceResultView.fxml"),
                    LanguageManager.getBundle()
            );
            Parent view = loader.load();

            VoiceResultController ctrl = loader.getController();
            ctrl.setSymptomResult(result);

            stage.getScene().setRoot(view);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void handleBack(ActionEvent event) {
        AudioService.stop();
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

    private void setPlaybackBarEnabled(boolean enabled) {
        deleteBtn.setDisable(!enabled);
        playBtn.setDisable(!enabled);
        submitBtn.setDisable(!enabled);
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

    private void showUnrecognizedPopup(String voiceB64) {
        if (voiceB64 != null && !voiceB64.isBlank()) {
            AudioService.playBase64Wav(voiceB64, err -> {
            }, () -> {
            });
        }

        DialogManager.warningDialogWithOnHidden(
                LanguageManager.get("no_symptoms_detected"),
                LanguageManager.get("we_could_not_detect_any_symptoms_from_your_recording"),
                LanguageManager.get("please_try_recording_again_more_clearly"),
                AudioService::stop
        );
    }
}
