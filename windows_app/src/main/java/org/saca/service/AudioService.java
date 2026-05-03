package org.saca.service;

import javafx.application.Platform;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

public class AudioService {

    private static Process currentProcess;

    private static Thread playThread;

    private static Path tempFile;

    public static void playBase64Wav(String base64Wav,
                                     ErrorCallback onError,
                                     CompleteCallback onComplete) {
        if (base64Wav == null || base64Wav.isBlank()) {
            onError.onError("No audio data");
            return;
        }

        stop();

        playThread = new Thread(() -> {
            try {
                String clean = base64Wav
                        .replaceAll("\\s", "")
                        .replaceAll("^data:audio/[^;]+;base64,", "");

                byte[] wavBytes = Base64.getDecoder().decode(clean);

                tempFile = Files.createTempFile("saca_audio_", ".wav");
                Files.write(tempFile, wavBytes);
                tempFile.toFile().deleteOnExit();

                String os = System.getProperty("os.name").toLowerCase();
                ProcessBuilder pb;

                if (os.contains("mac")) {
                    pb = new ProcessBuilder("afplay", tempFile.toString());
                } else if (os.contains("win")) {
                    pb = new ProcessBuilder("powershell", "-c",
                            "(New-Object Media.SoundPlayer '" + tempFile + "').PlaySync()");
                } else {
                    pb = new ProcessBuilder("aplay", tempFile.toString());
                }

                pb.inheritIO();
                currentProcess = pb.start();
                currentProcess.waitFor();

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } catch (IOException e) {
                Platform.runLater(() -> onError.onError("IO error: " + e.getMessage()));
            } catch (Exception e) {
                Platform.runLater(() -> onError.onError("Unexpected error: " + e.getMessage()));
            } finally {
                deleteTempFile();
                currentProcess = null;
                // Fire onComplete on JavaFX thread
                Platform.runLater(onComplete::onComplete);
            }
        });

        playThread.setDaemon(true);
        playThread.start();
    }

    public static void stop() {
        if (currentProcess != null && currentProcess.isAlive()) {
            currentProcess.destroyForcibly();
            currentProcess = null;
        }
        if (playThread != null && playThread.isAlive()) {
            playThread.interrupt();
            playThread = null;
        }
        deleteTempFile();
    }

    public static boolean isPlaying() {
        return currentProcess != null && currentProcess.isAlive();
    }

    private static void deleteTempFile() {
        try {
            if (tempFile != null && Files.exists(tempFile)) {
                Files.deleteIfExists(tempFile);
                tempFile = null;
            }
        } catch (IOException ignored) {
        }
    }

    public interface ErrorCallback {
        void onError(String message);
    }

    public interface CompleteCallback {
        void onComplete();
    }
}
