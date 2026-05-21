package org.saca.controller;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.Button;
import javafx.scene.control.ContentDisplay;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressBar;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import org.saca.model.request.AnswerRQ;
import org.saca.model.request.ClassifyRQ;
import org.saca.model.request.QuestionFetchRQ;
import org.saca.model.response.*;
import org.saca.service.ApiService;
import org.saca.service.AudioService;
import org.saca.utility.constant.AppsConstants;
import org.saca.utility.manager.CacheManager;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;

import java.net.URL;
import java.util.*;

public class TellUsMoreBodyController implements Initializable {

    private final Map<String, String> selectedAnswers = new HashMap<>();

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

    private QuestionsRS questionsRS;

    private List<QuestionRS> questions = new ArrayList<>();

    private int currentIndex = 0;

    private String currentSelectedId = null;

    private Stage stage;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        QuestionsRS saved = CacheManager.getQuestionsRS();
        TextResultRS result = CacheManager.getTextResultRS();

        if (saved != null) {
            String savedLang = saved.getLanguage();
            String currentLang = LanguageManager.isLanguageEnglish()
                    ? AppsConstants.AppLanguage.EN.getShortDescription()
                    : AppsConstants.AppLanguage.WP.getShortDescription();

            if (savedLang != null && !savedLang.equals(currentLang)) {
                fetchQuestions(result);
            } else {
                selectedAnswers.clear();
                setQuestions(saved);
            }
        } else if (result != null) {
            fetchQuestions(result);
        }
    }

    public void setQuestions(QuestionsRS questionsRS) {
        this.questionsRS = questionsRS;
        this.questions = questionsRS.getQuestions();
        CacheManager.setQuestionsRS(questionsRS);
        currentIndex = 0;
        selectedAnswers.clear();
        showQuestion(currentIndex);
    }

    private void showQuestion(int index) {
        if (questions == null || questions.isEmpty()) {
            return;
        }

        AudioService.stop();
        resetSpeakerIcon();

        QuestionRS question = questions.get(index);
        int total = questions.size();

        StringBuilder sb = new StringBuilder();
        sb.append(LanguageManager.get("question")).append(" ")
                .append(index + 1).append(" ")
                .append(LanguageManager.get("of")).append(" ")
                .append(total);

        progressLabel.setText(sb.toString());
        progressBar.setProgress((double) (index + 1) / total);
        questionText.setText(question.getText());

        boolean hasAudio = question.getVoiceB64() != null && !question.getVoiceB64().isBlank();
        questionSpeakerBtn.setVisible(hasAudio);
        questionSpeakerBtn.setManaged(hasAudio);

        optionsBox.getChildren().clear();
        currentOptionButtons.clear();
        currentSelectedId = selectedAnswers.get(question.getId());

        boolean isYesNo = question.getType().equals(AppsConstants.QUESTION_TYPE_YES_NO);

        boolean anyImage = isYesNo || question.getOptions().stream().anyMatch(o ->
                getClass().getResource("/images/options/" + o.getId().toLowerCase() + ".png") != null);

        if (anyImage) {
            HBox row = new HBox(12);
            row.setAlignment(javafx.geometry.Pos.CENTER);

            for (int i = 0; i < question.getOptions().size(); i++) {
                Button btn = buildOptionButton(question.getOptions().get(i), i,
                        question.getOptions().size(), question.getId(), true, isYesNo);
                currentOptionButtons.add(btn);
                row.getChildren().add(btn);
            }

            optionsBox.getChildren().add(row);
        } else {
            for (int i = 0; i < question.getOptions().size(); i++) {
                Button btn = buildOptionButton(question.getOptions().get(i), i,
                        question.getOptions().size(), question.getId(), false, false);
                currentOptionButtons.add(btn);
                optionsBox.getChildren().add(btn);
            }
        }

        if (currentSelectedId != null) {
            for (int i = 0; i < question.getOptions().size(); i++) {
                if (question.getOptions().get(i).getId().equals(currentSelectedId)) {
                    currentOptionButtons.get(i).getStyleClass().add("option-btn-selected");
                }
            }
        }

        boolean isLast = (index == total - 1);
        continueBtn.setText(isLast
                ? LanguageManager.get("submit")
                : LanguageManager.get("continue"));
    }

    private Button buildOptionButton(OptionRS option, int index, int total,
                                     String questionId, boolean withImage, boolean isYesNo) {
        Button btn;

        if (withImage) {
            String optId = option.getId().toLowerCase();
            URL imageUrl;

            if (isYesNo) {
                imageUrl = getClass().getResource("/images/options/option_" + option.getText().toLowerCase() + ".png");
            } else {
                imageUrl = getClass().getResource("/images/options/" + optId + ".png");
            }

            btn = new Button(option.getText());
            btn.getStyleClass().addAll("option-img-btn", getLevelStyle(index, total));
            btn.setContentDisplay(ContentDisplay.TOP);

            if (imageUrl != null) {
                ImageView imageView = new ImageView(new Image(imageUrl.toExternalForm(), true));
                imageView.setFitWidth(90);
                imageView.setFitHeight(90);
                imageView.setPreserveRatio(true);
                btn.setGraphic(imageView);
            }
            btn.setPrefWidth(130);
            btn.setMaxWidth(130);
            btn.setWrapText(true);
        } else {
            btn = new Button("  ●  " + option.getText());
            btn.getStyleClass().addAll("option-btn", getLevelStyle(index, total));
            btn.setMaxWidth(Double.MAX_VALUE);
        }

        btn.setUserData(option.getId());

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
        if (questions == null || questions.isEmpty()) {
            return;
        }

        QuestionRS current = questions.get(currentIndex);
        String voiceB64 = current.getVoiceB64();

        if (voiceB64 == null || voiceB64.isBlank()) {
            return;
        }

        if (AudioService.isPlaying()) {
            AudioService.stop();
            resetSpeakerIcon();
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
    private void handleContinue() {
        AudioService.stop();
        resetSpeakerIcon();

        QuestionRS current = questions.get(currentIndex);
        if (!selectedAnswers.containsKey(current.getId())) {
            DialogManager.warningDialog(
                    LanguageManager.get("no_answer"),
                    LanguageManager.get("please_select_an_answer"),
                    LanguageManager.get("choose_one_of_the_options_before_continuing")
            );
            return;
        }

        if (currentIndex < questions.size() - 1) {
            currentIndex++;
            showQuestion(currentIndex);
        } else {
            submitAnswers();
        }
    }

    private void submitAnswers() {
        TextResultRS textResult = CacheManager.getTextResultRS();

        if (textResult == null) {
            return;
        }

        stage = (Stage) questionCard.getScene().getWindow();

        List<AnswerRQ> answerList = selectedAnswers.entrySet().stream()
                .map(e -> new AnswerRQ(e.getKey(), e.getValue()))
                .collect(java.util.stream.Collectors.toList());

        CacheManager.setSavedAnswers(answerList);

        ClassifyRQ classifyRQ = new ClassifyRQ();
        classifyRQ.setSymptoms(textResult.getSymptomsEn());
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
                                    getClass().getResource("/view/TellUsMoreBodyView.fxml"),
                                    LanguageManager.getBundle());
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
            NavBarManager.setPreviousView("/view/TellUsMoreBodyView.fxml");
            NavBarManager.setCurrentView("/view/FinalResultView.fxml");
            CacheManager.setClassifyRS(classifyRS);

            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/FinalResultView.fxml"),
                    LanguageManager.getBundle()
            );
            Parent view = loader.load();
            ((FinalResultController) loader.getController()).setResult(classifyRS);
            stage.getScene().setRoot(view);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void handleBack(ActionEvent event) {
        AudioService.stop();
        resetSpeakerIcon();

        if (currentIndex > 0) {
            currentIndex--;
            showQuestion(currentIndex);
        } else {
            try {
                NavBarManager.setCurrentView("/view/BodyResultView.fxml");
                Parent root = FXMLLoader.load(
                        getClass().getResource("/view/BodyResultView.fxml"),
                        LanguageManager.getBundle()
                );
                Stage s = (Stage) ((Node) event.getSource()).getScene().getWindow();
                s.getScene().setRoot(root);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void fetchQuestions(TextResultRS symptomResult) {
        if (symptomResult == null) {
            return;
        }

        questionText.setText(LanguageManager.get("loading_questions"));
        optionsBox.getChildren().clear();

        QuestionFetchRQ rq = new QuestionFetchRQ();
        rq.setSymptoms(symptomResult.getSymptomsEn());

        ApiService.fetchQuestions(rq,
                questionsRS -> Platform.runLater(() -> {
                    selectedAnswers.clear();
                    setQuestions(questionsRS);
                }),
                errorMsg -> Platform.runLater(() -> {
                    DialogManager.errorDialog(
                            LanguageManager.get("connection_error"),
                            LanguageManager.get("could_not_load_questions"),
                            errorMsg);
                    QuestionsRS prev = CacheManager.getQuestionsRS();
                    if (prev != null) {
                        selectedAnswers.clear();
                        setQuestions(prev);
                    }
                })
        );
    }

    private String getLevelStyle(int index, int total) {
        if (total <= 1) {
            return "option-level-0";
        }

        if (total == 2) {
            return "option-level-1";
        }

        int level = Math.round((float) index / (total - 1) * 4);
        return "option-level-" + level;
    }

    private void setMuteIcon() {
        questionSpeakerIcon.setImage(new Image(
                getClass().getResource("/icons/mute.png").toExternalForm()
        ));
    }

    private void resetSpeakerIcon() {
        questionSpeakerIcon.setImage(new Image(
                getClass().getResource("/icons/speaker.png").toExternalForm()
        ));
    }
}
