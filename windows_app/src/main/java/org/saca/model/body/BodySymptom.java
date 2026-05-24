package org.saca.model.body;

import org.saca.utility.manager.LanguageManager;

/**
 * Represents a symptom associated with a specific {@link BodyPart}
 * in the SACA symptom selection flow.
 *
 * <p>Each symptom has bilingual labels and audio filenames for both
 * English (EN) and Warlpiri (WP), allowing the UI to present
 * the appropriate content based on the current application language.</p>
 *
 * @author Gayan Madusanka
 * @see BodyPart
 * @see BodyPartsData
 */
public class BodySymptom {

    /**
     * Unique identifier for this symptom (e.g. {@code "headache"}, {@code "fever"}).
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
     * Constructs a {@code BodySymptom} with all required fields.
     *
     * @param id      unique identifier for the symptom
     * @param labelEn English display label
     * @param labelWp Warlpiri display label
     * @param audioEn English audio filename
     * @param audioWp Warlpiri audio filename
     */
    public BodySymptom(String id, String labelEn, String labelWp,
                       String audioEn, String audioWp) {
        this.id = id;
        this.labelEn = labelEn;
        this.labelWp = labelWp;
        this.audioEn = audioEn;
        this.audioWp = audioWp;
    }

    /**
     * Returns the unique identifier of this symptom.
     *
     * @return the symptom ID
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
