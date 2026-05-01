package org.saca.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

public class AudioService {

    private static Process currentProcess;

    private static Thread playThread;

    private static Path tempFile;

    public static void playBase64Wav(String base64Wav, ErrorCallback onError) {
        // System.out.println("[AudioService] playBase64Wav called");

        if (base64Wav == null || base64Wav.isBlank()) {
            onError.onError("No audio data");
            return;
        }

        stop();

        playThread = new Thread(() -> {
            try {
                // Clean base64
                String clean = base64Wav
                        .replaceAll("\\s", "")
                        .replaceAll("^data:audio/[^;]+;base64,", "");
                // System.out.println("[AudioService] decoded bytes: " + clean.length());

                // Decode to bytes
                byte[] wavBytes = Base64.getDecoder().decode(clean);
                // System.out.println("[AudioService] wav bytes: " + wavBytes.length);

                // Write to temp file
                tempFile = Files.createTempFile("saca_audio_", ".wav");
                Files.write(tempFile, wavBytes);
                tempFile.toFile().deleteOnExit();
                // System.out.println("[AudioService] temp file: " + tempFile);

                // Play using OS native player
                String os = System.getProperty("os.name").toLowerCase();
                ProcessBuilder pb;

                if (os.contains("mac")) {
                    // macOS — afplay
                    pb = new ProcessBuilder("afplay", tempFile.toString());
                } else if (os.contains("win")) {
                    // Windows — PowerShell
                    pb = new ProcessBuilder("powershell", "-c",
                            "(New-Object Media.SoundPlayer '" + tempFile + "').PlaySync()");
                } else {
                    // Linux — aplay
                    pb = new ProcessBuilder("aplay", tempFile.toString());
                }

                pb.inheritIO();
                currentProcess = pb.start();
                // System.out.println("[AudioService] playing via native player...");

                // Blocks until audio finishes
                currentProcess.waitFor();
                // System.out.println("[AudioService] playback finished");

            } catch (InterruptedException e) {
                // System.out.println("[AudioService] interrupted");
                Thread.currentThread().interrupt();
            } catch (IOException e) {
                // System.out.println("[AudioService] ERROR: " + e.getMessage());
                onError.onError("IO error: " + e.getMessage());
            } catch (Exception e) {
                // System.out.println("[AudioService] ERROR: " + e.getMessage());
                onError.onError("Unexpected error: " + e.getMessage());
            } finally {
                deleteTempFile();
                currentProcess = null;
            }
        });

        playThread.setDaemon(true);
        playThread.start();
    }

    public static void stop() {
        if (currentProcess != null && currentProcess.isAlive()) {
            currentProcess.destroyForcibly();
            currentProcess = null;
            // System.out.println("[AudioService] stopped");
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
}
