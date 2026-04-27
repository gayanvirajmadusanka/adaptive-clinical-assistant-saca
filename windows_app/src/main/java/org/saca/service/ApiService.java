package org.saca.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * ApiService — communicates with the Python Flask symptom detection API.
 * <p>
 * Usage:
 * ApiService.detectSymptoms("I have a headache and fever",
 * symptoms -> { // success — called on background thread
 * Platform.runLater(() -> showResults(symptoms));
 * },
 * error -> { // failure
 * Platform.runLater(() -> showError(error));
 * }
 * );
 */
public class ApiService {

    private static final String BASE_URL = "http://localhost:5000";

    private static final String ENDPOINT = "/api/symptoms";

    private static final int TIMEOUT_S = 30;

    private static final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(TIMEOUT_S))
            .build();

    /**
     * Send symptom text to the Python API asynchronously.
     * Callbacks are invoked on a background thread —
     * wrap UI updates in Platform.runLater().
     *
     * @param text      raw symptom text from the user
     * @param onSuccess called with the list of detected symptoms
     * @param onError   called with an error message if something goes wrong
     */
    public static void detectSymptoms(String text,
                                      SuccessCallback onSuccess,
                                      ErrorCallback onError) {
        Thread thread = new Thread(() -> {
            try {
                // ── Build JSON body ──
                String json = String.format("{\"text\": \"%s\"}",
                        text.replace("\"", "'").replace("\n", " "));

                // ── Build HTTP request ──
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(BASE_URL + ENDPOINT))
                        .timeout(Duration.ofSeconds(TIMEOUT_S))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(json))
                        .build();

                // ── Send request ──
                HttpResponse<String> response = client.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );

                if (response.statusCode() == 200) {
                    List<String> symptoms = parseSymptoms(response.body());
                    onSuccess.onSuccess(symptoms);
                } else {
/*                    try {
                        Thread.sleep(2000);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }*/

//                    List<String> symptoms = parseSymptoms("{\"symptoms\": [\"Headache\", \"Fever\", \"Sore throat\", \"Fatigue\"]}");
//                    List<String> symptoms = new ArrayList<>();
//                    onSuccess.onSuccess(symptoms);

                    onError.onError("API error: HTTP " + response.statusCode()
                            + "\n" + response.body());
                }

            } catch (IOException e) {
                onError.onError("Cannot connect to API. Is the Python server running?\n"
                        + e.getMessage());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                onError.onError("Request interrupted");
            } catch (Exception e) {
                onError.onError("Unexpected error: " + e.getMessage());
            }
        });

        thread.setDaemon(true);
        thread.start();
    }

    /**
     * Parse the JSON response body into a List of symptom strings.
     * Response format: {"symptoms": ["Headache", "Fever"]}
     * <p>
     * Uses manual parsing to avoid adding a JSON library dependency.
     * Replace with Gson/Jackson if you already have one in your project.
     */
    private static List<String> parseSymptoms(String json) {
        List<String> symptoms = new ArrayList<>();

        // Find the array between [ and ]
        int start = json.indexOf('[');
        int end = json.lastIndexOf(']');

        if (start == -1 || end == -1) return symptoms;

        String array = json.substring(start + 1, end);

        // Split by "," and clean up quotes
        String[] items = array.split(",");
        for (String item : items) {
            String cleaned = item.trim()
                    .replaceAll("^\"|\"$", "") // remove surrounding quotes
                    .trim();
            if (!cleaned.isEmpty()) {
                symptoms.add(cleaned);
            }
        }

        return symptoms;
    }

    public interface SuccessCallback {
        void onSuccess(List<String> symptoms);
    }

    public interface ErrorCallback {
        void onError(String errorMessage);
    }
}
