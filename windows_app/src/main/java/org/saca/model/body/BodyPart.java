package org.saca.model.body;

import org.saca.utility.manager.LanguageManager;

import java.util.List;

/**
 * Represents a body part in the SACA symptom selection flow.
 *
 * <p>Each body part has bilingual labels and audio files for both
 * English (EN) and Warlpiri (WP), along with a list of associated
 * {@link BodySymptom} symptoms the user can select.</p>
 *
 * @author Gayan Madusanka
 */
public class BodyPart {

    /**
     * Unique identifier for this body part (e.g. {@code "head"}, {@code "arm"}).
     */
    private final String id;

    /**
     * Display label in English.
     */
    private final String labelEn;

    /**
     * Display label in Warlpiri.
     */
    private final String labelWp;

    /**
     * Audio filename for the English label (relative to the audio resources folder).
     */
    private final String audioEn;

    /**
     * Audio filename for the Warlpiri label (relative to the audio resources folder).
     */
    private final String audioWp;

    /**
     * List of symptoms associated with this body part.
     */
    private final List<BodySymptom> symptoms;

    /**
     * Constructs a {@code BodyPart} with all required fields.
     *
     * @param id       unique identifier for the body part
     * @param labelEn  English display label
     * @param labelWp  Warlpiri display label
     * @param audioEn  English audio filename
     * @param audioWp  Warlpiri audio filename
     * @param symptoms list of {@link BodySymptom} associated with this body part
     */
    public BodyPart(String id, String labelEn, String labelWp,
                    String audioEn, String audioWp, List<BodySymptom> symptoms) {
        this.id = id;
        this.labelEn = labelEn;
        this.labelWp = labelWp;
        this.audioEn = audioEn;
        this.audioWp = audioWp;
        this.symptoms = symptoms;
    }

    /**
     * Returns the unique identifier of this body part.
     *
     * @return the body part ID
     */
    public String getId() {
        return id;
    }

    /**
     * Returns the English display label.
     *
     * @return English label
     */
    public String getLabelEn() {
        return labelEn;
    }

    /**
     * Returns the Warlpiri display label.
     *
     * @return Warlpiri label
     */
    public String getLabelWp() {
        return labelWp;
    }

    /**
     * Returns the English audio filename.
     *
     * @return English audio filename
     */
    public String getAudioEn() {
        return audioEn;
    }

    /**
     * Returns the Warlpiri audio filename.
     *
     * @return Warlpiri audio filename
     */
    public String getAudioWp() {
        return audioWp;
    }

    /**
     * Returns the list of symptoms associated with this body part.
     *
     * @return list of {@link BodySymptom}
     */
    public List<BodySymptom> getSymptoms() {
        return symptoms;
    }

    /**
     * Returns the display label for the current application language.
     *
     * @return English label if the current language is English,
     * Warlpiri label otherwise
     */
    public String getLabel() {
        return LanguageManager.isLanguageEnglish() ? labelEn : labelWp;
    }

    /**
     * Returns the audio filename for the current application language.
     *
     * @return English audio filename if the current language is English,
     * Warlpiri audio filename otherwise
     */
    public String getAudio() {
        return LanguageManager.isLanguageEnglish() ? audioEn : audioWp;
    }
}
