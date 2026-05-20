package org.saca.controller;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import org.saca.model.body.BodyPart;
import org.saca.model.body.BodyPartsData;
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
    private FlowPane symptomCardsBox;

    @FXML
    private Button confirmBtn;

    private BodyPart part;

    private Stage stage;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        String partKey = CacheManager.getCachedBodyPartKey();

        if (partKey != null && !partKey.isEmpty()) {
            BodyPart cached = BodyPartsData.get(partKey);
            if (cached != null) {
                CacheManager.clearCachedBodySymptomIds();
                CacheManager.clearCachedBodySymptomLabels();
                setPart(cached);
            }
        }
    }

    public void setPart(BodyPart part) {
        this.part = part;
        String key = part.getId().equals("whole_body") ? "general" : part.getId();
        CacheManager.setCachedBodyPartKey(key);
        partNameLabel.setText(part.getLabel());
        buildSymptomCards();
    }

    private void buildSymptomCards() {
        symptomCardsBox.getChildren().clear();
        selectedIds.clear();
        selectedLabels.clear();

        List<String> restoredIds = CacheManager.getCachedBodySymptomIds();
        String gender = CacheManager.isSelectedGenderMale() ? "male" : "female";
        String other = gender.equals("male") ? "female" : "male";
        String partKey = part.getId().equals("whole_body") ? "general" : part.getId();

        for (BodySymptom symptom : part.getSymptoms()) {

            // Card container
            VBox card = new VBox(8);
            card.setAlignment(Pos.TOP_CENTER);
            card.getStyleClass().add("symptom-card");
            card.setPrefWidth(190);
            card.setMaxWidth(190);

            // Image
            String key = part.getId().equals("general") ? "whole_body" : part.getId();

            URL imageUrl = resolveImage(key, symptom.getId(), gender, other);
            ImageView imageView = new ImageView();
            imageView.setFitWidth(168);
            imageView.setFitHeight(140);
            imageView.setPreserveRatio(true);
            imageView.getStyleClass().add("symptom-part-image");

            if (imageUrl != null) {
                imageView.setImage(new Image(imageUrl.toExternalForm(), true));
            } else {
                System.out.println("[BodySymptoms] Missing image: /images/body_parts/"
                        + partKey + "/" + symptom.getId() + "_" + gender + ".png");
            }

            // Button
            Button btn = new Button(symptom.getLabel());
            btn.getStyleClass().add("symptom-select-btn");
            btn.setMaxWidth(Double.MAX_VALUE);
            btn.setWrapText(true);

            if (restoredIds != null && restoredIds.contains(symptom.getId())) {
                selectedIds.add(symptom.getId());

                if (LanguageManager.isLanguageEnglish()) {
                    selectedLabels.add(symptom.getLabelEn());
                } else {
                    selectedLabels.add(symptom.getLabelWp());
                }

                btn.getStyleClass().add("symptom-select-btn-active");
                imageView.setOpacity(1.0);
            } else {
                imageView.setOpacity(0.85);
            }

            btn.setOnAction(e -> {
                if (selectedIds.contains(symptom.getId())) {
                    selectedIds.remove(symptom.getId());

                    if (LanguageManager.isLanguageEnglish()) {
                        selectedLabels.remove(symptom.getLabelEn());
                    } else {
                        selectedLabels.remove(symptom.getLabelWp());
                    }

                    btn.getStyleClass().remove("symptom-select-btn-active");
                    imageView.setOpacity(0.85);
                } else {
                    selectedIds.add(symptom.getId());

                    if (LanguageManager.isLanguageEnglish()) {
                        selectedLabels.add(symptom.getLabelEn());
                    } else {
                        selectedLabels.add(symptom.getLabelWp());
                    }

                    btn.getStyleClass().add("symptom-select-btn-active");
                    imageView.setOpacity(1.0);
                }
            });

            String audioFile = symptom.getAudio();
            ImageView spkIcon = new ImageView(new Image(
                    getClass().getResource("/icons/speaker.png").toExternalForm()));
            spkIcon.setFitWidth(16);
            spkIcon.setFitHeight(16);
            spkIcon.setPreserveRatio(true);
            Button spkBtn = new Button();
            spkBtn.setGraphic(spkIcon);
            spkBtn.getStyleClass().add("body-speaker-btn");
            spkBtn.setOnAction(e -> {
                if (AudioService.isPlaying()) {
                    AudioService.stop();
                    spkIcon.setImage(new Image(getClass().getResource("/icons/speaker.png").toExternalForm()));
                } else {
                    try {
                        URL aUrl = getClass().getResource("/audio/symptoms/" + audioFile);
                        if (aUrl == null) return;
                        String b64 = Base64.getEncoder().encodeToString(aUrl.openStream().readAllBytes());
                        spkIcon.setImage(new Image(getClass().getResource("/icons/mute.png").toExternalForm()));
                        AudioService.playBase64Wav(b64,
                                err -> Platform.runLater(() -> spkIcon.setImage(new Image(getClass().getResource("/icons/speaker.png").toExternalForm()))),
                                () -> Platform.runLater(() -> spkIcon.setImage(new Image(getClass().getResource("/icons/speaker.png").toExternalForm()))));
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }
            });
            javafx.scene.layout.HBox btnRow = new javafx.scene.layout.HBox(8);
            btnRow.setAlignment(Pos.CENTER_LEFT);
            btn.setMaxWidth(Double.MAX_VALUE);
            javafx.scene.layout.HBox.setHgrow(btn, javafx.scene.layout.Priority.ALWAYS);
            btnRow.getChildren().addAll(btn, spkBtn);
            card.getChildren().addAll(imageView, btnRow);
            symptomCardsBox.getChildren().add(card);
        }
    }

    private URL resolveImage(String partKey, String symptomId, String gender, String other) {
        String[] paths = {
                "/images/body_parts/" + partKey + "/" + symptomId + "_" + gender + ".png",
                "/images/body_parts/" + partKey + "/" + symptomId + "_" + other + ".png",
                "/images/body_parts/" + partKey + "/" + symptomId + ".png",
                "/images/body_parts/" + partKey + "/" + partKey + "_" + gender + ".png",
                "/images/body_parts/" + partKey + "/" + partKey + "_" + other + ".png",
                "/images/body_parts/" + partKey + "/" + partKey + ".png",
        };
        for (String path : paths) {
            URL url = getClass().getResource(path);
            if (url != null) {
                return url;
            }
        }
        return null;
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
            URL url = getClass().getResource("/audio/body_parts/" + part.getAudio());

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

        String key = part.getId().equals("whole_body") ? "general" : part.getId();
        CacheManager.setCachedBodyPartKey(key);
        CacheManager.setCachedBodySymptomIds(new ArrayList<>(selectedIds));
        CacheManager.setCachedBodySymptomLabels(new ArrayList<>(selectedLabels));

        stage = (Stage) confirmBtn.getScene().getWindow();
        TextInputRQ inputRQ = new TextInputRQ();
        inputRQ.setText(String.join(", ", selectedLabels));

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
            NavBarManager.setCurrentView("/view/BodyResultView.fxml");
            CacheManager.setTextResultRS(result);
            CacheManager.setCachedSymptomsEn(result.getSymptomsEn());
            CacheManager.setIsTextResultLoadFromShow(true);

            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/BodyResultView.fxml"),
                    LanguageManager.getBundle());
            Parent view = loader.load();
            ((BodyResultController) loader.getController()).setSymptomResult(result);
            stage.getScene().setRoot(view);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void handleBack(ActionEvent event) {
        AudioService.stop();
        CacheManager.clearCachedBodyPartKey();
        CacheManager.clearCachedBodySymptomIds();
        CacheManager.clearCachedBodySymptomLabels();

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
