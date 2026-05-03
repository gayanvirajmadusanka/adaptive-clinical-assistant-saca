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
import javafx.scene.control.ProgressBar;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.util.Duration;
import org.saca.model.request.AnswerAudioRQ;
import org.saca.model.request.AnswerRQ;
import org.saca.model.request.ClassifyRQ;
import org.saca.model.request.QuestionFetchRQ;
import org.saca.model.response.*;
import org.saca.service.ApiService;
import org.saca.service.AudioRecorderService;
import org.saca.service.AudioService;
import org.saca.utility.constant.AppsConstants;
import org.saca.utility.manager.CacheManager;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;

import java.net.URL;
import java.util.*;

public class TellUsMoreVoiceController implements Initializable {

    private final Map<String, String> selectedAnswers = new HashMap<>();

    private final Map<String, String> resolvedAnswers = new HashMap<>();

    private final Map<String, String> voiceAudioMap = new HashMap<>();

    private final Map<String, Double> voiceDurationMap = new HashMap<>();

    private final List<Button> currentOptionButtons = new ArrayList<>();

    @FXML
    private SidebarController sidebarController;

    @FXML
    private Label progressLabel;

    @FXML
    private ProgressBar progressBar;

    @FXML
    private VBox questionCard;

    @FXML
    private Label questionText;

    @FXML
    private VBox optionsBox;

    @FXML
    private Button continueBtn;

    @FXML
    private Button questionSpeakerBtn;

    @FXML
    private ImageView questionSpeakerIcon;

    @FXML
    private Label voiceAnswerLabel;

    @FXML
    private Button micBtn;

    @FXML
    private ImageView micIcon;

    @FXML
    private Label micHintLabel;

    @FXML
    private HBox miniPlaybackBar;

    @FXML
    private Button miniPlayBtn;

    @FXML
    private ImageView miniPlayIcon;

    @FXML
    private Label miniDurationLabel;

    @FXML
    private Button miniDeleteBtn;

    private QuestionsRS questionsRS;

    private List<QuestionRS> questions = new ArrayList<>();

    private int currentIndex = 0;

    private String currentSelectedId = null;

    private Timeline recordingPulse;

    private Timeline durationTimer;

    private long recordingStartMillis;

    private Stage stage;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        QuestionsRS saved = CacheManager.getQuestionsRS();
        List<String> symptomsEn = resolveSymptomsEn();

        if (saved != null) {
            String savedLang = saved.getLanguage();
            String currentLang = LanguageManager.isLanguageEnglish()
                    ? AppsConstants.AppLanguage.EN.getShortDescription()
                    : AppsConstants.AppLanguage.WP.getShortDescription();

            if (savedLang != null && !savedLang.equals(currentLang)) {
                fetchQuestions(symptomsEn);
            } else {
                setQuestions(saved);
            }
        } else if (symptomsEn != null) {
            fetchQuestions(symptomsEn);
        }
    }

    private List<String> resolveSymptomsEn() {
        List<String> cached = CacheManager.getCachedSymptomsEn();
        if (cached != null && !cached.isEmpty()) return cached;

        TextResultRS textResult = CacheManager.getTextResultRS();
        if (textResult != null && textResult.getSymptomsEn() != null
                && !textResult.getSymptomsEn().isEmpty()) {
            return textResult.getSymptomsEn();
        }
        VoiceResultRS voiceResult = CacheManager.getVoiceResultRS();
        if (voiceResult != null && voiceResult.getSymptomsEn() != null
                && !voiceResult.getSymptomsEn().isEmpty()) {
            return voiceResult.getSymptomsEn();
        }
        return null;
    }

    public void setQuestions(QuestionsRS questionsRS) {
        this.questionsRS = questionsRS;
        this.questions = questionsRS.getQuestions();
        CacheManager.setQuestionsRS(questionsRS);
        currentIndex = 0;
        selectedAnswers.clear();
        resolvedAnswers.clear();
        voiceAudioMap.clear();
        voiceDurationMap.clear();
        showQuestion(currentIndex);
    }

    private void showQuestion(int index) {
        if (questions == null || questions.isEmpty()) return;

        stopRecordingIfActive();
        AudioService.stop();
        resetQuestionSpeakerIcon();

        QuestionRS question = questions.get(index);
        int total = questions.size();

        progressLabel.setText("Question " + (index + 1) + " of " + total);
        progressBar.setProgress((double) (index + 1) / total);
        questionText.setText(question.getText());

        boolean hasAudio = question.getVoiceB64() != null && !question.getVoiceB64().isBlank();
        questionSpeakerBtn.setVisible(hasAudio);
        questionSpeakerBtn.setManaged(hasAudio);

        optionsBox.getChildren().clear();
        currentOptionButtons.clear();

        String resolvedId = resolvedAnswers.get(question.getId());
        currentSelectedId = resolvedId != null ? resolvedId : selectedAnswers.get(question.getId());

        List<OptionRS> options = question.getOptions();
        for (int i = 0; i < options.size(); i++) {
            Button btn = buildOptionButton(options.get(i), i, options.size(), question.getId());
            currentOptionButtons.add(btn);
            optionsBox.getChildren().add(btn);

            if (options.get(i).getId().equals(currentSelectedId)) {
                btn.getStyleClass().add("option-btn-selected");
            }
        }

        String savedAudio = voiceAudioMap.get(question.getId());
        Double savedDuration = voiceDurationMap.get(question.getId());

        if (savedAudio != null) {
            AudioRecorderService.restoreRecording(savedAudio);
            miniDurationLabel.setText(String.format("%.2f", savedDuration != null ? savedDuration : 0.0));
            showMiniPlayback();
            voiceAnswerLabel.setText(LanguageManager.get("voice_answer_recorded"));
            voiceAnswerLabel.setVisible(true);
            voiceAnswerLabel.setManaged(true);
        } else {
            AudioRecorderService.clearRecording();
            hideMiniPlayback();
            voiceAnswerLabel.setVisible(false);
            voiceAnswerLabel.setManaged(false);
        }

        boolean isLast = (index == total - 1);
        continueBtn.setText(isLast
                ? LanguageManager.get("submit")
                : LanguageManager.get("continue"));
    }

    private Button buildOptionButton(OptionRS option, int index, int total, String questionId) {
        Button btn = new Button("  ●  " + option.getText());
        btn.getStyleClass().addAll("option-btn", getLevelStyle(index, total));
        btn.setMaxWidth(Double.MAX_VALUE);

        btn.setOnAction(e -> {
            currentOptionButtons.forEach(b -> b.getStyleClass().remove("option-btn-selected"));
            btn.getStyleClass().add("option-btn-selected");
            currentSelectedId = option.getId();
            selectedAnswers.put(questionId, option.getId());
        });

        return btn;
    }

    @FXML
    private void handleQuestionSpeak() {
        if (questions == null || questions.isEmpty()) return;
        QuestionRS current = questions.get(currentIndex);
        String voiceB64 = current.getVoiceB64();
        if (voiceB64 == null || voiceB64.isBlank()) return;

        if (AudioService.isPlaying()) {
            AudioService.stop();
            resetQuestionSpeakerIcon();
        } else {
            setQuestionMuteIcon();
            AudioService.playBase64Wav(
                    voiceB64,
                    err -> Platform.runLater(this::resetQuestionSpeakerIcon),
                    () -> Platform.runLater(this::resetQuestionSpeakerIcon)
            );
        }
    }

    @FXML
    private void handleMic() {
        if (AudioRecorderService.isRecording()) {
            stopRecordingAndStore();
        } else {
            startMicRecording();
        }
    }

    private void startMicRecording() {
        AudioRecorderService.clearRecording();
        hideMiniPlayback();

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

    private void stopRecordingAndStore() {
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

            if (!AudioRecorderService.hasRecording()) return;

            String questionId = questions.get(currentIndex).getId();
            String audioB64 = AudioRecorderService.getBase64Wav();
            double duration = AudioRecorderService.getDurationSeconds();

            voiceAudioMap.put(questionId, audioB64);
            voiceDurationMap.put(questionId, duration);

            miniDurationLabel.setText(String.format("%.2f", duration));
            showMiniPlayback();

            voiceAnswerLabel.setText(LanguageManager.get("voice_answer_recorded"));
            voiceAnswerLabel.setVisible(true);
            voiceAnswerLabel.setManaged(true);
        });
    }

    @FXML
    private void handleMiniPlay() {
        if (AudioRecorderService.isPlayingBack()) {
            AudioRecorderService.stopPlayback();
            resetMiniPlayIcon();
            return;
        }
        setMiniPlayingIcon();
        AudioRecorderService.playRecording(
                err -> Platform.runLater(this::resetMiniPlayIcon),
                () -> Platform.runLater(this::resetMiniPlayIcon)
        );
    }

    @FXML
    private void handleMiniDelete() {
        AudioRecorderService.stopPlayback();
        AudioRecorderService.clearRecording();
        resetMiniPlayIcon();
        hideMiniPlayback();

        String questionId = questions.get(currentIndex).getId();
        voiceAudioMap.remove(questionId);
        voiceDurationMap.remove(questionId);
        resolvedAnswers.remove(questionId);

        voiceAnswerLabel.setVisible(false);
        voiceAnswerLabel.setManaged(false);

        currentSelectedId = selectedAnswers.get(questionId);
        currentOptionButtons.forEach(b -> b.getStyleClass().remove("option-btn-selected"));
        if (currentSelectedId != null) {
            QuestionRS current = questions.get(currentIndex);
            for (int i = 0; i < current.getOptions().size(); i++) {
                if (current.getOptions().get(i).getId().equals(currentSelectedId)) {
                    currentOptionButtons.get(i).getStyleClass().add("option-btn-selected");
                    break;
                }
            }
        }
    }

    @FXML
    private void handleContinue() {
        QuestionRS current = questions.get(currentIndex);
        String voiceAudio = voiceAudioMap.get(current.getId());
        String selectedId = selectedAnswers.get(current.getId());
        String resolvedId = resolvedAnswers.get(current.getId());

        if (voiceAudio == null && selectedId == null && resolvedId == null) {
            DialogManager.warningDialog(
                    LanguageManager.get("no_answer"),
                    LanguageManager.get("please_select_an_answer"),
                    LanguageManager.get("choose_one_of_the_options_before_continuing")
            );
            return;
        }

        if (voiceAudio != null) {
            submitVoiceAndProceed(current, voiceAudio, selectedId);
        } else {
            proceedToNext(current.getId(), resolvedId != null ? resolvedId : selectedId);
        }
    }

    private void submitVoiceAndProceed(QuestionRS question, String audioB64, String fallbackAnswerId) {
        stage = (Stage) questionCard.getScene().getWindow();

        AnswerAudioRQ rq = new AnswerAudioRQ();
        rq.setAudioB64(audioB64);
        rq.setQuestionId(question.getId());
        rq.setLanguage(LanguageManager.isLanguageEnglish()
                ? AppsConstants.AppLanguage.EN.getShortDescription()
                : AppsConstants.AppLanguage.WP.getShortDescription());

        try {
            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/LoadingView.fxml"),
                    LanguageManager.getBundle()
            );
            Parent loadingView = loader.load();
            LoadingController loadingCtrl = loader.getController();
            loadingCtrl.setTitle(LanguageManager.get("uploading_your_recordings"));
            loadingCtrl.setDuration(Integer.MAX_VALUE);

            Parent voiceView = stage.getScene().getRoot();

            ApiService.submitAnswerAudio(
                    rq,
                    rs -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        stage.getScene().setRoot(voiceView);

                        String answerId;
                        if (rs.isRecognized() && rs.getAnswerId() != null) {
                            answerId = rs.getAnswerId();
                            resolvedAnswers.put(question.getId(), answerId);
                            highlightOptionById(answerId);
                            voiceAnswerLabel.setText(LanguageManager.get("voice_answer_recorded"));
                        } else if (fallbackAnswerId != null) {
                            answerId = fallbackAnswerId;
                            resolvedAnswers.put(question.getId(), answerId);
                            String msg = rs.getMessage() != null
                                    ? rs.getMessage() + " — using selected answer"
                                    : LanguageManager.get("voice_not_recognized");
                            voiceAnswerLabel.setText(msg);
                        } else {
                            voiceAnswerLabel.setText(rs.getMessage() != null
                                    ? rs.getMessage()
                                    : LanguageManager.get("voice_not_recognized"));
                            voiceAnswerLabel.setVisible(true);
                            voiceAnswerLabel.setManaged(true);
                            return;
                        }

                        proceedToNext(question.getId(), answerId);
                    }),
                    err -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        stage.getScene().setRoot(voiceView);

                        if (fallbackAnswerId != null) {
                            resolvedAnswers.put(question.getId(), fallbackAnswerId);
                            proceedToNext(question.getId(), fallbackAnswerId);
                        } else {
                            DialogManager.errorDialog("Error", "Could not process voice answer", err);
                        }
                    })
            );

            stage.getScene().setRoot(loadingView);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void proceedToNext(String questionId, String answerId) {
        resolvedAnswers.put(questionId, answerId);

        if (currentIndex < questions.size() - 1) {
            currentIndex++;
            showQuestion(currentIndex);
        } else {
            submitAllAnswers();
        }
    }

    private void highlightOptionById(String answerId) {
        currentOptionButtons.forEach(b -> b.getStyleClass().remove("option-btn-selected"));
        QuestionRS current = questions.get(currentIndex);
        for (int i = 0; i < current.getOptions().size(); i++) {
            if (current.getOptions().get(i).getId().equals(answerId)) {
                currentOptionButtons.get(i).getStyleClass().add("option-btn-selected");
                break;
            }
        }
    }

    private void submitAllAnswers() {
        VoiceResultRS voiceResultRS = CacheManager.getVoiceResultRS();
        if (voiceResultRS == null) return;

        stage = (Stage) questionCard.getScene().getWindow();

        List<AnswerRQ> answerList = new ArrayList<>();
        for (QuestionRS question : questions) {
            String qId = question.getId();
            String answerId = resolvedAnswers.getOrDefault(qId, selectedAnswers.get(qId));
            if (answerId != null) {
                answerList.add(new AnswerRQ(qId, answerId));
            }
        }

        CacheManager.setSavedAnswers(answerList);

        ClassifyRQ classifyRQ = new ClassifyRQ();
        classifyRQ.setSymptoms(voiceResultRS.getSymptomsEn());
        classifyRQ.setAnswers(answerList);
        classifyRQ.setLanguage(LanguageManager.isLanguageEnglish()
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
            loadingCtrl.setTitle(LanguageManager.get("loading_severity_title"));
            loadingCtrl.setDuration(Integer.MAX_VALUE);

            ApiService.classify(
                    classifyRQ,
                    classifyRS -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        navigateToFinalResult(classifyRS);
                    }),
                    errorMsg -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        DialogManager.errorDialog("Connection Error",
                                "Could not submit answers", errorMsg);
                        try {
                            FXMLLoader rl = new FXMLLoader(
                                    getClass().getResource("/view/TellUsMoreVoiceView.fxml"),
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
        }
    }

    private void navigateToFinalResult(ClassifyRS classifyRS) {
        try {
            NavBarManager.setPreviousView("/view/TellUsMoreVoiceView.fxml");
            NavBarManager.setCurrentView("/view/FinalResultView.fxml");
            CacheManager.setClassifyRS(classifyRS);

            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/FinalResultView.fxml"),
                    LanguageManager.getBundle()
            );
            Parent view = loader.load();

            FinalResultController ctrl = loader.getController();
            ctrl.setResult(classifyRS);

            stage.getScene().setRoot(view);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void handleBack(ActionEvent event) {
        stopRecordingIfActive();
        AudioService.stop();

        if (currentIndex > 0) {
            currentIndex--;
            showQuestion(currentIndex);
        } else {
            try {
                NavBarManager.setCurrentView("/view/VoiceResultView.fxml");
                Parent root = FXMLLoader.load(
                        getClass().getResource("/view/VoiceResultView.fxml"),
                        LanguageManager.getBundle()
                );
                Stage s = (Stage) ((Node) event.getSource()).getScene().getWindow();
                s.getScene().setRoot(root);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void fetchQuestions(List<String> symptomsEn) {
        if (symptomsEn == null || symptomsEn.isEmpty()) return;
        questionText.setText(LanguageManager.get("loading_symptom_title"));
        optionsBox.getChildren().clear();

        QuestionFetchRQ rq = new QuestionFetchRQ();
        rq.setSymptoms(symptomsEn);

        ApiService.fetchQuestions(rq,
                questionsRS -> Platform.runLater(() -> setQuestions(questionsRS)),
                errorMsg -> Platform.runLater(() -> {
                    DialogManager.errorDialog("Connection Error", "Could not load questions", errorMsg);
                    QuestionsRS prev = CacheManager.getQuestionsRS();
                    if (prev != null) setQuestions(prev);
                })
        );
    }

    private void stopRecordingIfActive() {
        if (AudioRecorderService.isRecording()) {
            AudioRecorderService.stopRecording(err -> {
            });
            stopPulse();
            stopDurationTimer();
            micBtn.getStyleClass().remove("speak-mic-btn-recording");
            micIcon.setImage(new Image(
                    getClass().getResource("/icons/microphone.png").toExternalForm()
            ));
            micHintLabel.setText(LanguageManager.get("speak_hint"));
        }
        AudioRecorderService.stopPlayback();
    }

    private void showMiniPlayback() {
        miniPlaybackBar.setVisible(true);
        miniPlaybackBar.setManaged(true);
    }

    private void hideMiniPlayback() {
        miniPlaybackBar.setVisible(false);
        miniPlaybackBar.setManaged(false);
    }

    private void setQuestionMuteIcon() {
        questionSpeakerIcon.setImage(new Image(
                getClass().getResource("/icons/mute.png").toExternalForm()
        ));
    }

    private void resetQuestionSpeakerIcon() {
        questionSpeakerIcon.setImage(new Image(
                getClass().getResource("/icons/speaker.png").toExternalForm()
        ));
    }

    private void setMiniPlayingIcon() {
        miniPlayIcon.setImage(new Image(
                getClass().getResource("/icons/mute.png").toExternalForm()
        ));
    }

    private void resetMiniPlayIcon() {
        miniPlayIcon.setImage(new Image(
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
                    miniDurationLabel.setText(String.format("%.2f", elapsed / 1000.0));
                })
        );
        durationTimer.setCycleCount(Timeline.INDEFINITE);
        durationTimer.play();
    }

    private void stopDurationTimer() {
        if (durationTimer != null) durationTimer.stop();
    }

    private String getLevelStyle(int index, int total) {
        if (total <= 1) return "option-level-0";
        if (total == 2) return index == 0 ? "option-level-0" : "option-level-1";
        int level = Math.round((float) index / (total - 1) * 4);
        return "option-level-" + level;
    }
}
