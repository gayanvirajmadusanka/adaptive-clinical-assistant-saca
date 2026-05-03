package org.saca.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.Button;
import javafx.scene.control.Tooltip;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.util.Duration;
import org.saca.service.AudioService;
import org.saca.utility.constant.AppsConstants;
import org.saca.utility.manager.DialogManager;
import org.saca.utility.manager.LanguageManager;
import org.saca.utility.manager.NavBarManager;

import java.net.URL;
import java.util.ResourceBundle;

public class SidebarController implements Initializable {

    // Sidebar width
    private static final double SIDEBAR_WIDTH = 280;

    private static final double COLLAPSED_WIDTH = 60;

    @FXML
    private StackPane sidebarWrapper;

    @FXML
    private VBox sidebarRoot;

    @FXML
    private Button expandBtn;

    @FXML
    private Tooltip sidebarTooltip;

    private Tooltip expandTooltip;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        expandTooltip = buildTooltip(LanguageManager.get("show_sidebar"));
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

    private void applyState(boolean visible) {
        // Show/hide the sidebar VBox
        sidebarRoot.setVisible(visible);
        sidebarRoot.setManaged(visible);

        // Show/hide the expand button (opposite of sidebar)
        expandBtn.setVisible(!visible);
        expandBtn.setManaged(!visible);

        // Update tooltip text
        sidebarTooltip.setText(visible ?
                LanguageManager.get("hide_sidebar") :
                LanguageManager.get("show_sidebar"));

        double width = visible ? SIDEBAR_WIDTH : COLLAPSED_WIDTH;
        sidebarWrapper.setMinWidth(width);
        sidebarWrapper.setPrefWidth(width);
        sidebarWrapper.setMaxWidth(width);
    }

    @FXML
    private void toggleSidebar() {
        boolean isVisible = sidebarRoot.isVisible();

        NavBarManager.setIsNavBarVisible(!isVisible
                ? AppsConstants.YesNo.Y
                : AppsConstants.YesNo.N);

        applyState(!isVisible);
    }

    @FXML
    public void handleLanguageClick(ActionEvent event) {
        try {
            AudioService.stop();

            boolean isEnglish = LanguageManager.getBundle()
                    .getLocale().getLanguage()
                    .equals(AppsConstants.AppLanguage.EN.getShortDescription());

            String title = LanguageManager.get("change_language");
            String headerText = LanguageManager.get("change_language_to").concat(" ")
                    + (isEnglish
                    ? AppsConstants.AppLanguage.WP.getLongDescription()
                    : AppsConstants.AppLanguage.EN.getLongDescription()) + "?";
            String contentText = LanguageManager.get("are_you_sure_want_to_change_language");

            if (DialogManager.confirmDialog(title, headerText, contentText)) {
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
        AudioService.stop();

        if (DialogManager.confirmExit()) {
            System.exit(0);
        }
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
        AudioService.stop();

        try {
            NavBarManager.setCurrentView("/view/DashboardView.fxml");

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
