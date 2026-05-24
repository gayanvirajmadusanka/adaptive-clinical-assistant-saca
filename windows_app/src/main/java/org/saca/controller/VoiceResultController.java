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
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.util.Duration;
import org.saca.model.request.AnswerAudioRQ;
import org.saca.model.request.QuestionFetchRQ;
import org.saca.model.request.VoiceInputRQ;
import org.saca.model.response.QuestionsRS;
import org.saca.model.response.VoiceResultRS;
import org.saca.service.ApiService;
import org.saca.service.AudioRecorderService;
import org.saca.service.AudioService;
import org.saca.utility.constant.AppsConstants;
import org.saca.utility.manager.CacheManager;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;
import org.saca.utility.util.StringUtil;

import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;

/**
 * Controller for the Voice result screen
 *
 * <p>Handles user interactions on the Voice result.</p>
 *
 * @author Gayan Madusanka
 */
public class VoiceResultController implements Initializable {

    @FXML
    private SidebarController sidebarController;

    @FXML
    private VBox symptomsBox;

    @FXML
    private Button speakerBtn;

    @FXML
    private ImageView speakerIcon;

    @FXML
    private Button voiceMicBtn;

    @FXML
    private ImageView voiceMicIcon;

    @FXML
    private Label voiceMicHint;

    private VoiceResultRS symptomResult;

    private Stage stage;

    private Timeline micPulse;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        VoiceResultRS saved = CacheManager.getVoiceResultRS();

        if (saved == null) {
            return;
        }

        String savedLang = saved.getLanguage();
        String currentLang = LanguageManager.isLanguageEnglish()
                ? AppsConstants.AppLanguage.EN.getShortDescription()
                : AppsConstants.AppLanguage.WP.getShortDescription();

        if (savedLang != null && !savedLang.equals(currentLang)) {
            reFetchSymptoms();
        } else {
            setSymptomResult(saved);
            handleSpeak();
        }
    }

    public void setSymptomResult(VoiceResultRS result) {
        this.symptomResult = result;
        CacheManager.setVoiceResultRS(result);
        if (result.getSymptomsEn() != null && !result.getSymptomsEn().isEmpty()) {
            CacheManager.setCachedSymptomsEn(result.getSymptomsEn());
        }
        displaySymptoms(result.getSymptomsForCurrentLanguage());
    }

    private void displaySymptoms(List<String> symptoms) {
        symptomsBox.getChildren().clear();

        if (symptoms == null || symptoms.isEmpty()) {
            return;
        }

        for (String symptom : symptoms) {
            Label item = new Label("•  " + StringUtil.capitalizeFirst(symptom));
            item.getStyleClass().add("result-symptom-item");
            item.setWrapText(true);
            symptomsBox.getChildren().add(item);
        }
    }

    @FXML
    private void handleVoiceMic() {
        if (AudioRecorderService.isRecording()) {
            stopRecordingAndSubmit();
        } else {
            startVoiceRecording();
        }
    }

    private void startVoiceRecording() {
        AudioService.stop();
        AudioRecorderService.clearRecording();

        AudioRecorderService.startRecording(
                () -> Platform.runLater(() -> {
                    voiceMicIcon.setImage(new Image(
                            getClass().getResource("/icons/microphone.png").toExternalForm()));
                    voiceMicHint.setText(LanguageManager.get("voice_recording_hint"));
                    voiceMicBtn.getStyleClass().add("result-voice-mic-btn-recording");
                    startMicPulse();
                }),
                err -> Platform.runLater(() ->
                        DialogManager.errorDialog("Microphone Error", "Cannot start recording", err))
        );
    }

    private void stopRecordingAndSubmit() {
        AudioRecorderService.stopRecording(
                err -> Platform.runLater(() ->
                        DialogManager.errorDialog("Recording Error", "Failed to save recording", err))
        );

        Platform.runLater(() -> {
            stopMicPulse();
            voiceMicBtn.getStyleClass().remove("result-voice-mic-btn-recording");
            voiceMicHint.setText(LanguageManager.get("voice_processing"));
            voiceMicBtn.setDisable(true);

            if (!AudioRecorderService.hasRecording()) {
                resetMicButton();
                return;
            }

            String audioB64 = AudioRecorderService.getBase64Wav();
            submitVoiceAnswer(audioB64);
        });
    }

    private void submitVoiceAnswer(String audioB64) {
        AnswerAudioRQ answerAudioRQ = new AnswerAudioRQ();

        answerAudioRQ.setAudioB64(audioB64);
        answerAudioRQ.setQuestionId(AppsConstants.CONFIRM_SYMPTOMS_QUESTION_ID);
        answerAudioRQ.setLanguage(LanguageManager.isLanguageEnglish()
                ? AppsConstants.AppLanguage.EN.getShortDescription()
                : AppsConstants.AppLanguage.WP.getShortDescription());

        ApiService.submitAnswerAudio(
                answerAudioRQ,
                rs -> Platform.runLater(() -> {
                    voiceMicBtn.setDisable(false);
                    resetMicButton();

                    if (rs.isRecognized() && rs.getAnswerId() != null) {

                        String answerId = rs.getAnswerId().toLowerCase();

                        if (answerId.equals(AppsConstants.CONFIRM_SYMPTOMS_ANSWER_YES)) {
                            handleYes();
                        } else if (answerId.equals(AppsConstants.CONFIRM_SYMPTOMS_ANSWER_NO)) {
                            handleNo();
                        } else {
                            showUnrecognizedPopup(rs.getMessage(), rs.getVoiceB64());
                        }
                    } else {
                        showUnrecognizedPopup(rs.getMessage(), rs.getVoiceB64());
                    }
                }),

                err -> Platform.runLater(() -> {
                    voiceMicBtn.setDisable(false);
                    resetMicButton();
                    DialogManager.errorDialog("Error", "Could not process voice answer", err);
                })
        );
    }

    private void showUnrecognizedPopup(String msg, String voiceB64) {
        if (voiceB64 != null && !voiceB64.isBlank()) {
            AudioService.playBase64Wav(voiceB64, err -> {
            }, () -> {
            });
        }

        DialogManager.warningDialogWithOnHidden(
                LanguageManager.get("voice_not_recognized_title"),
                LanguageManager.get("voice_not_recognized"),
                msg != null ? msg : LanguageManager.get("voice_not_recognized_hint"),
                AudioService::stop
        );
    }

    private void resetMicButton() {
        voiceMicIcon.setImage(new Image(
                getClass().getResource("/icons/microphone.png").toExternalForm()));
        voiceMicHint.setText(LanguageManager.get("voice_tap_to_answer"));
        voiceMicBtn.setDisable(false);
        voiceMicBtn.getStyleClass().remove("result-voice-mic-btn-recording");
    }

    private void startMicPulse() {
        micPulse = new Timeline(
                new KeyFrame(Duration.ZERO,
                        new KeyValue(voiceMicBtn.scaleXProperty(), 1.0),
                        new KeyValue(voiceMicBtn.scaleYProperty(), 1.0)),
                new KeyFrame(Duration.millis(600),
                        new KeyValue(voiceMicBtn.scaleXProperty(), 1.15),
                        new KeyValue(voiceMicBtn.scaleYProperty(), 1.15)),
                new KeyFrame(Duration.millis(1200),
                        new KeyValue(voiceMicBtn.scaleXProperty(), 1.0),
                        new KeyValue(voiceMicBtn.scaleYProperty(), 1.0))
        );
        micPulse.setCycleCount(Timeline.INDEFINITE);
        micPulse.play();
    }

    private void stopMicPulse() {
        if (micPulse != null) {
            micPulse.stop();
            voiceMicBtn.setScaleX(1.0);
            voiceMicBtn.setScaleY(1.0);
        }
    }

    @FXML
    private void handleSpeak() {
        if (symptomResult == null) {
            return;
        }

        if (AudioService.isPlaying()) {
            AudioService.stop();
            resetSpeakerIcon();
            return;
        }

        String voiceB64;

        if (LanguageManager.isLanguageEnglish()) {
            voiceB64 = symptomResult.getVoiceB64En();
        } else {
            voiceB64 = symptomResult.getVoiceB64Wp();
        }

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
        stopMicIfRecording();
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
                                LanguageManager.get("connection_error"),
                                LanguageManager.get("could_not_load_questions"),
                                errorMsg);
                        try {
                            FXMLLoader rl = new FXMLLoader(
                                    getClass().getResource("/view/VoiceResultView.fxml"),
                                    LanguageManager.getBundle());
                            Parent rv = rl.load();
                            ((VoiceResultController) rl.getController())
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
        stopMicIfRecording();
        AudioService.stop();
        navigateToVoiceInput(sidebarController.getRoot().getScene());
    }

    @FXML
    private void handleBack(ActionEvent event) {
        stopMicIfRecording();
        AudioService.stop();
        navigateToVoiceInput(((Node) event.getSource()).getScene());
    }

    private void navigateToVoiceInput(Scene scene) {
        try {
            NavBarManager.setCurrentView("/view/VoiceInputView.fxml");
            CacheManager.clearVoiceResultRS();
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/VoiceInputView.fxml"),
                    LanguageManager.getBundle());
            scene.setRoot(root);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void navigateToTellUsMore(QuestionsRS questionsRS) {
        try {
            NavBarManager.setCurrentView("/view/TellUsMoreVoiceView.fxml");
            CacheManager.setQuestionsRS(questionsRS);

            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/TellUsMoreVoiceView.fxml"),
                    LanguageManager.getBundle());
            Parent view = loader.load();

            TellUsMoreVoiceController ctrl = loader.getController();
            ctrl.setQuestions(questionsRS);

            stage.getScene().setRoot(view);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void reFetchSymptoms() {
        String savedAudio = CacheManager.getLastRecordedAudio();

        if (savedAudio == null || savedAudio.isBlank()) {
            VoiceResultRS cached = CacheManager.getVoiceResultRS();
            if (cached != null) {
                setSymptomResult(cached);
            }
            return;
        }

        Label loading = new Label(LanguageManager.get("loading_symptom_title"));
        loading.getStyleClass().add("result-symptom-item");
        symptomsBox.getChildren().setAll(loading);

        VoiceInputRQ voiceInputRQ = new VoiceInputRQ();
        voiceInputRQ.setAudioB64(savedAudio);
        voiceInputRQ.setLanguage(LanguageManager.isLanguageEnglish()
                ? AppsConstants.AppLanguage.EN.getShortDescription()
                : AppsConstants.AppLanguage.WP.getShortDescription());

        ApiService.detectSymptomsAudio(
                voiceInputRQ,
                result -> Platform.runLater(() -> setSymptomResult(result)),
                errorMsg -> Platform.runLater(() -> {
                    VoiceResultRS cached = CacheManager.getVoiceResultRS();
                    if (cached != null) setSymptomResult(cached);
                    else DialogManager.errorDialog("Connection Error",
                            "Could not reload symptoms", errorMsg);
                })
        );
    }

    private QuestionFetchRQ buildQuestionFetchRQ() {
        QuestionFetchRQ rq = new QuestionFetchRQ();
        rq.setSymptoms(symptomResult.getSymptomsEn());
        return rq;
    }

    private void stopMicIfRecording() {
        if (AudioRecorderService.isRecording()) {
            AudioRecorderService.stopRecording(err -> {
            });
            stopMicPulse();
            resetMicButton();
        }
        AudioRecorderService.stopPlayback();
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
