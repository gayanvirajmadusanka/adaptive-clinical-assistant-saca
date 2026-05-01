package org.saca.controller;

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
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import org.saca.model.request.QuestionFetchRQ;
import org.saca.model.response.OptionRS;
import org.saca.model.response.QuestionRS;
import org.saca.model.response.QuestionsRS;
import org.saca.model.response.TextResultRS;
import org.saca.service.ApiService;
import org.saca.utility.constant.AppsConstants;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;

import java.net.URL;
import java.util.*;

public class TellUsMoreTextController implements Initializable {

    private final Map<String, String> selectedAnswers = new HashMap<>();

    private final List<Button> currentOptionButtons = new ArrayList<>();

    @FXML
    private SidebarController sidebarController;

    @FXML
    private AudioOverlayController audioOverlayController;

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

    private QuestionsRS questionsRS;

    private List<QuestionRS> questions = new ArrayList<>();

    private int currentIndex = 0;

    private String currentSelectedId = null;

    private Stage stage;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        stage = null;

        QuestionsRS saved = NavBarManager.getQuestionsRS();
        TextResultRS result = NavBarManager.getTextResultRS();

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
        NavBarManager.setQuestionsRS(questionsRS);
        currentIndex = 0;
        selectedAnswers.clear();
        showQuestion(currentIndex);
    }

    private void showQuestion(int index) {
        if (questions == null || questions.isEmpty()) {
            return;
        }

        audioOverlayController.stopAndHide();

        QuestionRS question = questions.get(index);
        int total = questions.size();

        // Question progress
        progressLabel.setText("Question " + (index + 1) + " of " + total);
        progressBar.setProgress((double) (index + 1) / total);

        // Question text
        questionText.setText(question.getText());

        // Show/hide speaker button based on whether voice_b64 exists
        boolean hasAudio = question.getVoiceB64() != null
                && !question.getVoiceB64().isBlank();
        questionSpeakerBtn.setVisible(hasAudio);
        questionSpeakerBtn.setManaged(hasAudio);

        // Build options
        optionsBox.getChildren().clear();
        currentOptionButtons.clear();
        currentSelectedId = selectedAnswers.get(question.getId());

        List<OptionRS> options = question.getOptions();
        for (int i = 0; i < options.size(); i++) {
            Button btn = buildOptionButton(options.get(i), i, options.size(), question.getId());
            currentOptionButtons.add(btn);
            optionsBox.getChildren().add(btn);

            if (options.get(i).getId().equals(currentSelectedId)) {
                btn.getStyleClass().add("option-btn-selected");
            }
        }

        boolean isLast = (index == total - 1);
        continueBtn.setText(isLast
                ? LanguageManager.get("submit")
                : LanguageManager.get("continue"));
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

        if (audioOverlayController.isPlaying()) {
            audioOverlayController.stopAndHide();
        } else {
            audioOverlayController.play(voiceB64);
        }
    }

    private Button buildOptionButton(OptionRS option,
                                     int index,
                                     int total,
                                     String questionId) {
        Button btn = new Button("  ●  " + option.getText());
        btn.getStyleClass().addAll("option-btn", getLevelStyle(index, total));
        btn.setMaxWidth(Double.MAX_VALUE);
        btn.setUserData(option.getId());

        btn.setOnAction(e -> {
            currentOptionButtons.forEach(b ->
                    b.getStyleClass().remove("option-btn-selected"));
            btn.getStyleClass().add("option-btn-selected");
            currentSelectedId = option.getId();
            selectedAnswers.put(questionId, option.getId());
        });

        return btn;
    }

    @FXML
    private void handleContinue() {
        QuestionRS current = questions.get(currentIndex);

        if (!selectedAnswers.containsKey(current.getId())) {
            DialogManager.warningDialog(
                    "No Answer",
                    "Please select an answer",
                    "Choose one of the options before continuing."
            );
            return;
        }

        if (currentIndex < questions.size() - 1) {
            currentIndex++;
            showQuestion(currentIndex);
        } else {
            System.out.println("All answers: " + selectedAnswers);
            // TODO: navigate to next screen or call submit API
        }
    }

    @FXML
    private void handleBack(ActionEvent event) {
        if (currentIndex > 0) {
            currentIndex--;
            showQuestion(currentIndex);
        } else {
            audioOverlayController.stopAndHide();
            try {
                NavBarManager.setCurrentView("/view/TextResultView.fxml");
                Parent root = FXMLLoader.load(
                        getClass().getResource("/view/TextResultView.fxml"),
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
        if (symptomResult == null) return;

        questionText.setText("Loading questions...");
        optionsBox.getChildren().clear();

        ApiService.fetchQuestions(
                buildQuestionFetchRQ(symptomResult),
                questionsRS -> Platform.runLater(() -> {
                    selectedAnswers.clear();
                    setQuestions(questionsRS);
                }),
                errorMsg -> Platform.runLater(() -> {
                    DialogManager.errorDialog("Connection Error",
                            "Could not load questions", errorMsg);
                    QuestionsRS prev = NavBarManager.getQuestionsRS();
                    if (prev != null) {
                        selectedAnswers.clear();
                        setQuestions(prev);
                    }
                })
        );
    }

    private QuestionFetchRQ buildQuestionFetchRQ(TextResultRS textResultRS) {
        QuestionFetchRQ rq = new QuestionFetchRQ();
        rq.setSymptoms(textResultRS.getSymptomsEn());
        return rq;
    }

    private String getLevelStyle(int index, int total) {
        if (total <= 1) return "option-level-0";
        if (total == 2) return index == 0 ? "option-level-0" : "option-level-1";
        int level = Math.round((float) index / (total - 1) * 4);
        return "option-level-" + level;
    }
}
