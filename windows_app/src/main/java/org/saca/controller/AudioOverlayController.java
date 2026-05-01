package org.saca.controller;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.layout.StackPane;
import org.saca.service.AudioService;

import java.net.URL;
import java.util.ResourceBundle;

public class AudioOverlayController implements Initializable {

    @FXML
    private StackPane audioOverlayRoot;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
    }

    public void play(String base64Wav) {
        if (base64Wav == null || base64Wav.isBlank()) return;

        show();

        AudioService.playBase64Wav(
                base64Wav,
                err -> {          // ErrorCallback
                    System.err.println("Audio error: " + err);
                    hide();
                },
                this::hide
        );
    }

    public void stopAndHide() {
        AudioService.stop();
        hide();
    }

    public boolean isPlaying() {
        return AudioService.isPlaying();
    }

    @FXML
    private void handleCancel() {
        AudioService.stop();
        hide();
    }

    private void show() {
        audioOverlayRoot.setVisible(true);
        audioOverlayRoot.setManaged(true);
    }

    private void hide() {
        audioOverlayRoot.setVisible(false);
        audioOverlayRoot.setManaged(false);
    }
}
