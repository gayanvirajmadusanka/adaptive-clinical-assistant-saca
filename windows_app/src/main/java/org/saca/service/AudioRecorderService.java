package org.saca.service;

import javax.sound.sampled.*;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.util.Base64;

public class AudioRecorderService {

    private static final AudioFormat FORMAT = new AudioFormat(
            AudioFormat.Encoding.PCM_SIGNED,
            16000f,
            16,
            1,
            2,
            16000f,
            false
    );

    private static TargetDataLine microphone;

    private static Thread recordingThread;

    private static ByteArrayOutputStream recordedBytes;

    private static volatile boolean recording = false;

    private static byte[] lastRecordedWav;

    public static boolean isRecording() {
        return recording;
    }

    public static boolean hasRecording() {
        return lastRecordedWav != null && lastRecordedWav.length > 0;
    }

    public static void startRecording(Runnable onStarted, AudioService.ErrorCallback onError) {
        if (recording) return;

        try {
            DataLine.Info info = new DataLine.Info(TargetDataLine.class, FORMAT);
            if (!AudioSystem.isLineSupported(info)) {
                onError.onError("Microphone not supported on this system.");
                return;
            }

            microphone = (TargetDataLine) AudioSystem.getLine(info);
            microphone.open(FORMAT);
            microphone.start();

            recordedBytes = new ByteArrayOutputStream();
            recording = true;
            lastRecordedWav = null;

            recordingThread = new Thread(() -> {
                byte[] buffer = new byte[4096];
                while (recording) {
                    int count = microphone.read(buffer, 0, buffer.length);
                    if (count > 0) recordedBytes.write(buffer, 0, count);
                }
            });
            recordingThread.setDaemon(true);
            recordingThread.start();

            onStarted.run();

        } catch (LineUnavailableException e) {
            onError.onError("Microphone unavailable: " + e.getMessage());
        }
    }

    public static void stopRecording(AudioService.ErrorCallback onError) {
        if (!recording) return;
        recording = false;

        if (microphone != null) {
            microphone.stop();
            microphone.close();
        }

        try {
            byte[] pcmData = recordedBytes.toByteArray();
            lastRecordedWav = pcmToWav(pcmData, FORMAT);
        } catch (Exception e) {
            onError.onError("Failed to encode recording: " + e.getMessage());
        }
    }

    public static String getBase64Wav() {
        if (lastRecordedWav == null) return null;
        return Base64.getEncoder().encodeToString(lastRecordedWav);
    }

    public static double getDurationSeconds() {
        if (lastRecordedWav == null) return 0;
        long audioBytes = lastRecordedWav.length - 44;
        return Math.max(0.0, audioBytes / FORMAT.getFrameRate() / FORMAT.getFrameSize());
    }

    public static void playRecording(AudioService.ErrorCallback onError, AudioService.CompleteCallback onComplete) {
        if (lastRecordedWav == null) return;
        String b64 = Base64.getEncoder().encodeToString(lastRecordedWav);
        AudioService.playBase64Wav(b64, onError, onComplete);
    }

    public static void stopPlayback() {
        AudioService.stop();
    }

    public static boolean isPlayingBack() {
        return AudioService.isPlaying();
    }

    public static void clearRecording() {
        lastRecordedWav = null;
        recordedBytes = null;
    }

    public static void restoreRecording(String base64Wav) {
        if (base64Wav == null) return;
        lastRecordedWav = Base64.getDecoder().decode(base64Wav);
    }

    private static byte[] pcmToWav(byte[] pcmData, AudioFormat format) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int pcmLength = pcmData.length;
        int byteRate = (int) (format.getSampleRate() * format.getChannels() * format.getSampleSizeInBits() / 8);
        int blockAlign = format.getChannels() * format.getSampleSizeInBits() / 8;

        DataOutputStream dos = new DataOutputStream(out);

        dos.writeBytes("RIFF");
        writeInt(dos, 36 + pcmLength);
        dos.writeBytes("WAVE");
        dos.writeBytes("fmt ");
        writeInt(dos, 16);
        writeShort(dos, (short) 1);
        writeShort(dos, (short) format.getChannels());
        writeInt(dos, (int) format.getSampleRate());
        writeInt(dos, byteRate);
        writeShort(dos, (short) blockAlign);
        writeShort(dos, (short) format.getSampleSizeInBits());
        dos.writeBytes("data");
        writeInt(dos, pcmLength);
        dos.write(pcmData);

        return out.toByteArray();
    }

    private static void writeInt(DataOutputStream dos, int value) throws IOException {
        dos.write(value & 0xFF);
        dos.write((value >> 8) & 0xFF);
        dos.write((value >> 16) & 0xFF);
        dos.write((value >> 24) & 0xFF);
    }

    private static void writeShort(DataOutputStream dos, short value) throws IOException {
        dos.write(value & 0xFF);
        dos.write((value >> 8) & 0xFF);
    }
}
