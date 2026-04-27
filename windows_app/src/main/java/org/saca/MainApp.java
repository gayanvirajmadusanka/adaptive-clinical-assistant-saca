package org.saca;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;

public class MainApp extends Application {

    public static final double APP_WIDTH = 1000;

    public static final double APP_HEIGHT = 650;

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        FXMLLoader loader = new FXMLLoader(
                getClass().getResource("/view/MainView.fxml")
        );

        Parent root = loader.load();

        // Fixed size scene
        Scene scene = new Scene(
                root,
                APP_WIDTH,
                APP_HEIGHT
        );

        stage.setTitle("SACA - Adaptive Clinical Assistant");

        // App icon
        stage.getIcons().add(
                new Image(getClass().getResourceAsStream("/images/app-logo.png"))
        );

        scene.getStylesheets().add(
                getClass().getResource("/styles/style.css").toExternalForm()
        );

        stage.setScene(scene);
        stage.setResizable(false);
        stage.show();
    }
}
