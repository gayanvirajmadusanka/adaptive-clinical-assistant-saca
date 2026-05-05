import React, { useEffect, useRef, useState } from 'react';
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
  Alert,
  BackHandler,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { useLanguage } from '../context/LanguageContext';
import styles, { resultTheme } from '../styles/resultStyles';
import { classifySymptoms } from '../services/triageApi';
import { saveBase64AudioToCache } from '../utils/base64Audio';
import { parseJsonParam } from '../utils/routeParams';


export default function ResultScreen() {
  const router = useRouter();
  const { t, setLang } = useLanguage();
  const params = useLocalSearchParams();

  const initialResultData = parseJsonParam(params.result_data, null);

  const classifyPayload = parseJsonParam(params.classify_payload, null);

  const [resultData, setResultData] = useState(initialResultData);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);
  const [changingLanguage, setChangingLanguage] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const soundRef = useRef(null);

  const severity = resultData?.severity_mode
    ? resultData.severity_mode.toLowerCase()
    : 'mild';

  const theme = resultTheme[severity] || resultTheme.mild;

  const symptoms = resultData?.symptoms || [];
  const recommendation = resultData?.recommendation || '';
  const recommendedAction = resultData?.recommended_action || '';
  const confidence = resultData?.confidence || 0;
  const hasCritical = resultData?.has_critical || false;

  useEffect(() => {
    const backAction = () => {
      router.replace('/input');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (severity === 'severe') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [severity]);

  const stopAudio = async () => {
    try {
      Speech.stop();

      if (soundRef.current) {
        const sound = soundRef.current;
        soundRef.current = null;

        const status = await sound.getStatusAsync();

        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      }
    } catch (error) {
      console.log('Stop audio error:', error);
    }
  };

  const speakResult = async () => {
    try {
      await stopAudio();

      if (resultData?.voice_b64) {
        const fileUri = await saveBase64AudioToCache(
          resultData.voice_b64,
          'saca_result_voice.wav'
        );

        const { sound } = await Audio.Sound.createAsync(
          { uri: fileUri },
          { shouldPlay: true, volume: 1.0 }
        );

        soundRef.current = sound;
        return;
      }

      const textToSpeak = `
        Severity is ${resultData?.severity || severity}.
        ${recommendedAction}
      `;

      Speech.speak(textToSpeak, {
        language: 'en-AU',
        rate: 0.9,
      });
    } catch (error) {
      console.log('Result audio error:', error);
      Alert.alert('Audio Error', 'Cannot play result audio.');
    }
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

  const confirmLanguage = async () => {
    if (!selectedLang || !classifyPayload) return;

    try {
      setChangingLanguage(true);
      await stopAudio();

      const data = await classifySymptoms(
        classifyPayload.symptoms,
        classifyPayload.answers,
        selectedLang
      );

      setResultData(data);
      setLang(selectedLang);
      closeModal();
    } catch (error) {
      console.log('Language result API error:', error);
      Alert.alert('Error', 'Could not reload result in selected language.');
    } finally {
      setChangingLanguage(false);
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
                    severity === 'severe' && styles.severeBadge,
                  ]}
                >
                  {severity === 'severe' ? (
                    <View style={styles.severeBadgeRow}>
                      <Text style={styles.warningIcon}>⚠</Text>
                      <Text
                        style={[
                          styles.severityText,
                          { color: theme.severityText },
                        ]}
                      >
                        Severe - Seek help now
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.severityText,
                        { color: theme.severityText },
                      ]}
                    >
                      {resultData?.severity || severity.toUpperCase()}
                    </Text>
                  )}
                </View>

                {severity === 'severe' && (
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.callButton,
                        pressed && styles.pressedButton,
                      ]}
                      onPress={callEmergency}
                    >
                      <View style={styles.callButtonContent}>
                        <Text style={styles.callIcon}>📞</Text>
                        <Text style={styles.callButtonText}>
                          {t('call_emergency')}
                        </Text>
                      </View>
                    </Pressable>
                  </Animated.View>
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
                    Symptoms
                  </Text>

                  {symptoms.length > 0 ? (
                    symptoms.map((item, index) => (
                      <Text
                        key={`${item}-${index}`}
                        style={[styles.infoText, { color: theme.boxText }]}
                      >
                        • {item}
                      </Text>
                    ))
                  ) : (
                    <Text style={[styles.infoText, { color: theme.boxText }]}>
                      No symptoms found
                    </Text>
                  )}
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
                    Recommendation
                  </Text>

                  <Text style={[styles.infoText, { color: theme.boxText }]}>
                    • {recommendation}
                  </Text>

                  <Text style={[styles.infoText, { color: theme.boxText }]}>
                    • {recommendedAction}
                  </Text>

                  <Text style={[styles.infoText, { color: theme.boxText }]}>
                    • Confidence: {Math.round(confidence * 100)}%
                  </Text>

                  {hasCritical && (
                    <Text style={[styles.infoText, { color: theme.boxText }]}>
                      • Critical symptoms detected
                    </Text>
                  )}
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

                <Text style={styles.confirmText}>
                  {changingLanguage
                    ? 'Changing language...'
                    : t('change_language')}
                </Text>

                <View style={styles.modalButtonRow}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={closeModal}
                    disabled={changingLanguage}
                  >
                    <Text style={styles.cancelText}>{t('no')}</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.confirmButton,
                      (!selectedLang || changingLanguage) &&
                        styles.disabledButton,
                    ]}
                    disabled={!selectedLang || changingLanguage}
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