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
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useLanguage } from '../context/LanguageContext';
import styles, { resultTheme } from '../styles/resultStyles';

export default function ResultScreen() {
  const router = useRouter();
  const { t, setLang } = useLanguage();
  const { painLevel, duration } = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const getSeverity = () => {
    if (
      painLevel === 'Unbearable' ||
      painLevel === 'Very bad' ||
      duration === 'More than a week'
    ) {
      return 'severe';
    }

    if (
      painLevel === 'Moderate' ||
      duration === 'About a week' ||
      duration === '2–3 days'
    ) {
      return 'moderate';
    }

    return 'mild';
  };

  const severity = getSeverity();
  const theme = resultTheme[severity];

  const speakResult = () => {
    Speech.stop();
    Speech.speak(t(`${severity}_speak`), {
      language: 'en-AU',
      rate: 0.9,
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

  const callEmergency = () => {
    Linking.openURL('tel:000');
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
          <View style={styles.contentWrapper}>
            <View
              style={[
                styles.resultCard,
                { backgroundColor: theme.cardBackground },
              ]}
            >
              <View style={[styles.headerBar, { backgroundColor: theme.header }]}>
                <Text style={[styles.headerText, { color: theme.headerText }]}>
                  {t('result')}
                </Text>
              </View>

              <View style={styles.content}>
                <Pressable
                  style={({ pressed }) => [
                    styles.speakerButton,
                    pressed && styles.pressedButton,
                  ]}
                  onPress={speakResult}
                >
                  <Image
                    source={require('../../assets/images/speaker.png')}
                    style={styles.speakerIcon}
                    resizeMode="contain"
                  />
                </Pressable>

                <View
                  style={[
                    styles.severityBadge,
                    { backgroundColor: theme.severityFill },
                  ]}
                >
                  <Text
                    style={[
                      styles.severityText,
                      { color: theme.severityText },
                    ]}
                  >
                    {t(`${severity}_label`)}
                  </Text>
                </View>

                {severity === 'severe' && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.callButton,
                      pressed && styles.pressedButton,
                    ]}
                    onPress={callEmergency}
                  >
                    <Text style={styles.callButtonText}>
                      {t('call_emergency')}
                    </Text>
                  </Pressable>
                )}

                <View
                  style={[
                    styles.infoBox,
                    {
                      backgroundColor: theme.boxBackground,
                      borderColor: theme.boxBorder,
                    },
                  ]}
                >
                  <Text style={[styles.infoTitle, { color: theme.boxText }]}>
                    {t('symptoms')}
                  </Text>

                  <Text style={[styles.infoText, { color: theme.boxText }]}>
                    • {t('headache')}
                  </Text>
                  <Text style={[styles.infoText, { color: theme.boxText }]}>
                    • {t('fever')}
                  </Text>
                  <Text style={[styles.infoText, { color: theme.boxText }]}>
                    • {t('body_pain')}
                  </Text>
                  <Text style={[styles.infoText, { color: theme.boxText }]}>
                    • {t('tiredness')}
                  </Text>
                </View>

                <View
                  style={[
                    styles.infoBox,
                    {
                      backgroundColor: theme.boxBackground,
                      borderColor: theme.boxBorder,
                    },
                  ]}
                >
                  <Text style={[styles.infoTitle, { color: theme.boxText }]}>
                    {t('recommendations')}
                  </Text>

                  <Text style={[styles.infoText, { color: theme.boxText }]}>
                    • {t(`${severity}_recommendation_1`)}
                  </Text>
                  <Text style={[styles.infoText, { color: theme.boxText }]}>
                    • {t(`${severity}_recommendation_2`)}
                  </Text>
                  <Text style={[styles.infoText, { color: theme.boxText }]}>
                    • {t(`${severity}_recommendation_3`)}
                  </Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.startAgainButton,
                    { borderColor: theme.startAgain },
                    pressed && styles.pressedButton,
                  ]}
                  onPress={() => router.replace('/input')}
                >
                  <Text
                    style={[
                      styles.startAgainText,
                      { color: theme.startAgain },
                    ]}
                  >
                    {t('start_again')}
                  </Text>
                </Pressable>
              </View>
            </View>
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