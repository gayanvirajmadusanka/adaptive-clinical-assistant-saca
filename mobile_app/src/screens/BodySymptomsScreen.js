// BodySymptomsScreen.js
// Purpose: Shows symptoms for selected body part with both image and text.
// User can select multiple symptoms and confirm.

import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';
import bodyMap from '../../assets/data/body_map.json';
import styles from '../styles/bodySymptomsStyles';

const SYMPTOM_IMAGES = {
  male: {
    headache: require('../../assets/images/Body_Parts/Head/Headache_male.png'),
    dizziness: require('../../assets/images/Body_Parts/Head/Dizziness_male.png'),
    loss_of_consciousness: require('../../assets/images/Body_Parts/Head/Loss of consciousness_male.png'),

    neck_stiffness: require('../../assets/images/Body_Parts/Neck/Neck_stiffness_male.png'),
    jaw_pain: require('../../assets/images/Body_Parts/Jaw/jaw_pain_male.png'),

    runny_nose: require('../../assets/images/Body_Parts/Nose/runny_nose_male.png'),
    sneezing: require('../../assets/images/Body_Parts/Nose/sneezing_male.png'),

    sore_throat: require('../../assets/images/Body_Parts/Throat/sore_throat_male.png'),

    chest_pain: require('../../assets/images/Body_Parts/Chest/chest_pain_male.png'),
    cough: require('../../assets/images/Body_Parts/Chest/cough_male.png'),
    shortness_breath: require('../../assets/images/Body_Parts/Chest/shortness_breath_male.png'),

    arm_pain: require('../../assets/images/Body_Parts/Arm/arm_pain_male.png'),
    arm_weakness: require('../../assets/images/Body_Parts/Arm/arm_weakness_male.png'),
    arm_swelling: require('../../assets/images/Body_Parts/Arm/swelling_arms_male.png'),

    back_pain: require('../../assets/images/Body_Parts/Back/back_pain_male.png'),

    stomach_pain: require('../../assets/images/Body_Parts/Stomach/stomach_pain_male.png'),
    nausea: require('../../assets/images/Body_Parts/Stomach/nausea_male.png'),
    vomiting: require('../../assets/images/Body_Parts/Stomach/vomiting_male.png'),
    diarrhoea: require('../../assets/images/Body_Parts/Stomach/diarrhoea_male.png'),
    blood_stool: require('../../assets/images/Body_Parts/Stomach/blood_stool_male.png'),

    ear_pain: require('../../assets/images/Body_Parts/Ear/ear_pain_male.png'),

    eye_pain: require('../../assets/images/Body_Parts/Eye/eye_pain_male.png'),
    eye_itchy: require('../../assets/images/Body_Parts/Eye/eye_itchy_male.png'),

    fever: require('../../assets/images/Body_Parts/Whole_Body/fever_male.png'),
    shivering: require('../../assets/images/Body_Parts/Whole_Body/shivering_male.png'),
    fatigue: require('../../assets/images/Body_Parts/Whole_Body/fatigue_male.png'),
    tired: require('../../assets/images/Body_Parts/Whole_Body/fatigue_male.png'),
    weakness: require('../../assets/images/Body_Parts/Whole_Body/weakness_male.png'),
    rash: require('../../assets/images/Body_Parts/Whole_Body/rash_male.png'),
    itchy: require('../../assets/images/Body_Parts/Whole_Body/itchy_male.png'),
    dehydration: require('../../assets/images/Body_Parts/Whole_Body/dehydration_male.png'),
    bleeding: require('../../assets/images/Body_Parts/Whole_Body/bleeding_male.png'),
    blood_urine: require('../../assets/images/Body_Parts/Whole_Body/blood_urine_male.png'),
    swelling_parts_of_body: require('../../assets/images/Body_Parts/Whole_Body/swelling_parts_of_body_male.png'),
  },

  female: {
    headache: require('../../assets/images/Body_Parts/Head/Headache_female.png'),
    dizziness: require('../../assets/images/Body_Parts/Head/Dizziness_female.png'),
    loss_of_consciousness: require('../../assets/images/Body_Parts/Head/Loss of consciousness_female.png'),

    neck_stiffness: require('../../assets/images/Body_Parts/Neck/Neck_stiffness_female.png'),
    jaw_pain: require('../../assets/images/Body_Parts/Jaw/jaw_pain_female.png'),

    runny_nose: require('../../assets/images/Body_Parts/Nose/runny_nose_female.png'),
    sneezing: require('../../assets/images/Body_Parts/Nose/sneezing_female.png'),

    sore_throat: require('../../assets/images/Body_Parts/Throat/sore_throat_female.png'),

    chest_pain: require('../../assets/images/Body_Parts/Chest/chest_pain_female.png'),
    cough: require('../../assets/images/Body_Parts/Chest/cough_female.png'),
    shortness_breath: require('../../assets/images/Body_Parts/Chest/shortness_breath_female.png'),

    arm_pain: require('../../assets/images/Body_Parts/Arm/arm_pain_female.png'),
    arm_weakness: require('../../assets/images/Body_Parts/Arm/arm_weakness_female.png'),
    arm_swelling: require('../../assets/images/Body_Parts/Arm/swelling_arms_female.png'),

    back_pain: require('../../assets/images/Body_Parts/Back/back_pain_female.png'),

    stomach_pain: require('../../assets/images/Body_Parts/Stomach/stomach_pain_female.png'),
    nausea: require('../../assets/images/Body_Parts/Stomach/nausea_female.png'),
    vomiting: require('../../assets/images/Body_Parts/Stomach/vomiting_female.png'),
    diarrhoea: require('../../assets/images/Body_Parts/Stomach/diarrhoea_female.png'),
    blood_stool: require('../../assets/images/Body_Parts/Stomach/blood_stool_female.png'),

    ear_pain: require('../../assets/images/Body_Parts/Ear/ear_pain_female.png'),

    eye_pain: require('../../assets/images/Body_Parts/Eye/eye_pain_female.png'),
    eye_itchy: require('../../assets/images/Body_Parts/Eye/eye_itchy_female.png'),

    fever: require('../../assets/images/Body_Parts/Whole_Body/fever_female.png'),
    shivering: require('../../assets/images/Body_Parts/Whole_Body/shivering_female.png'),
    fatigue: require('../../assets/images/Body_Parts/Whole_Body/fatigue_female.png'),
    tired: require('../../assets/images/Body_Parts/Whole_Body/fatigue_female.png'),
    weakness: require('../../assets/images/Body_Parts/Whole_Body/weakness_female.png'),
    rash: require('../../assets/images/Body_Parts/Whole_Body/rash_female.png'),
    itchy: require('../../assets/images/Body_Parts/Whole_Body/itchy_female.png'),
    dehydration: require('../../assets/images/Body_Parts/Whole_Body/dehydration_female.png'),
    bleeding: require('../../assets/images/Body_Parts/Whole_Body/bleeding_female.png'),
    blood_urine: require('../../assets/images/Body_Parts/Whole_Body/blood_urine_female.png'),
    swelling_parts_of_body: require('../../assets/images/Body_Parts/Whole_Body/swelling_parts_of_body_female.png'),
  },
};

function normalizeKey(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function getImageKey(symptom, partKey) {
  const idKey = normalizeKey(symptom.id);
  const labelKey = normalizeKey(symptom.label_en);

  const aliases = {
    pain:
      partKey === 'jaw'
        ? 'jaw_pain'
        : partKey === 'eye'
        ? 'eye_pain'
        : `${partKey}_pain`,

    headache: 'headache',
    dizziness: 'dizziness',
    unconscious: 'loss_of_consciousness',
    loss_of_consciousness: 'loss_of_consciousness',

    stiff_neck: 'neck_stiffness',
    neck_stiffness: 'neck_stiffness',

    jaw_pain: 'jaw_pain',

    runny_nose: 'runny_nose',
    sneezing: 'sneezing',

    sore_throat: 'sore_throat',

    chest_pain: 'chest_pain',
    cough: 'cough',
    shortness_of_breath: 'shortness_breath',
    difficulty_breathing: 'shortness_breath',
    shortness_breath: 'shortness_breath',

    arm_pain: 'arm_pain',
    arm_weakness: 'arm_weakness',
    swelling_arms: 'arm_swelling',
    swollen_arm: 'arm_swelling',
    arm_swelling: 'arm_swelling',

    back_pain: 'back_pain',

    stomachache: 'stomach_pain',
    stomach_pain: 'stomach_pain',
    nausea: 'nausea',
    vomiting: 'vomiting',
    diarrhoea: 'diarrhoea',
    diarrhea: 'diarrhoea',
    blood_in_stool: 'blood_stool',
    blood_stool: 'blood_stool',

    ear_pain: 'ear_pain',

    eye_pain: 'eye_pain',
    itchy: partKey === 'eye' ? 'eye_itchy' : 'itchy',
    itchy_eye: 'eye_itchy',
    eye_itchy: 'eye_itchy',

    fever: 'fever',
    shivering: 'shivering',
    shiver: 'shivering',
    chills: 'shivering',

    tired: 'fatigue',
    fatigue: 'fatigue',
    weakness: 'weakness',
    rash: 'rash',
    dehydration: 'dehydration',
    bleeding: 'bleeding',

    blood_in_urine: 'blood_urine',
    blood_urine: 'blood_urine',

    swelling_body: 'swelling_parts_of_body',
    swelling_parts_of_body: 'swelling_parts_of_body',
  };

  return aliases[idKey] || aliases[labelKey] || idKey || labelKey;
}

export default function BodySymptomsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang, setLang } = useLanguage();

  const partKey = params.part_key || 'general';
  const gender = params.gender || 'male';
  const part = bodyMap[partKey] || bodyMap.general;

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const symptoms = useMemo(() => {
    return part?.symptoms || [];
  }, [part]);

  const getPartLabel = () => {
    return lang === 'wp' ? part.label_wp : part.label_en;
  };

  const getSymptomLabel = (symptom) => {
    return lang === 'wp' ? symptom.label_wp : symptom.label_en;
  };

  const getSymptomImage = (symptom) => {
    const imageKey = getImageKey(symptom, partKey);
    return SYMPTOM_IMAGES[gender]?.[imageKey] || SYMPTOM_IMAGES.male?.[imageKey];
  };

  const toggleSymptom = (symptom) => {
    const exists = selectedSymptoms.some((item) => item.id === symptom.id);

    if (exists) {
      setSelectedSymptoms((prev) =>
        prev.filter((item) => item.id !== symptom.id)
      );
    } else {
      setSelectedSymptoms((prev) => [...prev, symptom]);
    }
  };

  const handleConfirm = () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('No answer', 'Please select at least one symptom.');
      return;
    }

    const selectedEnglishLabels = selectedSymptoms.map((item) => item.label_en);
    const symptomText = selectedEnglishLabels.join(', ');

    router.push({
      pathname: '/loading',
      params: {
        text: symptomText,
        language: lang || 'en',
        source: 'body',
      },
    });
  };

  const openModal = () => {
    setSelectedLang(null);
    setModalVisible(true);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 120,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const confirmLanguage = () => {
    if (selectedLang) {
      setLang(selectedLang);
      closeModal();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />

      <View style={styles.wrapper}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.container}>
            <View style={styles.headerBar}>
              <Pressable onPress={() => router.back()} style={styles.backCircle}>
                <Text style={styles.backArrow}>←</Text>
              </Pressable>

              <Text style={styles.headerText}>{getPartLabel()}</Text>

              <Pressable style={styles.headerSpeaker}>
                <Image
                  source={require('../../assets/images/speaker.png')}
                  style={styles.headerSpeakerIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            <Text style={styles.hintText}>Tap symptom(s) that match</Text>

            <ScrollView
              style={styles.symptomsScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.symptomsList}
            >
              {symptoms.map((symptom) => {
                const isSelected = selectedSymptoms.some(
                  (item) => item.id === symptom.id
                );

                const symptomImage = getSymptomImage(symptom);

                return (
                  <Pressable
                    key={symptom.id}
                    style={[
                      styles.symptomCard,
                      isSelected && styles.symptomCardActive,
                    ]}
                    onPress={() => toggleSymptom(symptom)}
                  >
                    {symptomImage ? (
                      <Image
                        source={symptomImage}
                        style={styles.symptomImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.symptomImagePlaceholder}>
                        <Text style={styles.placeholderText}>?</Text>
                      </View>
                    )}

                    <Text
                      style={[
                        styles.symptomText,
                        isSelected && styles.symptomTextActive,
                      ]}
                      numberOfLines={2}
                    >
                      {getSymptomLabel(symptom)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.confirmButtonPressed,
              ]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={styles.footerItem}
              onPress={() => router.replace('/input')}
            >
              <Text style={styles.footerIcon}>🏠</Text>
              <Text style={styles.footerText}>{t('home')}</Text>
            </Pressable>

            <Pressable style={styles.footerItem} onPress={openModal}>
              <Text style={styles.footerIcon}>🌐</Text>
              <Text style={styles.footerText}>{t('language')}</Text>
            </Pressable>
          </View>

          <Modal transparent visible={modalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <Animated.View
                style={[
                  styles.languageModal,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                <Text style={styles.modalTitle}>{t('select_language')}</Text>

                <Pressable
                  style={[
                    styles.languageOption,
                    selectedLang === 'en' && styles.languageOptionSelected,
                  ]}
                  onPress={() => setSelectedLang('en')}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      selectedLang === 'en' && styles.languageOptionTextSelected,
                    ]}
                  >
                    {t('english')}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.languageOption,
                    selectedLang === 'wp' && styles.languageOptionSelected,
                  ]}
                  onPress={() => setSelectedLang('wp')}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      selectedLang === 'wp' && styles.languageOptionTextSelected,
                    ]}
                  >
                    {t('warlpiri')}
                  </Text>
                </Pressable>

                <Text style={styles.confirmTextSmall}>{t('change_language')}</Text>

                <View style={styles.modalButtonRow}>
                  <Pressable style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.cancelText}>{t('no')}</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.confirmModalButton,
                      !selectedLang && styles.disabledButton,
                    ]}
                    disabled={!selectedLang}
                    onPress={confirmLanguage}
                  >
                    <Text style={styles.confirmButtonText}>{t('yes')}</Text>
                  </Pressable>
                </View>
              </Animated.View>
            </View>
          </Modal>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}