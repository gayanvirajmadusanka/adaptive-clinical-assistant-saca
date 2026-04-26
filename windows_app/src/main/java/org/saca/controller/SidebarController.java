package org.saca.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.control.Tooltip;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.util.Duration;
import org.saca.utility.constant.AppsConstants;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;

import java.net.URL;
import java.util.ResourceBundle;

public class SidebarController implements Initializable {

    // Sidebar width
    private static final double SIDEBAR_WIDTH = 280;

    private static final double COLLAPSED_WIDTH = 60;

    @FXML
    private StackPane sidebarWrapper;   // the root StackPane
    @FXML
    private VBox sidebarRoot;      // the actual sidebar panel
    @FXML
    private Button expandBtn;        // floating expand icon
    @FXML
    private Tooltip sidebarTooltip;  // tooltip on the hide button
    private Tooltip expandTooltip;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        expandTooltip = buildTooltip("Show sidebar");
        Tooltip.install(expandBtn, expandTooltip);

        // Restore sidebar state from NavBarManager on every screen load
        applyState(NavBarManager.getIsNavBarVisible() == AppsConstants.YesNo.Y);
    }

    /**
     * Returns the root StackPane — parent controllers use this
     * to get the Scene without needing a rootPane fx:id.
     */
    public StackPane getRoot() {
        return sidebarWrapper;
    }

    /**
     * Returns current sidebar panel visibility.
     */
    public boolean isSidebarVisible() {
        return sidebarRoot.isVisible();
    }

    /**
     * Apply a specific visibility state programmatically.
     */
    public void setSidebarVisible(boolean visible) {
        applyState(visible);
    }

    /* ── Internal apply ── */
    private void applyState(boolean visible) {
        // Show/hide the sidebar VBox
        sidebarRoot.setVisible(visible);
        sidebarRoot.setManaged(visible);

        // Show/hide the expand button (opposite of sidebar)
        expandBtn.setVisible(!visible);
        expandBtn.setManaged(!visible);

        // Update tooltip text
        sidebarTooltip.setText(visible ? "Hide sidebar" : "Show sidebar");

        // KEY FIX: when hidden, shrink to COLLAPSED_WIDTH (not 0)
        // so the expand button still has space to render inside the StackPane
        double width = visible ? SIDEBAR_WIDTH : COLLAPSED_WIDTH;
        sidebarWrapper.setMinWidth(width);
        sidebarWrapper.setPrefWidth(width);
        sidebarWrapper.setMaxWidth(width);
    }

    @FXML
    private void toggleSidebar() {
        boolean isVisible = sidebarRoot.isVisible();

        // Persist new state globally so other screens pick it up on load
        NavBarManager.setIsNavBarVisible(!isVisible
                ? AppsConstants.YesNo.Y
                : AppsConstants.YesNo.N);

        applyState(!isVisible);
    }

    @FXML
    public void handleLanguageClick(ActionEvent event) {
        try {
            boolean isEnglish = LanguageManager.getBundle()
                    .getLocale().getLanguage()
                    .equals(AppsConstants.AppLanguage.EN.getShortDescription());

            Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
            alert.setTitle(LanguageManager.get("change_language"));
            alert.setHeaderText(LanguageManager.get("change_language_to").concat(" ")
                    + (isEnglish
                    ? AppsConstants.AppLanguage.WP.getLongDescription()
                    : AppsConstants.AppLanguage.EN.getLongDescription()) + "?");
            alert.setContentText(LanguageManager.get("are_you_sure_want_to_change_language"));
            alert.getDialogPane().getStylesheets().add(
                    getClass().getResource("/styles/style.css").toExternalForm());
            alert.getDialogPane().getStyleClass().add("exit-dialog");

            if (alert.showAndWait().get().getText().equals("OK")) {
                LanguageManager.setLanguage(isEnglish
                        ? AppsConstants.AppLanguage.WP.getShortDescription()
                        : AppsConstants.AppLanguage.EN.getShortDescription());

                String currentFxml = NavBarManager.getCurrentView();

                Parent root = FXMLLoader.load(
                        getClass().getResource(currentFxml),
                        LanguageManager.getBundle()
                );
                Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
                stage.getScene().setRoot(root);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void handleExit() {
        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle(LanguageManager.get("close_saca"));
        alert.setHeaderText(LanguageManager.get("close_saca_q"));
        alert.setContentText(LanguageManager.get("are_you_sure_want_to_exit"));
        alert.getDialogPane().getStylesheets().add(
                getClass().getResource("/styles/style.css").toExternalForm());
        alert.getDialogPane().getStyleClass().add("exit-dialog");

        alert.showAndWait().ifPresent(response -> {
            if (response == ButtonType.OK) System.exit(0);
        });
    }

    private Tooltip buildTooltip(String text) {
        Tooltip tip = new Tooltip(text);
        tip.setShowDelay(Duration.millis(200));
        tip.setHideDelay(Duration.millis(100));
        tip.setShowDuration(Duration.seconds(5));
        return tip;
    }

    @FXML
    public void handleHomeClick(ActionEvent event) {
        try {
            Parent root = FXMLLoader.load(
                    getClass().getResource("/view/DashboardView.fxml"),
                    LanguageManager.getBundle()
            );

            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.getScene().setRoot(root);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
