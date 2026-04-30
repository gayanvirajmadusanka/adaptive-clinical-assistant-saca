package org.saca.utility.manager;

import javafx.scene.control.Alert;
import javafx.scene.control.ButtonType;

import java.util.Optional;

public class DialogManager {

    private static final String CSS_PATH = "/styles/style.css";

    private static final String CSS_CLASS = "exit-dialog";

    public static boolean confirmDialog(String title, String header, String content) {
        Alert alert = build(Alert.AlertType.CONFIRMATION, title, header, content);
        Optional<ButtonType> result = alert.showAndWait();
        return result.isPresent() && result.get() == ButtonType.OK;
    }

    public static boolean errorDialog(String title, String header, String content) {
        Alert alert = build(Alert.AlertType.ERROR, title, header, content);
        Optional<ButtonType> result = alert.showAndWait();
        return result.isPresent() && result.get() == ButtonType.OK;
    }

    public static void infoDialog(String title, String header, String content) {
        Alert alert = build(Alert.AlertType.INFORMATION, title, header, content);
        alert.showAndWait();
    }

    public static void warningDialog(String title, String header, String content) {
        Alert alert = build(Alert.AlertType.WARNING, title, header, content);
        alert.showAndWait();
    }

    /**
     * Show exit confirmation using bundle keys.
     *
     * @return true if user confirmed exit.
     */
    public static boolean confirmExit() {
        return confirmDialog(
                LanguageManager.get("close_saca"),
                LanguageManager.get("close_saca_q"),
                LanguageManager.get("are_you_sure_want_to_exit")
        );
    }

    /**
     * Show language change confirmation using bundle keys.
     *
     * @param targetLanguage the language name to show in the header
     * @return true if user confirmed language change.
     */
    public static boolean confirmLanguageChange(String targetLanguage) {
        return confirmDialog(
                LanguageManager.get("change_lang_title"),
                LanguageManager.get("change_lang_header", targetLanguage),
                LanguageManager.get("change_lang_content")
        );
    }

    /**
     * Show a "no symptoms detected" warning.
     */
    public static void noSymptomsDetected(String detail) {
        warningDialog(
                "No Symptoms Detected",
                "We could not identify specific symptoms",
                detail + "\n\nPlease try to be more descriptive."
        );
    }

    /**
     * Show a connection/API error.
     */
    public static void apiError(String detail) {
        warningDialog(
                "Connection Error",
                "Could not reach the symptom detection service",
                detail
        );
    }

    private static Alert build(Alert.AlertType type,
                               String title,
                               String header,
                               String content) {
        Alert alert = new Alert(type);
        alert.setTitle(title);
        alert.setHeaderText(header);
        alert.setContentText(content);

        // Apply shared CSS styling
        alert.getDialogPane().getStylesheets().add(
                DialogManager.class
                        .getResource(CSS_PATH)
                        .toExternalForm()
        );
        alert.getDialogPane().getStyleClass().add(CSS_CLASS);

        return alert;
    }
}
