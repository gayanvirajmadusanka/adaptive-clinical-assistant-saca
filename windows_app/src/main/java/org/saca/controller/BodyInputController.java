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
import javafx.scene.control.Tooltip;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.shape.Ellipse;
import javafx.stage.Stage;
import javafx.util.Duration;
import org.saca.model.body.BodyPart;
import org.saca.model.body.BodyPartsData;
import org.saca.service.AudioService;
import org.saca.utility.manager.CacheManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;

import java.net.URL;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.ResourceBundle;

public class BodyInputController implements Initializable {

    private static final double[][] ZONES = {
            {0.4973, 0.090, 0.082, 0.060},
            {0.4570, 0.148, 0.026, 0.020},
            {0.5360, 0.148, 0.026, 0.020},
            {0.4960, 0.182, 0.024, 0.018},
            {0.4973, 0.210, 0.036, 0.018},
            {0.4220, 0.145, 0.020, 0.030},
            {0.5720, 0.145, 0.020, 0.030},
            {0.4973, 0.250, 0.040, 0.024},
            {0.4960, 0.385, 0.130, 0.085},
            {0.4938, 0.510, 0.115, 0.070},
            {0.3440, 0.450, 0.036, 0.090},
            {0.6480, 0.450, 0.036, 0.090},
            {0.4305, 0.710, 0.042, 0.065},
            {0.5640, 0.710, 0.042, 0.065},
    };

    private static final String[] ZONE_KEYS = {
            "head", "eye", "eye", "nose", "jaw",
            "ear", "ear", "throat", "chest", "stomach",
            "arm", "arm", "general", "general"
    };

    private static final String[] ZONE_LABELS = {
            "Head", "Eye (left)", "Eye (right)", "Nose", "Jaw / Mouth",
            "Ear (left)", "Ear (right)", "Throat / Neck", "Chest", "Stomach",
            "Arm (left)", "Arm (right)", "Leg (left)", "Leg (right)"
    };

    @FXML
    private SidebarController sidebarController;
    @FXML
    private StackPane bodyImagePane;
    @FXML
    private ImageView bodyImage;
    @FXML
    private Pane zonesPane;
    @FXML
    private VBox partsListBox;
    @FXML
    private Button maleBtn;
    @FXML
    private Button femaleBtn;

    private boolean isMale = true;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        // Restore gender from cache
        isMale = CacheManager.isSelectedGenderMale();

        // Sync toggle button styles to restored gender
        if (isMale) {
            maleBtn.getStyleClass().setAll("gender-btn-header", "gender-btn-header-active");
            femaleBtn.getStyleClass().setAll("gender-btn-header");
            bodyImage.setImage(new Image(
                    getClass().getResource("/images/male_image.png").toExternalForm()));
        } else {
            femaleBtn.getStyleClass().setAll("gender-btn-header", "gender-btn-header-active");
            maleBtn.getStyleClass().setAll("gender-btn-header");
            bodyImage.setImage(new Image(
                    getClass().getResource("/images/female_image.png").toExternalForm()));
        }

        buildPartsList();
        bodyImagePane.layoutBoundsProperty().addListener((obs, o, n) -> {
            if (n.getWidth() > 10) buildZones();
        });
    }

    private void buildZones() {
        zonesPane.getChildren().clear();

        double paneW = bodyImagePane.getWidth();
        double paneH = bodyImagePane.getHeight();
        double imgW = bodyImage.getBoundsInParent().getWidth();
        double imgH = bodyImage.getBoundsInParent().getHeight();
        double offX = (paneW - imgW) / 2.0;
        double offY = (paneH - imgH) / 2.0;

        for (int i = 0; i < ZONES.length; i++) {
            double[] z = ZONES[i];
            String key = ZONE_KEYS[i];
            String label = ZONE_LABELS[i];

            double cx = offX + z[0] * imgW;
            double cy = offY + z[1] * imgH;
            double rx = z[2] * imgW;
            double ry = z[3] * imgH;

            Ellipse zone = new Ellipse(cx, cy, rx, ry);
            zone.setFill(Color.TRANSPARENT);
            zone.setStroke(Color.TRANSPARENT);
            zone.setCursor(javafx.scene.Cursor.HAND);

            Tooltip tip = new Tooltip(label);
            tip.setShowDelay(Duration.millis(200));
            tip.setStyle(
                    "-fx-font-family: 'Kreon', Georgia, serif;" +
                            "-fx-font-size: 14px; -fx-font-weight: bold;" +
                            "-fx-background-color: #3a2a1a;" +
                            "-fx-text-fill: #f5ead4;" +
                            "-fx-padding: 6 14 6 14;" +
                            "-fx-background-radius: 10;"
            );
            Tooltip.install(zone, tip);

            zone.setOnMouseEntered(e -> {
                zone.setFill(Color.web("#C0392B", 0.22));
                zone.setStroke(Color.web("#e74c3c"));
                zone.setStrokeWidth(2.5);
                zone.getStrokeDashArray().setAll(7.0, 4.0);
            });
            zone.setOnMouseExited(e -> {
                zone.setFill(Color.TRANSPARENT);
                zone.setStroke(Color.TRANSPARENT);
            });

            final String finalKey = key;
            zone.setOnMouseClicked(e -> openSymptoms(finalKey));

            zonesPane.getChildren().add(zone);
        }
    }

    private void buildPartsList() {
        partsListBox.getChildren().clear();

        List<BodyPart> parts = new ArrayList<>(BodyPartsData.getAllParts().values());

        for (int i = 0; i < parts.size(); i += 2) {
            HBox rowPair = new HBox(8);
            rowPair.setMaxWidth(Double.MAX_VALUE);

            rowPair.getChildren().add(buildPartCard(parts.get(i)));
            if (i + 1 < parts.size()) {
                rowPair.getChildren().add(buildPartCard(parts.get(i + 1)));
            } else {
                Region filler = new Region();
                HBox.setHgrow(filler, Priority.ALWAYS);
                rowPair.getChildren().add(filler);
            }

            partsListBox.getChildren().add(rowPair);
        }
    }

    private HBox buildPartCard(BodyPart part) {
        String key = part.getId().equals("whole_body") ? "general" : part.getId();

        HBox row = new HBox(8);
        row.getStyleClass().add("body-part-row");
        row.setAlignment(Pos.CENTER_LEFT);
        row.setCursor(javafx.scene.Cursor.HAND);
        HBox.setHgrow(row, Priority.ALWAYS);
        row.setMaxWidth(Double.MAX_VALUE);
        row.setMinWidth(0);

        Label name = new Label(part.getLabel());
        name.getStyleClass().add("body-part-name");
        name.setWrapText(true);
        name.setEllipsisString("…");
        name.setMinWidth(0);
        name.setMaxWidth(Double.MAX_VALUE);
        name.setTextOverrun(javafx.scene.control.OverrunStyle.ELLIPSIS);
        HBox.setHgrow(name, Priority.ALWAYS);

        ImageView speakerIcon = new ImageView(
                new Image(getClass().getResource("/icons/speaker.png").toExternalForm()));
        speakerIcon.setFitWidth(16);
        speakerIcon.setFitHeight(16);
        speakerIcon.setPreserveRatio(true);

        Button spkBtn = new Button();
        spkBtn.getStyleClass().add("body-speaker-btn");
        spkBtn.setGraphic(speakerIcon);
        spkBtn.setOnAction(e -> {
            e.consume();
            playAudio(part, speakerIcon);
        });

        Tooltip rowTip = new Tooltip("Tap to see " + part.getLabelEn() + " symptoms");
        rowTip.setShowDelay(Duration.millis(300));
        rowTip.setStyle(
                "-fx-font-family: 'Kreon', Georgia, serif;" +
                        "-fx-font-size: 13px;" +
                        "-fx-background-color: #3a2a1a;" +
                        "-fx-text-fill: #f5ead4;" +
                        "-fx-padding: 5 12 5 12;" +
                        "-fx-background-radius: 8;"
        );
        Tooltip.install(row, rowTip);

        row.setOnMouseClicked(e -> openSymptoms(key));
        row.getChildren().addAll(name, spkBtn);
        return row;
    }

    private void playAudio(BodyPart part, ImageView icon) {
        if (AudioService.isPlaying()) {
            AudioService.stop();
            Platform.runLater(() -> setIcon(icon, "/icons/speaker.png"));
            return;
        }

        try {
            URL audioURL = getClass().getResource("/audio/body_parts/" + part.getAudio());
            if (audioURL == null) return;
            String b64 = Base64.getEncoder().encodeToString(audioURL.openStream().readAllBytes());
            setIcon(icon, "/icons/mute.png");

            AudioService.playBase64Wav(b64,
                    err -> Platform.runLater(() -> setIcon(icon, "/icons/speaker.png")),
                    () -> Platform.runLater(() -> setIcon(icon, "/icons/speaker.png")));
        } catch (Exception e) {
            setIcon(icon, "/icons/speaker.png");
        }
    }

    private void setIcon(ImageView imageView, String path) {
        imageView.setImage(new Image(getClass().getResource(path).toExternalForm()));
    }

    private void openSymptoms(String partKey) {
        BodyPart part = BodyPartsData.get(partKey);
        if (part == null) return;
        AudioService.stop();
        try {
            NavBarManager.setCurrentView("/view/BodySymptomsView.fxml");
            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/BodySymptomsView.fxml"),
                    LanguageManager.getBundle());
            Parent view = loader.load();
            ((BodySymptomsController) loader.getController()).setPart(part);
            zonesPane.getScene().getWindow().getScene().setRoot(view);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void handleMale() {
        isMale = true;
        CacheManager.setSelectedGenderMale(true);
        maleBtn.getStyleClass().setAll("gender-btn-header", "gender-btn-header-active");
        femaleBtn.getStyleClass().setAll("gender-btn-header");
        bodyImage.setImage(new Image(
                getClass().getResource("/images/male_image.png").toExternalForm()));
        buildZones();
    }

    @FXML
    private void handleFemale() {
        isMale = false;
        CacheManager.setSelectedGenderMale(false);
        femaleBtn.getStyleClass().setAll("gender-btn-header", "gender-btn-header-active");
        maleBtn.getStyleClass().setAll("gender-btn-header");
        bodyImage.setImage(new Image(
                getClass().getResource("/images/female_image.png").toExternalForm()));
        buildZones();
    }

    @FXML
    private void handleBack(ActionEvent event) {
        AudioService.stop();
        try {
            NavBarManager.setCurrentView("/view/DashboardView.fxml");
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/DashboardView.fxml"),
                    LanguageManager.getBundle());
            ((Stage) ((Node) event.getSource()).getScene().getWindow()).getScene().setRoot(root);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
