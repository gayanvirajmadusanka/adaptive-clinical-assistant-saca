// DetectedSymptomsVoiceScreen.js
// Purpose: Displays symptoms detected from voice input.
// Supports audio playback using voice_b64_en / voice_b64_wp.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  Alert,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/detectedSymptomsStyles';

import { extractSymptomsFromText } from '../services/triageApi';
import { saveBase64AudioToCache } from '../utils/base64Audio';
import { parseJsonParam, toJsonParam } from '../utils/routeParams';

export default function DetectedSymptomsVoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang } = useLanguage();

  const symptomsEn = parseJsonParam(params.symptoms_en, []);
  const symptomsWp = parseJsonParam(params.symptoms_wp, []);

  const [voiceFileUriEn, setVoiceFileUriEn] = useState(null);
  const [voiceFileUriWp, setVoiceFileUriWp] = useState(null);

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const soundRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, [])
  );

  const symptomsToShow =
    lang === 'wp' && symptomsWp.length > 0
      ? symptomsWp
      : symptomsEn.map((item) => {
          const key = String(item).toLowerCase().replaceAll(' ', '_');
          return t(key);
        });

  const symptomText =
    symptomsToShow.length > 0
      ? symptomsToShow.map((item) => `• ${item}`).join('\n')
      : 'No symptoms detected';

  useEffect(() => {
    prepareInitialAudio();
  }, []);

  async function prepareInitialAudio() {
    try {
      const voiceB64En = String(params.voice_b64_en || '');
      const voiceB64Wp = String(params.voice_b64_wp || '');

      console.log('VOICE detected EN audio length:', voiceB64En.length);
      console.log('VOICE detected WP audio length:', voiceB64Wp.length);

      if (voiceB64En) {
        const fileEn = await saveBase64AudioToCache(
          voiceB64En,
          'voice_detected_symptoms_en.wav'
        );

        setVoiceFileUriEn(fileEn);
      }

      if (voiceB64Wp) {
        const fileWp = await saveBase64AudioToCache(
          voiceB64Wp,
          'voice_detected_symptoms_wp.wav'
        );

        setVoiceFileUriWp(fileWp);
      }
    } catch (error) {
      console.log('Prepare voice initial audio error:', error);
    }
  }

  const stopCurrentAudio = async () => {
    try {
      if (soundRef.current) {
        const currentSound = soundRef.current;
        soundRef.current = null;

        const status = await currentSound.getStatusAsync();

        if (status.isLoaded) {
          await currentSound.stopAsync();
          await currentSound.unloadAsync();
        }
      }
    } catch (error) {
      console.log('Stop voice audio error:', error);
    }
  };

  async function getAudioFileForLanguage(languageCode) {
    const selectedLang = languageCode === 'wp' ? 'wp' : 'en';

    if (selectedLang === 'wp' && voiceFileUriWp) {
      return voiceFileUriWp;
    }

    if (selectedLang === 'en' && voiceFileUriEn) {
      return voiceFileUriEn;
    }

    const directAudio =
      selectedLang === 'wp'
        ? String(params.voice_b64_wp || '')
        : String(params.voice_b64_en || '');

    if (directAudio) {
      const fileUri = await saveBase64AudioToCache(
        directAudio,
        `voice_detected_symptoms_${selectedLang}.wav`
      );

      if (selectedLang === 'wp') {
        setVoiceFileUriWp(fileUri);
      } else {
        setVoiceFileUriEn(fileUri);
      }

      return fileUri;
    }

    const textToSend =
      selectedLang === 'wp'
        ? symptomsWp.length > 0
          ? symptomsWp.join(' ')
          : symptomsEn.join(' ')
        : symptomsEn.join(' ');

    if (!textToSend) {
      return null;
    }

    const data = await extractSymptomsFromText(textToSend, selectedLang);

    const audioBase64 =
      selectedLang === 'wp'
        ? String(data?.voice_b64_wp || '')
        : String(data?.voice_b64_en || '');

    if (!audioBase64) {
      return null;
    }

    const fileUri = await saveBase64AudioToCache(
      audioBase64,
      `voice_detected_symptoms_${selectedLang}.wav`
    );

    if (selectedLang === 'wp') {
      setVoiceFileUriWp(fileUri);
    } else {
      setVoiceFileUriEn(fileUri);
    }

    return fileUri;
  }

  const playVoiceAudio = async () => {
    try {
      if (audioLoading) {
        Alert.alert('Please wait', 'Preparing audio...');
        return;
      }

      setAudioLoading(true);

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      await stopCurrentAudio();

      const fileUri = await getAudioFileForLanguage(lang);

      console.log('Playing voice detected audio:', fileUri);

      if (!fileUri) {
        Alert.alert(
          'Audio Error',
          'No detected symptoms audio found.'
        );
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        {
          shouldPlay: true,
          volume: 1.0,
        }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          try {
            if (soundRef.current === sound) {
              soundRef.current = null;
            }

            await sound.unloadAsync();
          } catch (error) {
            console.log('Finished voice audio unload error:', error);
          }
        }
      });
    } catch (error) {
      console.log('Play voice detected audio error:', error);
      Alert.alert('Audio Error', 'Unable to play audio.');
    } finally {
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        const currentSound = soundRef.current;
        soundRef.current = null;

        currentSound
          .getStatusAsync()
          .then((status) => {
            if (status.isLoaded) {
              currentSound.stopAsync();
              currentSound.unloadAsync();
            }
          })
          .catch((error) => {
            console.log('Cleanup voice audio error:', error);
          });
      }
    };
  }, []);

  const beforeLanguageChange = async () => {
    await stopCurrentAudio();
  };

  const afterLanguageChange = async (selectedLang) => {
    try {
      setAudioLoading(true);
      await stopCurrentAudio();
      await getAudioFileForLanguage(selectedLang);
    } catch (error) {
      console.log('Voice language audio update error:', error);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleYesPress = async () => {
    if (loading) return;

    if (symptomsEn.length === 0 && symptomsWp.length === 0) {
      setErrorModalVisible(true);
      return;
    }

    setLoading(true);
    await stopCurrentAudio();

    router.push({
      pathname: '/tellusmorevoice',
      params: {
        symptoms_en: toJsonParam(symptomsEn),
        symptoms_wp: toJsonParam(symptomsWp),
        language: lang,
        source: 'voice',
      },
    });
  };

  const handleNoPress = async () => {
    await stopCurrentAudio();
    router.replace('/voiceinput');
  };

  return (
    <AppScreen
      languageLabel={audioLoading ? 'Updating...' : undefined}
      languageModalDisabled={audioLoading}
      beforeLanguageChange={beforeLanguageChange}
      afterLanguageChange={afterLanguageChange}
      onHomePress={async () => {
        await stopCurrentAudio();
        router.replace('/input');
      }}
    >
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>{t('detected_title')}</Text>
        </View>

        <View style={styles.symptomBox}>
          <Text style={styles.symptomText}>{symptomText}</Text>

          <Pressable
            style={({ pressed }) => [
              styles.speakerButton,
              pressed && styles.speakerPressed,
            ]}
            onPress={playVoiceAudio}
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
            onPress={handleYesPress}
          >
            <Text style={styles.choiceText}>{t('yes')}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.choiceButton,
              pressed && styles.choicePressed,
            ]}
            onPress={handleNoPress}
          >
            <Text style={styles.choiceText}>{t('no')}</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backPressedGrey,
          ]}
          onPress={async () => {
            await stopCurrentAudio();
            router.back();
          }}
        >
          <View style={styles.backButtonContent}>
            <Image
              source={require('../../assets/images/back-arrow.png')}
              style={styles.backArrowImage}
              resizeMode="contain"
            />

            <Text style={styles.backText}>{t('back')}</Text>
          </View>
        </Pressable>
      </View>

      <Modal transparent visible={errorModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalBox}>
            <View style={styles.errorHeader}>
              <Text style={styles.errorTitle}>No Symptoms Detected</Text>

              <Pressable
                onPress={() => setErrorModalVisible(false)}
                style={styles.errorCloseButton}
              >
                <Text style={styles.errorCloseText}>×</Text>
              </Pressable>
            </View>

            <View style={styles.errorBody}>
              <Text style={styles.errorMessageBold}>
                We could not detect any symptoms from your description.
              </Text>

              <Text style={styles.errorMessage}>
                Please try describing your symptoms in more detail.
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.errorOkButton,
                  pressed && styles.errorOkButtonPressed,
                ]}
                onPress={() => setErrorModalVisible(false)}
              >
                <Text style={styles.errorOkText}>Ok</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}