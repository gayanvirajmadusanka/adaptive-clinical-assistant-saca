package org.saca;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.image.Image;
import javafx.stage.Stage;
import org.saca.controller.LoadingController;
import org.saca.utility.manager.LanguageManager;

import java.io.File;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.ResourceBundle;

public class MainApp extends Application {

    public static final double APP_WIDTH = 1000;

    public static final double APP_HEIGHT = 650;

    private static final String BACKEND_HEALTH_URL = "http://127.0.0.1:8000/questions";

    private static final int POLL_INTERVAL_MS = 500;

    private static final int POLL_TIMEOUT_MS = 60_000;

    private Process backendProcess;

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        stage.setTitle("SACA - Adaptive Clinical Assistant");
        stage.getIcons().add(new Image(getClass().getResourceAsStream("/images/app-logo.png")));
        stage.setResizable(false);

        ResourceBundle bundle = LanguageManager.getBundle();

        FXMLLoader loadingLoader = new FXMLLoader(
                getClass().getResource("/view/LoadingView.fxml"), bundle);
        Parent loadingRoot = loadingLoader.load();
        LoadingController loadingCtrl = loadingLoader.getController();
        loadingCtrl.setTitle("Starting SACA...");
        loadingCtrl.setDuration(Integer.MAX_VALUE);

        Scene loadingScene = new Scene(loadingRoot, APP_WIDTH, APP_HEIGHT);
        loadingScene.getStylesheets().add(getClass().getResource("/styles/style.css").toExternalForm());
        stage.setScene(loadingScene);
        stage.show();

        Thread starter = new Thread(() -> {
            try {
                installFonts();
                spawnBackend();
                pollUntilReady();
                Platform.runLater(() -> {
                    loadingCtrl.stop();
                    showMainView(stage);
                });
            } catch (Exception e) {
                Platform.runLater(() -> {
                    loadingCtrl.stop();
                    showFatalError(stage, e.getMessage());
                });
            }
        }, "saca-backend-starter");
        starter.setDaemon(true);
        starter.start();
    }

    @Override
    public void stop() {
        if (backendProcess != null && backendProcess.isAlive()) {
            backendProcess.destroy();
        }
    }

    private void installFonts() {
        try {
            File installDir = new File(System.getProperty("java.home")).getParentFile();
            File fontsDir = new File(installDir, "app\\fonts");
            File windowsFonts = new File("C:\\Windows\\Fonts");

            if (!fontsDir.exists()) {
                System.out.println("[SACA] No fonts directory found, skipping font install");
                return;
            }

            File[] fontFiles = fontsDir.listFiles(
                    (dir, name) -> name.toLowerCase().endsWith(".ttf")
            );

            if (fontFiles == null || fontFiles.length == 0) {
                System.out.println("[SACA] No font files found");
                return;
            }

            for (File font : fontFiles) {
                File dest = new File(windowsFonts, font.getName());
                if (!dest.exists()) {
                    Files.copy(
                            font.toPath(),
                            dest.toPath(),
                            StandardCopyOption.REPLACE_EXISTING
                    );

                    // Register font in Windows registry
                    String fontName = font.getName().replace(".ttf", "");
                    Runtime.getRuntime().exec(new String[]{
                            "reg", "add",
                            "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts",
                            "/v", fontName,
                            "/t", "REG_SZ",
                            "/d", font.getName(),
                            "/f"
                    });

                    System.out.println("[SACA] Installed font: " + font.getName());
                } else {
                    System.out.println("[SACA] Font already installed: " + font.getName());
                }
            }

            System.out.println("[SACA] Font installation complete");

        } catch (Exception e) {
            System.out.println("[SACA] Font install skipped: " + e.getMessage());
        }
    }

    private void spawnBackend() throws Exception {
        File installDir = new File(System.getProperty("java.home")).getParentFile();

        File serverExe = new File(installDir, "app\\saca_server.exe");

        if (!serverExe.exists()) {
            serverExe = new File(installDir, "saca_server.exe");
        }

        if (!serverExe.exists()) {
            System.out.println("[SACA] saca_server.exe not found — assuming dev mode, skipping spawn");
            return;
        }

        ProcessBuilder pb = new ProcessBuilder(serverExe.getAbsolutePath());
        pb.redirectErrorStream(true);
        backendProcess = pb.start();
        System.out.println("[SACA] Spawned saca_server.exe (pid " + backendProcess.pid() + ")");
    }

    private void pollUntilReady() throws Exception {
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(POLL_INTERVAL_MS))
                .build();

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(BACKEND_HEALTH_URL))
                .POST(HttpRequest.BodyPublishers.ofString("{\"symptoms\":[]}"))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofMillis(POLL_INTERVAL_MS))
                .build();

        long deadline = System.currentTimeMillis() + POLL_TIMEOUT_MS;

        while (System.currentTimeMillis() < deadline) {
            try {
                HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
                if (resp.statusCode() < 500) {
                    System.out.println("[SACA] Backend ready (HTTP " + resp.statusCode() + ")");
                    return;
                }
            } catch (Exception ignored) {
                // not ready yet
            }
            Thread.sleep(POLL_INTERVAL_MS);
        }
        throw new RuntimeException(
                "Backend did not respond within " + (POLL_TIMEOUT_MS / 1000) + " seconds.");
    }

    private void showMainView(Stage stage) {
        try {
            ResourceBundle bundle = LanguageManager.getBundle();
            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/view/MainView.fxml"), bundle);
            Parent root = loader.load();
            Scene scene = new Scene(root, APP_WIDTH, APP_HEIGHT);
            scene.getStylesheets().add(getClass().getResource("/styles/style.css").toExternalForm());
            stage.setScene(scene);
        } catch (Exception e) {
            showFatalError(stage, "Failed to load main view: " + e.getMessage());
        }
    }

    private void showFatalError(Stage stage, String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("SACA Startup Error");
        alert.setHeaderText("Could not start SACA");
        alert.setContentText(message);
        alert.initOwner(stage);
        alert.showAndWait();
        Platform.exit();
    }
}
