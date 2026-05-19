// ResultScreen.js
// Purpose: Displays final triage result using local audio and local icons.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Animated,
  Linking,
  Alert,
  BackHandler,
  ScrollView,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import styles, { resultTheme } from '../styles/resultStyles';

import { classifySymptoms } from '../services/triageApi';
import { parseJsonParam } from '../utils/routeParams';

const severityAudioMap = {
  mild: {
    en: require('../../assets/audio/ui/severity_mild_en.wav'),
    wp: require('../../assets/audio/ui/severity_mild_wp.wav'),
  },
  moderate: {
    en: require('../../assets/audio/ui/severity_moderate_en.wav'),
    wp: require('../../assets/audio/ui/severity_moderate_wp.wav'),
  },
  severe: {
    en: require('../../assets/audio/ui/severity_severe_en.wav'),
    wp: require('../../assets/audio/ui/severity_severe_wp.wav'),
  },
};

const severityIcons = {
  mild: require('../../assets/images/result_icons/smiley_mild.png'),
  moderate: require('../../assets/images/result_icons/smiley_moderate.png'),
  severe: require('../../assets/images/result_icons/severity_icon.png'),
};

const recommendationIcons = {
  mild: require('../../assets/images/result_icons/recommendation_mild.png'),
  moderate: require('../../assets/images/result_icons/recommendation_moderate.png'),
  severe: require('../../assets/images/result_icons/recommendation_severe.png'),
};

const symptomIcons = {
  mild: require('../../assets/images/result_icons/symptom_mild.png'),
  moderate: require('../../assets/images/result_icons/symptom_moderate.png'),
  severe: require('../../assets/images/result_icons/symptom_severe.png'),
};

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang } = useLanguage();

  const initialResultData = parseJsonParam(params.result_data, null);
  const classifyPayload = parseJsonParam(params.classify_payload, null);

  const [resultData, setResultData] = useState(initialResultData);
  const [changingLanguage, setChangingLanguage] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const emergencyPulseAnim = useRef(new Animated.Value(1)).current;
  const soundRef = useRef(null);

  const getSeverityKey = () => {
    const rawSeverity =
      resultData?.severity_mode ||
      resultData?.severity ||
      'mild';

    const value = String(rawSeverity).toLowerCase();

    if (value.includes('severe') || value.includes('wirinyayirni')) {
      return 'severe';
    }

    if (value.includes('moderate') || value.includes('wiriwiri')) {
      return 'moderate';
    }

    return 'mild';
  };

  const severity = getSeverityKey();
  const theme = resultTheme[severity] || resultTheme.mild;

  const symptoms = resultData?.symptoms || [];
  const recommendation = resultData?.recommendation || '';
  const recommendedAction = resultData?.recommended_action || '';
  const hasCritical = resultData?.has_critical || false;

  const translatedSymptoms = symptoms.map((item) => {
    const key = String(item).toLowerCase().replaceAll(' ', '_');
    return t(key);
  });

  const getSeverityText = () => {
    if (severity === 'severe') return t('severe_label');
    if (severity === 'moderate') return t('moderate_label');
    return t('mild_label');
  };

  const getSeveritySubtitle = () => {
    if (severity === 'severe') {
      return t('seek_emergency_help_now') || 'Seek emergency help now';
    }

    if (severity === 'moderate') {
      return t('medical_attention_recommended') || 'Medical attention recommended';
    }

    return t('you_can_treat_this_at_home') || 'You can treat this at home';
  };

  const getTranslationSafe = (key, fallback) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

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

    if (severity === 'severe' || severity === 'moderate') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(emergencyPulseAnim, {
            toValue: 1.04,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(emergencyPulseAnim, {
            toValue: 1,
            duration: 700,
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

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      const selectedLang = lang === 'wp' ? 'wp' : 'en';
      const audioSource = severityAudioMap?.[severity]?.[selectedLang];

      if (!audioSource) {
        Alert.alert('Audio Error', 'No local result audio found.');
        return;
      }

      const { sound } = await Audio.Sound.createAsync(audioSource, {
        shouldPlay: true,
        volume: 1.0,
      });

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          try {
            if (soundRef.current === sound) {
              soundRef.current = null;
            }

            await sound.unloadAsync();
          } catch (error) {
            console.log('Unload result audio error:', error);
          }
        }
      });
    } catch (error) {
      console.log('Result audio error:', error);
      Alert.alert('Audio Error', 'Cannot play result audio.');
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const beforeLanguageChange = async () => {
    await stopAudio();
  };

  const afterLanguageChange = async (selectedLang) => {
    if (!classifyPayload) {
      Alert.alert('Error', 'Could not reload result in selected language.');
      return;
    }

    try {
      setChangingLanguage(true);
      await stopAudio();

      const data = await classifySymptoms(
        classifyPayload.symptoms,
        classifyPayload.answers,
        selectedLang
      );

      setResultData(data);
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
    <AppScreen
      languageLabel={changingLanguage ? 'Updating...' : undefined}
      languageModalDisabled={changingLanguage}
      beforeLanguageChange={beforeLanguageChange}
      afterLanguageChange={afterLanguageChange}
      onHomePress={async () => {
        await stopAudio();
        router.replace('/input');
      }}
    >
      <View style={styles.contentWrapper}>
        <View
          style={[
            styles.resultCard,
            { backgroundColor: theme.screenBackground },
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
                pressed && styles.speakerPressed,
              ]}
              onPress={speakResult}
            >
              <Image
                source={require('../../assets/images/speaker.png')}
                style={styles.speakerIcon}
                resizeMode="contain"
              />
            </Pressable>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View
                style={[
                  styles.severityCard,
                  { backgroundColor: theme.severityFill },
                ]}
              >
                <Image
                  source={severityIcons[severity]}
                  style={styles.severityIconLarge}
                  resizeMode="contain"
                />

                <View style={styles.severityTextBox}>
                  <Text style={styles.severityTitle}>
                    {getSeverityText()}
                  </Text>

                  <Text style={styles.severitySubtitle}>
                    {getSeveritySubtitle()}
                  </Text>
                </View>
              </View>

              {(severity === 'severe' || severity === 'moderate') && (
                <Animated.View
                  style={{
                    transform: [{ scale: emergencyPulseAnim }],
                  }}
                >
                  <Pressable
                    style={({ pressed }) => [
                      styles.callButton,
                      severity === 'severe'
                        ? styles.callButtonSevere
                        : styles.callButtonModerate,
                      pressed && styles.pressedButton,
                    ]}
                    onPress={callEmergency}
                  >
                    <Text style={styles.callButtonText}>
                      📞 {t('call_emergency')}
                    </Text>
                  </Pressable>
                </Animated.View>
              )}

              <View
                style={[
                  styles.infoCard,
                  {
                    borderColor: theme.boxBorder,
                    backgroundColor: theme.cardBackground,
                  },
                ]}
              >
                <Image
                  source={recommendationIcons[severity]}
                  style={styles.infoIconLarge}
                  resizeMode="contain"
                />

                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>
                    {t('recommendations')}
                  </Text>

                  {recommendation ? (
                    <Text style={styles.infoText}>• {recommendation}</Text>
                  ) : null}

                  {recommendedAction ? (
                    <Text style={styles.infoText}>• {recommendedAction}</Text>
                  ) : null}

                  {hasCritical && (
                    <Text style={styles.infoText}>
                      • {getTranslationSafe(
                        'critical_symptoms_detected',
                        'Critical symptoms detected'
                      )}
                    </Text>
                  )}
                </View>
              </View>

              <View
                style={[
                  styles.infoCard,
                  styles.symptomCard,
                  {
                    borderColor: theme.boxBorder,
                    backgroundColor: theme.cardBackground,
                  },
                ]}
              >
                <Image
                  source={symptomIcons[severity]}
                  style={styles.infoIconLarge}
                  resizeMode="contain"
                />

                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>
                    {t('symptoms')}
                  </Text>

                  {translatedSymptoms.length > 0 ? (
                    translatedSymptoms.map((item, index) => (
                      <Text key={`${item}-${index}`} style={styles.infoText}>
                        • {item}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.infoText}>
                      {getTranslationSafe(
                        'no_symptoms_found',
                        'No symptoms found'
                      )}
                    </Text>
                  )}
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.startAgainButton,
                  pressed && styles.startAgainPressed,
                ]}
                onPress={async () => {
                  await stopAudio();
                  router.replace('/input');
                }}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.startAgainText,
                      pressed && styles.startAgainTextPressed,
                    ]}
                  >
                    ⟳ {t('start_again')}
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}