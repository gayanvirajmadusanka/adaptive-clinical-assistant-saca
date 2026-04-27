import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
  Image,
  Modal,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/detectedSymptomsStyles';

export default function DetectedSymptomsScreen() {
  const router = useRouter();
  const { t, setLang } = useLanguage();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const speakSymptoms = () => {
    Speech.stop();

    Speech.speak(
      t('detected_speak') ||
        'Detected symptoms are headache, fever, body pain, and tiredness.',
      {
        language: 'en-AU',
        rate: 0.9,
      }
    );
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
              <Text style={styles.headerText}>{t('detected_title')}</Text>
            </View>

            <View style={styles.symptomBox}>
              <Text style={styles.symptomText}>
                • headache{'\n'}
                • fever{'\n'}
                • body pain{'\n'}
                • tiredness
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.speakerButton,
                  pressed && styles.speakerPressed,
                ]}
                onPress={speakSymptoms}
              >
                <Image
                  source={require('../../assets/images/speaker.png')}
                  style={styles.speakerIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            <Text style={styles.questionText}>{t('detected_question')}</Text>

            <View style={styles.buttonRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.choiceButton,
                  pressed && styles.choicePressed,
                ]}
                onPress={() => router.push('/tellusmore')}
              >
                <Text style={styles.choiceText}>{t('yes')}</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.choiceButton,
                  pressed && styles.choicePressed,
                ]}
                onPress={() => router.replace('/textinput')}
              >
                <Text style={styles.choiceText}>{t('no')}</Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backPressedGrey,
              ]}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>{t('back')}</Text>
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

                <Text style={styles.confirmText}>{t('change_language')}</Text>

                <View style={styles.modalButtonRow}>
                  <Pressable style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.cancelText}>{t('no')}</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.confirmButton,
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