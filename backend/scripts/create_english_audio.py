"""
Generate English audio files using Google Text-to-Speech (gTTS).
"""

import os

from gtts import gTTS
from pydub import AudioSegment

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '../data/audio/output')
os.makedirs(OUTPUT_DIR, exist_ok=True)

PHRASES = {
    # questions
    "q_gender_en": "What is your gender?",
    "q_age_en": "What is your age?",
    "q_duration_en": "How long have you had these symptoms?",
    "q_pain_intensity_en": "How bad is your pain?",
    "q_fever_high_en": "Is your body temperature very high?",
    "q_fever_chills_en": "Do you have chills or shivering?",
    "q_headache_sudden_en": "Is the headache sudden and very severe?",
    "q_headache_neck_en": "Do you have neck stiffness?",
    "q_chest_spread_en": "Does the pain spread to your arm or jaw?",
    "q_chest_sudden_en": "Is the pain sudden and severe?",
    "q_breath_rest_en": "Do you feel breathless at rest?",
    "q_breath_sudden_en": "Did it start suddenly?",
    "q_pain_severe_en": "Is the pain severe and constant?",
    "q_abdominal_nausea_en": "Do you have nausea or vomiting with it?",
    "q_cough_blood_en": "Do you cough up blood?",
    "q_cough_duration_en": "Has the cough lasted more than a week?",
    "q_dizziness_faint_en": "Do you feel like you might faint?",
    "q_consciousness_lost_en": "Did you lose consciousness recently?",
    "q_vomiting_count_en": "Have you vomited more than 5 times today?",
    "q_vomiting_fluids_en": "Can you keep fluids down?",
    "q_diarrhea_blood_en": "Is there blood in your stool?",
    "q_diarrhea_dehydrated_en": "Do you feel severely dehydrated?",

    # answers
    "answer_yes_en": "Yes",
    "answer_no_en": "No",
    "answer_male_en": "Male",
    "answer_female_en": "Female",
    "answer_child_en": "Child",
    "answer_youth_en": "Youth",
    "answer_adult_en": "Adult",
    "answer_elder_en": "Elder",
    "answer_today_en": "Today",
    "answer_yesterday_en": "Yesterday",
    "answer_2_3_days_en": "2 to 3 days",
    "answer_about_a_week_en": "About a week",
    "answer_more_than_a_week_en": "More than a week",
    "answer_none_en": "None",
    "answer_a_little_en": "A little",
    "answer_moderate_en": "Moderate",
    "answer_very_bad_en": "Very bad",
    "answer_unbearable_en": "Unbearable",

    # severity
    "severity_mild_en": "Your symptoms are mild.",
    "severity_moderate_en": "Your symptoms are moderate. See a doctor today.",
    "severity_severe_en": "Your symptoms are severe. Get help right now.",

    # ui
    "detected_symptoms_en": "Detected Symptoms",
    "does_this_match_en": "Does this match you?",
    "tap_yes_or_no_en": "Tap yes or no",
    "you_selected_en": "You selected",
    "could_not_catch_en": "Sorry, I could not understand. Please re-record or tap your answer.",

    # symptoms
    "headache_en": "Headache",
    "dizziness_en": "Dizziness",
    "loss_of_consciousness_en": "Loss of consciousness",
    "stiff_neck_en": "Neck stiffness",
    "chest_pain_en": "Chest pain",
    "shortness_breath_en": "Shortness of breath",
    "cough_en": "Cough",
    "abdominal_pain_en": "Stomach pain",
    "nausea_en": "Nausea",
    "vomiting_en": "Vomiting",
    "diarrhea_en": "Diarrhoea",
    "blood_stool_en": "Blood in stool",
    "arm_pain_en": "Arm pain",
    "arm_weakness_en": "Arm weakness",
    "swelling_arms_en": "Swelling arms",
    "jaw_pain_en": "Jaw pain",
    "runny_nose_en": "Runny nose",
    "sneezing_en": "Sneezing",
    "ear_pain_en": "Ear pain",
    "eye_pain_en": "Eye pain",
    "eye_itching_en": "Eye itching",
    "sore_throat_en": "Sore throat",
    "back_pain_en": "Back pain",
    "fever_en": "Fever",
    "chills_en": "Shivering",
    "fatigue_en": "Fatigue",
    "weakness_en": "Weakness",
    "body_pain_en": "Body pain",
    "swelling_parts_of_body_en": "Swelling parts of body",
    "rash_en": "Rash",
    "itchy_en": "Itchy",
    "bleeding_en": "Bleeding",
    "dehydration_en": "Dehydrated",
    "blood_urine_en": "Blood in urine",

    # body parts
    "whole_body_en": "Whole body",
    "head_en": "Head",
    "neck_en": "Neck",
    "chest_en": "Chest",
    "stomach_en": "Stomach",
    "arm_en": "Arm",
    "jaw_en": "Jaw",
    "nose_en": "Nose",
    "ear_en": "Ear",
    "eye_en": "Eye",
    "throat_en": "Throat",
    "back_en": "Back",
}


def generate_all():
    """
    Generate all english audio
    """
    done = 0
    skipped = 0
    failed = []

    for key, text in PHRASES.items():
        output_path = os.path.join(OUTPUT_DIR, f'{key}.wav')

        # skip if already exists
        if os.path.exists(output_path):
            skipped += 1
            continue

        try:
            # gTTS generates mp3, convert to wav
            tts = gTTS(text=text, lang='en', slow=False)
            mp3_path = output_path.replace('.wav', '.mp3')
            tts.save(mp3_path)

            # convert mp3 to wav
            audio = AudioSegment.from_mp3(mp3_path)
            audio.export(output_path, format='wav')
            os.remove(mp3_path)

            done += 1
            print(f'Generated: {key}.wav')

        except Exception as e:
            failed.append(key)
            print(f'Failed: {key} - {e}')

    print(f'\nDone: {done} generated, {skipped} skipped, {len(failed)} failed')
    if failed:
        print(f'Failed keys: {failed}')


if __name__ == '__main__':
    print(f'Generating {len(PHRASES)} English audio files')
    print(f'Output: {OUTPUT_DIR}\n')
    generate_all()
