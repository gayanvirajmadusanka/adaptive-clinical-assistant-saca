package org.saca.service;

import javafx.application.Platform;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.concurrent.atomic.AtomicBoolean;

public class AudioService {

    private static Process currentProcess;

    private static Thread playThread;

    private static Path tempFile;

    private static AtomicBoolean stopping = new AtomicBoolean(false);

    public static void playBase64Wav(String base64Wav,
                                     ErrorCallback onError,
                                     CompleteCallback onComplete) {
        if (base64Wav == null || base64Wav.isBlank()) {
            onError.onError("No audio data");
            return;
        }

        stop();

        if (playThread != null) {
            try {
                playThread.join(500);
            } catch (InterruptedException ignored) {
            }
        }

        stopping.set(false);

        playThread = new Thread(() -> {
            Path localTemp = null;

            try {
                String clean = base64Wav
                        .replaceAll("\\s", "")
                        .replaceAll("^data:audio/[^;]+;base64,", "");

                byte[] wavBytes = Base64.getDecoder().decode(clean);

                localTemp = Files.createTempFile("saca_audio_", ".wav");
                Files.write(localTemp, wavBytes);
                localTemp.toFile().deleteOnExit();
                tempFile = localTemp;

                if (stopping.get()) return;

                String os = System.getProperty("os.name").toLowerCase();
                ProcessBuilder pb;

                if (os.contains("mac")) {
                    pb = new ProcessBuilder("afplay", localTemp.toString());
                } else if (os.contains("win")) {
                    pb = new ProcessBuilder("powershell", "-c",
                            "(New-Object Media.SoundPlayer '" + localTemp + "').PlaySync()");
                } else {
                    pb = new ProcessBuilder("aplay", localTemp.toString());
                }

                pb.inheritIO();
                currentProcess = pb.start();
                currentProcess.waitFor();

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } catch (IllegalArgumentException e) {
                Platform.runLater(() -> onError.onError("Invalid audio data"));
            } catch (IOException e) {
                Platform.runLater(() -> onError.onError("IO error: " + e.getMessage()));
            } catch (Exception e) {
                Platform.runLater(() -> onError.onError("Unexpected error: " + e.getMessage()));
            } finally {
                deleteTempFile(localTemp);
                currentProcess = null;
                if (!stopping.get()) {
                    Platform.runLater(onComplete::onComplete);
                }
            }
        });

        playThread.setDaemon(true);
        playThread.start();
    }

    public static void stop() {
        stopping.set(true);

        if (currentProcess != null && currentProcess.isAlive()) {
            currentProcess.destroyForcibly();
            currentProcess = null;
        }
        if (playThread != null && playThread.isAlive()) {
            playThread.interrupt();
        }
        deleteTempFile(tempFile);
        tempFile = null;
    }

    public static boolean isPlaying() {
        return currentProcess != null && currentProcess.isAlive();
    }

    private static void deleteTempFile(Path file) {
        try {
            if (file != null && Files.exists(file)) {
                Files.deleteIfExists(file);
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
