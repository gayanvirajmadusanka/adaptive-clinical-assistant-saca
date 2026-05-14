// BodySymptomsScreen.js
// Purpose: Shows symptoms for selected body part.
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

export default function BodySymptomsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang, setLang } = useLanguage();

  const partKey = params.part_key || 'general';
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

                return (
                  <Pressable
                    key={symptom.id}
                    style={[
                      styles.symptomButton,
                      isSelected && styles.symptomButtonActive,
                    ]}
                    onPress={() => toggleSymptom(symptom)}
                  >
                    <Text
                      style={[
                        styles.symptomText,
                        isSelected && styles.symptomTextActive,
                      ]}
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
                      selectedLang === 'en' &&
                        styles.languageOptionTextSelected,
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
                      selectedLang === 'wp' &&
                        styles.languageOptionTextSelected,
                    ]}
                  >
                    {t('warlpiri')}
                  </Text>
                </Pressable>

                <Text style={styles.confirmTextSmall}>
                  {t('change_language')}
                </Text>

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