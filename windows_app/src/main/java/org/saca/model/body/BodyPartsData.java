package org.saca.model.body;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

public class BodyPartsData {

    private static final Map<String, BodyPart> PARTS = new LinkedHashMap<>();

    static {
        PARTS.put("head",
                new BodyPart("head", "Head", "Jurru", "head_en.wav", "head_wp.wav",
                        Arrays.asList(
                                new BodySymptom("headache", "Headache", "Walpawalpa", "headache_en.wav", "headache_wp.wav"),
                                new BodySymptom("dizziness", "Dizziness", "Kurruru", "dizziness_en.wav", "dizziness_wp.wav"),
                                new BodySymptom("loss_of_consciousness", "Loss of consciousness", "Tiirnki", "loss_of_consciousness_en.wav", "loss_of_consciousness_wp.wav")
                        )));

        PARTS.put("eye",
                new BodyPart("eye", "Eye", "Milpa", "eye_en.wav", "eye_wp.wav",
                        Arrays.asList(
                                new BodySymptom("eye_pain", "Eye Pain", "Milpa purrkunypa", "eye_pain_en.wav", "eye_pain_wp.wav"),
                                new BodySymptom("eye_itching", "Itchy", "Yayirri", "eye_itching_en.wav", "eye_itching_wp.wav")
                        )));

        PARTS.put("ear",
                new BodyPart("ear", "Ear", "Langa", "ear_en.wav", "ear_wp.wav",
                        Arrays.asList(
                                new BodySymptom("ear_pain", "Ear Pain", "Langa purrkunypa", "ear_pain_en.wav", "ear_pain_wp.wav")
                        )));

        PARTS.put("nose",
                new BodyPart("nose", "Nose", "Mulyu", "nose_en.wav", "nose_wp.wav",
                        Arrays.asList(
                                new BodySymptom("runny_nose", "Runny nose", "Mulyu rdulpu", "runny_nose_en.wav", "runny_nose_wp.wav"),
                                new BodySymptom("sneezing", "Sneezing", "Jirrjinti", "sneezing_en.wav", "sneezing_wp.wav")
                        )));

        PARTS.put("jaw",
                new BodyPart("jaw", "Jaw", "Wirlki", "jaw_en.wav", "jaw_wp.wav",
                        Arrays.asList(
                                new BodySymptom("jaw_pain", "Jaw Pain", "Wirlki purrkunypa", "jaw_pain_en.wav", "jaw_pain_wp.wav")
                        )));

        PARTS.put("throat",
                new BodyPart("throat", "Throat", "Waninja", "throat_en.wav", "throat_wp.wav",
                        Arrays.asList(
                                new BodySymptom("sore_throat", "Sore throat", "Waninja kiri", "sore_throat_en.wav", "sore_throat_wp.wav")
                        )));

        PARTS.put("neck",
                new BodyPart("neck", "Neck", "Nguku", "neck_en.wav", "neck_wp.wav",
                        Arrays.asList(
                                new BodySymptom("stiff_neck", "Neck stiffness", "Nguku kantalkantal", "stiff_neck_en.wav", "stiff_neck_wp.wav")
                        )));

        PARTS.put("chest",
                new BodyPart("chest", "Chest", "Mangarli", "chest_en.wav", "chest_wp.wav",
                        Arrays.asList(
                                new BodySymptom("chest_pain", "Chest pain", "Mangarli purrkunypa", "chest_pain_en.wav", "chest_pain_wp.wav"),
                                new BodySymptom("shortness_breath", "Shortness of breath", "Nguurlnguurlpa", "shortness_breath_en.wav", "shortness_breath_wp.wav"),
                                new BodySymptom("cough", "Cough", "Kuntulpinyi", "cough_en.wav", "cough_wp.wav")
                        )));

        PARTS.put("stomach",
                new BodyPart("stomach", "Stomach", "Miyalu", "stomach_en.wav", "stomach_wp.wav",
                        Arrays.asList(
                                new BodySymptom("abdominal_pain", "Stomach pain", "Miyalu purrkunypa", "abdominal_pain_en.wav", "abdominal_pain_wp.wav"),
                                new BodySymptom("nausea", "Nausea", "Ngarlungarlu", "nausea_en.wav", "nausea_wp.wav"),
                                new BodySymptom("vomiting", "Vomiting", "Yurlkulyu", "vomiting_en.wav", "vomiting_wp.wav"),
                                new BodySymptom("diarrhea", "Diarrhoea", "Jinirrpa", "diarrhea_en.wav", "diarrhea_wp.wav"),
                                new BodySymptom("blood_stool", "Blood in stool", "Jinirrpa jaarlkurlu", "blood_stool_en.wav", "blood_stool_wp.wav")
                        )));

        PARTS.put("back",
                new BodyPart("back", "Back", "Pawiyi", "back_en.wav", "back_wp.wav",
                        Arrays.asList(
                                new BodySymptom("back_pain", "Back Pain", "Pawiyi purrkunypa", "back_pain_en.wav", "back_pain_wp.wav")
                        )));

        PARTS.put("arm",
                new BodyPart("arm", "Arm", "Kilpirli", "arm_en.wav", "arm_wp.wav",
                        Arrays.asList(
                                new BodySymptom("arm_pain", "Kilpirli Pain", "Purrkunypa", "arm_pain_en.wav", "arm_pain_wp.wav"),
                                new BodySymptom("arm_weakness", "Weakness", "Rampaku", "arm_weakness_en.wav", "arm_weakness_wp.wav"),
                                new BodySymptom("swelling_arms", "Swelling", "Kirakarrimi", "swelling_arms_en.wav", "swelling_arms_wp.wav")
                        )));

        PARTS.put("general", new BodyPart("whole_body", "Whole Body", "Palka", "whole_body_en.wav", "whole_body_wp.wav",
                Arrays.asList(
                        new BodySymptom("fever", "Fever", "Rdurrurlpu", "fever_en.wav", "fever_wp.wav"),
                        new BodySymptom("chills", "Shivering", "Mirrmirr", "chills_en.wav", "chills_wp.wav"),
                        new BodySymptom("fatigue", "Tired", "Mata", "fatigue_en.wav", "fatigue_wp.wav"),
                        new BodySymptom("weakness", "Weakness", "Rampaku", "weakness_en.wav", "weakness_wp.wav"),
                        new BodySymptom("swelling_parts_of_body", "Swelling", "Kirakarrimi", "swelling_parts_of_body_en.wav", "swelling_parts_of_body_wp.wav"),
                        new BodySymptom("rash", "Rash", "Mardalmardal", "rash_en.wav", "rash_wp.wav"),
                        new BodySymptom("itchy", "Itchy", "Yayirri", "itchy_en.wav", "itchy_wp.wav"),
                        new BodySymptom("bleeding", "Bleeding", "Ngamanjimanji", "bleeding_en.wav", "bleeding_wp.wav"),
                        new BodySymptom("dehydration", "Dehydrated / Very thirsty", "Nantu", "dehydration_en.wav", "dehydration_wp.wav"),
                        new BodySymptom("blood_urine", "Blood in urine", "Minjinpa jaarlkurlu", "blood_urine_en.wav", "blood_urine_wp.wav")
                )));
    }

    public static Map<String, BodyPart> getAllParts() {
        return PARTS;
    }

    public static BodyPart get(String id) {
        return PARTS.get(id);
    }
}
