package org.saca.utility.manager;

import javafx.concurrent.Task;

/**
 * TTSManager — OS-native Text-To-Speech utility.
 * <p>
 * No extra dependencies needed.
 * Uses the OS built-in TTS engine:
 * - macOS   → `say` command
 * - Windows → PowerShell SpeechSynthesizer
 * - Linux   → `espeak` (must be installed: sudo apt install espeak)
 * <p>
 * Usage:
 * TTSManager.speak("Hello world");
 * TTSManager.stop();
 */
public class TTSManager {

    private static final String OS = System.getProperty("os.name").toLowerCase();

    private static Process currentProcess = null;

    /**
     * Speak the given text asynchronously on a background thread.
     * Stops any currently running speech before starting new one.
     */
    public static void speak(String text) {
        if (text == null || text.isBlank()) return;

        // Stop any existing speech first
        stop();

        Task<Void> task = new Task<>() {
            @Override
            protected Void call() throws Exception {
                try {
                    ProcessBuilder pb = buildCommand(text);
                    if (pb == null) {
                        System.err.println("TTS: Unsupported OS — " + OS);
                        return null;
                    }

                    pb.redirectErrorStream(true);
                    currentProcess = pb.start();
                    currentProcess.waitFor(); // Block background thread until done

                } catch (Exception e) {
                    e.printStackTrace();
                }
                return null;
            }
        };

        Thread thread = new Thread(task);
        thread.setDaemon(true); // Don't prevent app from closing
        thread.start();
    }

    /**
     * Stop currently playing speech immediately.
     */
    public static void stop() {
        if (currentProcess != null && currentProcess.isAlive()) {
            currentProcess.destroyForcibly();
            currentProcess = null;
        }
    }

    /**
     * Returns true if speech is currently playing.
     */
    public static boolean isSpeaking() {
        return currentProcess != null && currentProcess.isAlive();
    }

    public static void stopIfSpeaking() {
        if (isSpeaking()) {
            stop();
        }
    }

    /**
     * Build the OS-specific TTS command.
     */
    private static ProcessBuilder buildCommand(String text) {
        // Sanitise — remove characters that could break shell commands
        String safe = text.replace("\"", "'").replace("\\", "");

        if (isMac()) {
            // macOS built-in `say` command — no install needed
            return new ProcessBuilder("say", safe);
        }

        if (isWindows()) {
            // Windows PowerShell SpeechSynthesizer — no install needed
            String ps = String.format(
                    "Add-Type -AssemblyName System.speech; " +
                            "(New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak(\"%s\");",
                    safe
            );
            return new ProcessBuilder(
                    "powershell", "-Command", ps
            );
        }

        if (isLinux()) {
            // Linux espeak — install with: sudo apt install espeak
            return new ProcessBuilder("espeak", safe);
        }

        return null;
    }

    private static boolean isMac() {
        return OS.contains("mac");
    }

    private static boolean isWindows() {
        return OS.contains("win");
    }

    private static boolean isLinux() {
        return OS.contains("nux") || OS.contains("nix");
    }
}
