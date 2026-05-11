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
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import org.saca.model.body.BodyPart;
import org.saca.model.body.BodySymptom;
import org.saca.model.request.TextInputRQ;
import org.saca.model.response.TextResultRS;
import org.saca.service.ApiService;
import org.saca.service.AudioService;
import org.saca.utility.manager.CacheManager;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.ResourceBundle;

public class BodySymptomsController implements Initializable {

    private final List<String> selectedIds = new ArrayList<>();

    private final List<String> selectedLabels = new ArrayList<>();

    @FXML
    private SidebarController sidebarController;

    @FXML
    private Label partNameLabel;

    @FXML
    private Button partSpeakerBtn;

    @FXML
    private ImageView partSpeakerIcon;

    @FXML
    private VBox symptomsListBox;

    @FXML
    private Button confirmBtn;

    private BodyPart part;

    private Stage stage;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
    }

    public void setPart(BodyPart part) {
        this.part = part;
        partNameLabel.setText(part.getLabel());
        buildSymptomsList();
    }

    private void buildSymptomsList() {
        symptomsListBox.getChildren().clear();
        selectedIds.clear();
        selectedLabels.clear();

        List<String> restoredIds = CacheManager.getCachedBodySymptomIds();
        List<String> restoredLabels = CacheManager.getCachedBodySymptomLabels();

        for (BodySymptom symptom : part.getSymptoms()) {
            Button btn = new Button(symptom.getLabel());
            btn.getStyleClass().add("symptom-select-btn");
            btn.setMaxWidth(Double.MAX_VALUE);

            // Restore selection if coming back from result screen
            if (restoredIds != null && restoredIds.contains(symptom.getId())) {
                selectedIds.add(symptom.getId());
                selectedLabels.add(symptom.getLabelEn());
                btn.getStyleClass().add("symptom-select-btn-active");
            }

            btn.setOnAction(e -> {
                if (selectedIds.contains(symptom.getId())) {
                    selectedIds.remove(symptom.getId());
                    selectedLabels.remove(symptom.getLabelEn());
                    btn.getStyleClass().remove("symptom-select-btn-active");
                } else {
                    selectedIds.add(symptom.getId());
                    selectedLabels.add(symptom.getLabelEn());
                    btn.getStyleClass().add("symptom-select-btn-active");
                }
            });

            symptomsListBox.getChildren().add(btn);
        }
    }

    @FXML
    private void handlePartSpeak() {
        if (part == null) {
            return;
        }

        if (AudioService.isPlaying()) {
            AudioService.stop();
            setIcon("/icons/speaker.png");
            return;
        }

        try {
            URL url = getClass().getResource("/audio/" + part.getAudio());
            if (url == null) {
                return;
            }

            String b64 = Base64.getEncoder().encodeToString(url.openStream().readAllBytes());
            setIcon("/icons/mute.png");
            AudioService.playBase64Wav(b64,
                    err -> Platform.runLater(() -> setIcon("/icons/speaker.png")),
                    () -> Platform.runLater(() -> setIcon("/icons/speaker.png")));
        } catch (Exception e) {
            setIcon("/icons/speaker.png");
        }
    }

    @FXML
    private void handleConfirm() {
        if (selectedIds.isEmpty()) {
            DialogManager.warningDialog(
                    LanguageManager.get("no_answer"),
                    LanguageManager.get("please_select_an_answer"),
                    LanguageManager.get("choose_one_of_the_options_before_continuing"));
            return;
        }

        // Save part key and selections, so they are restored when coming back from result
        CacheManager.setCachedBodyPartKey(part.getId().equals("whole_body") ? "general" : part.getId());
        CacheManager.setCachedBodySymptomIds(new ArrayList<>(selectedIds));
        CacheManager.setCachedBodySymptomLabels(new ArrayList<>(selectedLabels));

        stage = (Stage) confirmBtn.getScene().getWindow();
        String symptomText = String.join(", ", selectedLabels);

        TextInputRQ inputRQ = new TextInputRQ();
        inputRQ.setText(symptomText);

        try {
            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/LoadingView.fxml"),
                    LanguageManager.getBundle());
            Parent loadingView = loader.load();
            LoadingController loadingCtrl = loader.getController();
            loadingCtrl.setTitle(LanguageManager.get("loading_symptom_title"));
            loadingCtrl.setDuration(Integer.MAX_VALUE);

            ApiService.detectSymptomsText(inputRQ,
                    result -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        navigateToResult(result);
                    }),
                    err -> Platform.runLater(() -> {
                        loadingCtrl.stop();
                        DialogManager.errorDialog("Connection Error", "Could not process symptoms", err);
                    }));

            stage.getScene().setRoot(loadingView);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void navigateToResult(TextResultRS result) {
        if (result == null || result.getSymptomsEn() == null || result.getSymptomsEn().isEmpty()) {
            showErrorAndReturn("No Results", "No symptoms detected",
                    "Please try selecting different symptoms.");
            return;
        }

        try {
            NavBarManager.setCurrentView("/view/TextResultView.fxml");
            CacheManager.setTextResultRS(result);
            CacheManager.setCachedSymptomsEn(result.getSymptomsEn());
            CacheManager.setIsTextResultLoadFromShow(true);

            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/TextResultView.fxml"),
                    LanguageManager.getBundle());
            Parent view = loader.load();
            ((TextResultController) loader.getController()).setSymptomResult(result);
            stage.getScene().setRoot(view);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void handleBack(ActionEvent event) {
        AudioService.stop();

        // Clear selections
        CacheManager.setCachedBodyPartKey("");
        CacheManager.setCachedBodySymptomIds(new ArrayList<>());
        CacheManager.setCachedBodySymptomLabels(new ArrayList<>());

        try {
            NavBarManager.setCurrentView("/view/BodyInputView.fxml");
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/BodyInputView.fxml"),
                    LanguageManager.getBundle());
            ((Stage) ((Node) event.getSource()).getScene().getWindow()).getScene().setRoot(root);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void setIcon(String path) {
        partSpeakerIcon.setImage(new Image(getClass().getResource(path).toExternalForm()));
    }

    private void showErrorAndReturn(String title, String header, String content) {
        DialogManager.errorDialog(title, header, content);
        try {
            NavBarManager.setCurrentView("/view/BodySymptomsView.fxml");
            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/BodySymptomsView.fxml"),
                    LanguageManager.getBundle());
            Parent root = loader.load();
            BodySymptomsController ctrl = loader.getController();
            if (part != null) ctrl.setPart(part);
            stage.getScene().setRoot(root);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
