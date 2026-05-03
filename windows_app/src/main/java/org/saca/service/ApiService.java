package org.saca.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import org.saca.model.request.ClassifyRQ;
import org.saca.model.request.QuestionFetchRQ;
import org.saca.model.request.TextInputRQ;
import org.saca.model.request.VoiceInputRQ;
import org.saca.model.response.ClassifyRS;
import org.saca.model.response.QuestionsRS;
import org.saca.model.response.TextResultRS;
import org.saca.model.response.VoiceResultRS;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class ApiService {

    private static final String BASE_URL = "http://127.0.0.1:8000";

    private static final String EXTRACT_TEXT_ENDPOINT = "/extract/text";

    private static final String EXTRACT_AUDIO_ENDPOINT = "/extract/audio";

    private static final String QUESTIONS_ENDPOINT = "/questions";

    private static final String CLASSIFY_ENDPOINT = "/classify";

    private static final int TIMEOUT_S = 30;

    private static final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(TIMEOUT_S))
            .build();

    private static final ObjectMapper mapper = new ObjectMapper()
            .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);

    public static void detectSymptomsText(TextInputRQ textInputRQ,
                                          SuccessCallbackText onSuccess,
                                          ErrorCallback onError) {
        Thread thread = new Thread(() -> {
            try {
                String json = textInputRQ.toJSON();
                HttpRequest request = buildHttpPostRequest(json, EXTRACT_TEXT_ENDPOINT);
                HttpResponse<String> response = getHttpResponse(request);

                if (response.statusCode() == 200) {
                    TextResultRS result = mapper.readValue(response.body(), TextResultRS.class);
                    onSuccess.onSuccessDetectSymptomsText(result);
                } else {
                    onError.onError(getAPIErrorMsg(response));
                }

            } catch (IOException e) {
                onError.onError(getIOExceptionErrorMsg(e));
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                onError.onError(getInterruptedExceptionErrorMsg());
            } catch (Exception e) {
                onError.onError(getUnexpectedErrorMsg(e));
            }
        });

        thread.setDaemon(true);
        thread.start();
    }

    public static void fetchQuestions(QuestionFetchRQ questionFetchRQ,
                                      QuestionsCallback onSuccess,
                                      ErrorCallback onError) {
        Thread thread = new Thread(() -> {

            try {
                String json = questionFetchRQ.toJSON();

                HttpRequest request = buildHttpPostRequest(json, QUESTIONS_ENDPOINT);
                HttpResponse<String> response = getHttpResponse(request);

                if (response.statusCode() == 200) {
                    QuestionsRS result = mapper.readValue(
                            response.body(), QuestionsRS.class);
                    onSuccess.onSuccess(result);
                } else {
                    onError.onError(getAPIErrorMsg(response));

                }

            } catch (IOException e) {
                onError.onError(getIOExceptionErrorMsg(e));
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                onError.onError(getInterruptedExceptionErrorMsg());
            } catch (Exception e) {
                onError.onError(getUnexpectedErrorMsg(e));
            }
        });
        thread.setDaemon(true);
        thread.start();
    }

    public static void classify(ClassifyRQ classifyRQ,
                                ClassifyCallback onSuccess,
                                ErrorCallback onError) {
        Thread thread = new Thread(() -> {
            try {
                String json = mapper.writeValueAsString(classifyRQ);

                HttpRequest request = buildHttpPostRequest(json, CLASSIFY_ENDPOINT);
                HttpResponse<String> response = getHttpResponse(request);

                if (response.statusCode() == 200) {
                    ClassifyRS result = mapper.readValue(response.body(), ClassifyRS.class);
                    result.setLanguage(classifyRQ.getLanguage());
                    onSuccess.onSuccess(result);
                } else {
                    onError.onError(getAPIErrorMsg(response));
                }
            } catch (IOException e) {
                onError.onError(getIOExceptionErrorMsg(e));
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                onError.onError(getInterruptedExceptionErrorMsg());
            } catch (Exception e) {
                onError.onError(getUnexpectedErrorMsg(e));
            }
        });
        thread.setDaemon(true);
        thread.start();
    }

    public static void detectSymptomsAudio(VoiceInputRQ voiceInputRQ,
                                    SuccessCallbackAudio onSuccess,
                                    ErrorCallback onError) {
        Thread thread = new Thread(() -> {
            try {
                String json = mapper.writeValueAsString(voiceInputRQ);

                HttpRequest request = buildHttpPostRequest(json, EXTRACT_AUDIO_ENDPOINT);
                HttpResponse<String> response = getHttpResponse(request);

                if (response.statusCode() == 200) {
                    VoiceResultRS result = mapper.readValue(response.body(), VoiceResultRS.class);
                    onSuccess.onSuccessDetectSymptomsAudio(result);
                } else {
                    onError.onError(getAPIErrorMsg(response));
                }
            } catch (IOException e) {
                onError.onError(getIOExceptionErrorMsg(e));
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                onError.onError(getInterruptedExceptionErrorMsg());
            } catch (Exception e) {
                onError.onError(getUnexpectedErrorMsg(e));
            }
        });
        thread.setDaemon(true);
        thread.start();
    }

    private static HttpRequest buildHttpPostRequest(String json, String endPoint) {
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + endPoint))
                .timeout(Duration.ofSeconds(TIMEOUT_S))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        return httpRequest;
    }

    private static HttpResponse<String> getHttpResponse(HttpRequest request) throws IOException, InterruptedException {
        HttpResponse<String> response = client.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        );

        return response;
    }

    private static String getAPIErrorMsg(HttpResponse<String> response) {
        String errorMsg = "API error: HTTP " + response.statusCode()
                + "\n" + response.body();
        return errorMsg;
    }

    private static String getIOExceptionErrorMsg(IOException e) {
        String errorMsg = "Cannot connect to API. Is the Python server running?\n"
                + e.getMessage();
        return errorMsg;
    }

    private static String getInterruptedExceptionErrorMsg() {
        String errorMsg = "Request interrupted";
        return errorMsg;
    }

    private static String getUnexpectedErrorMsg(Exception e) {
        String errorMsg = "Unexpected error: " + e.getMessage();
        return errorMsg;
    }

    public interface QuestionsCallback {
        void onSuccess(QuestionsRS result);
    }

    public interface SuccessCallbackText {
        void onSuccessDetectSymptomsText(TextResultRS result);
    }

    public interface SuccessCallbackAudio {
        void onSuccessDetectSymptomsAudio(VoiceResultRS result);
    }

    public interface ErrorCallback {
        void onError(String errorMessage);
    }

    public interface ClassifyCallback {
        void onSuccess(ClassifyRS result);
    }
}
