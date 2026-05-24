package org.saca.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Request model for submitting a voice recording to the SACA
 * symptom detection API endpoint.
 *
 * <p>The user's recorded audio is Base64-encoded and submitted
 * along with the current language code for speech recognition
 * and symptom extraction.</p>
 *
 * <p>Serialises to the following JSON structure:</p>
 * <pre>{@code
 * {
 *   "audio_b64": "<base64-encoded WAV audio>",
 *   "language":  "en"
 * }
 * }</pre>
 *
 * @author Gayan Madusanka
 * @see org.saca.service.ApiService
 */
public class VoiceInputRQ {

    /**
     * Base64-encoded WAV audio data recorded by the user.
     */
    @JsonProperty("audio_b64")
    private String audioB64;

    /**
     * Language code of the current session (e.g. {@code "en"} or {@code "wp"}).
     */
    @JsonProperty("language")
    private String language;

    /**
     * Returns the Base64-encoded audio data.
     *
     * @return Base64 WAV audio string
     */
    public String getAudioB64() {
        return audioB64;
    }

    /**
     * Sets the Base64-encoded audio data.
     *
     * @param audioB64 Base64 WAV audio string
     */
    public void setAudioB64(String audioB64) {
        this.audioB64 = audioB64;
    }

    /**
     * Returns the language code for the current session.
     *
     * @return language code (e.g. {@code "en"} or {@code "wp"})
     */
    public String getLanguage() {
        return language;
    }

    /**
     * Sets the language code for the current session.
     *
     * @param language language code (e.g. {@code "en"} or {@code "wp"})
     */
    public void setLanguage(String language) {
        this.language = language;
    }
}
