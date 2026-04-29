package org.saca.controller;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.*;
import javafx.stage.Stage;
import javafx.util.Duration;
import org.saca.model.response.OptionRS;
import org.saca.model.response.QuestionRS;
import org.saca.model.response.QuestionsRS;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;

import java.net.URL;
import java.util.*;

public class TellUsMoreTextController implements Initializable {

    private final Map<String, String> selectedAnswers = new HashMap<>();

    private final Map<String, List<Button>> optionButtonsMap = new HashMap<>();

    private final Map<String, Label> selectedLabelMap = new HashMap<>();

    private final Map<String, Boolean> expandedMap = new HashMap<>();

    @FXML
    private SidebarController sidebarController;

    @FXML
    private GridPane questionsGrid;

    private QuestionsRS questionsRS;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        QuestionsRS saved = NavBarManager.getQuestionsRS();
        if (saved != null) setQuestions(saved);
    }

    public void setQuestions(QuestionsRS questionsRS) {
        this.questionsRS = questionsRS;
        NavBarManager.setQuestionsRS(questionsRS);
        buildQuestionCards(questionsRS.getQuestions());
    }

    private void buildQuestionCards(List<QuestionRS> questions) {
        questionsGrid.getChildren().clear();
        selectedAnswers.clear();
        optionButtonsMap.clear();
        selectedLabelMap.clear();
        expandedMap.clear();

        for (int i = 0; i < questions.size(); i++) {
            VBox card = buildCard(questions.get(i));
            GridPane.setColumnIndex(card, i % 2);
            GridPane.setRowIndex(card, i / 2);
            questionsGrid.getChildren().add(card);
        }
    }

    private VBox buildCard(QuestionRS question) {
        String qId = question.getId();

        VBox card = new VBox(8);
        card.getStyleClass().add("question-card");

        Button toggleBtn = new Button("▲");
        toggleBtn.getStyleClass().add("card-toggle-btn");

        Label questionText = new Label(question.getText());
        questionText.getStyleClass().add("question-text");
        questionText.setWrapText(true);
        questionText.setMaxWidth(Double.MAX_VALUE);
        HBox.setHgrow(questionText, Priority.ALWAYS);

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.NEVER);

        HBox headerRow = new HBox(8);
        headerRow.setAlignment(Pos.TOP_LEFT);
        headerRow.getChildren().addAll(questionText, toggleBtn);

        VBox.setVgrow(headerRow, Priority.NEVER);
        HBox.setHgrow(questionText, Priority.ALWAYS);

        Label selectedLabel = new Label("");
        selectedLabel.getStyleClass().add("card-selected-label");
        selectedLabel.setWrapText(true);
        selectedLabel.setMaxWidth(Double.MAX_VALUE);
        selectedLabel.setVisible(false);
        selectedLabel.setManaged(false);
        selectedLabelMap.put(qId, selectedLabel);

        List<Button> optionButtons = new ArrayList<>();
        List<OptionRS> options = question.getOptions();
        for (int i = 0; i < options.size(); i++) {
            Button btn = buildOptionButton(options.get(i), i, options.size(), qId);
            optionButtons.add(btn);
        }
        optionButtonsMap.put(qId, optionButtons);
        expandedMap.put(qId, true);

        toggleBtn.setOnAction(e -> toggleCard(qId, toggleBtn));

        card.getChildren().add(headerRow);
        card.getChildren().add(selectedLabel);
        card.getChildren().addAll(optionButtons);

        return card;
    }

    private void toggleCard(String questionId, Button toggleBtn) {
        boolean isExpanded = expandedMap.getOrDefault(questionId, true);
        List<Button> buttons = optionButtonsMap.get(questionId);
        Label selectedLabel = selectedLabelMap.get(questionId);

        if (isExpanded) {
            buttons.forEach(b -> {
                b.setVisible(false);
                b.setManaged(false);
            });

            String selectedId = selectedAnswers.get(questionId);
            if (selectedId != null && selectedLabel != null) {
                String selectedText = buttons.stream()
                        .filter(b -> selectedId.equals(b.getUserData()))
                        .map(b -> b.getText().replace("  ●  ", "").trim())
                        .findFirst().orElse("");
                selectedLabel.setText("✔  " + selectedText);
                selectedLabel.setVisible(true);
                selectedLabel.setManaged(true);
            }

            toggleBtn.setText("▼");
            expandedMap.put(questionId, false);

        } else {
            buttons.forEach(b -> {
                b.setVisible(true);
                b.setManaged(true);
            });

            if (selectedLabel != null) {
                selectedLabel.setVisible(false);
                selectedLabel.setManaged(false);
            }

            toggleBtn.setText("▲");
            expandedMap.put(questionId, true);
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
            selectOption(questionId, option.getId(), btn);
            Button toggleBtn = findToggleBtn(btn);
            if (toggleBtn != null) {
                new Timeline(new KeyFrame(
                        Duration.millis(400),
                        ev -> toggleCard(questionId, toggleBtn)
                )).play();
            }
        });

        return btn;
    }

    private void selectOption(String questionId, String optionId, Button clicked) {
        List<Button> buttons = optionButtonsMap.get(questionId);
        if (buttons != null) {
            buttons.forEach(b -> b.getStyleClass().remove("option-btn-selected"));
        }
        clicked.getStyleClass().add("option-btn-selected");
        selectedAnswers.put(questionId, optionId);
    }

    private Button findToggleBtn(Button optionBtn) {
        try {
            VBox card = (VBox) optionBtn.getParent();
            HBox header = (HBox) card.getChildren().get(0);
            return header.getChildren().stream()
                    .filter(n -> n instanceof Button)
                    .map(n -> (Button) n)
                    .findFirst().orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    @FXML
    private void handleContinue() {
        if (questionsRS != null) {
            long unanswered = questionsRS.getQuestions().stream()
                    .filter(q -> !selectedAnswers.containsKey(q.getId()))
                    .count();
            if (unanswered > 0) {
                DialogManager.warningDialog(
                        "Incomplete",
                        "Please answer all questions",
                        unanswered + " question(s) still need an answer."
                );
                return;
            }
        }
        System.out.println("Answers: " + selectedAnswers);
    }

    @FXML
    private void handleBack(ActionEvent event) {
        try {
            NavBarManager.setCurrentView("/view/TextResultView.fxml");
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/TextResultView.fxml"),
                    LanguageManager.getBundle()
            );
            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.getScene().setRoot(root);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String getLevelStyle(int index, int total) {
        if (total <= 1) return "option-level-0";
        int level = Math.round((float) index / (total - 1) * 4);
        return "option-level-" + level;
    }
}
