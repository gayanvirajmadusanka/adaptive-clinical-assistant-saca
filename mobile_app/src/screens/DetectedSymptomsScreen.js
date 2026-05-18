// DetectedSymptomsScreen.js
// Purpose: Displays symptoms detected by the FastAPI backend.
// AppScreen handles SafeArea, background, footer, and language modal.
// Text flow  -> TellUsMoreScreen
// Voice flow -> TellUsMoreVoiceScreen
// Body flow  -> BodyTellUsMoreScreen

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

export default function DetectedSymptomsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang } = useLanguage();

  const symptomsEn = parseJsonParam(params.symptoms_en, []);
  const symptomsWp = parseJsonParam(params.symptoms_wp, []);

  const isVoiceFlow = params.source === 'voice';
  const isBodyFlow = params.source === 'body';
  const initialVoiceFileUri = params.voice_file_uri || null;

  const [voiceFileUri, setVoiceFileUri] = useState(initialVoiceFileUri);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const soundRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, [])
  );

  // Translate symptom display from English symptom keys using translations.js.
  // Example: fever -> t('fever') -> English or Warlpiri depending on current language.
  const symptomsToShow = symptomsEn.map((item) => {
    const key = String(item).toLowerCase().replaceAll(' ', '_');
    return t(key);
  });

  const symptomText =
    symptomsToShow.length > 0
      ? symptomsToShow.map((item) => `• ${item}`).join('\n')
      : 'No symptoms detected';

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
      console.log('Stop audio error:', error);
    }
  };

  async function fetchAudioForLanguage(languageCode) {
    try {
      setAudioLoading(true);

      // Prefer backend-provided Warlpiri symptoms for Warlpiri audio.
      // If symptoms_wp is empty, use the translated text currently shown on screen.
      const translatedText = symptomsEn
        .map((item) => {
          const key = String(item).toLowerCase().replaceAll(' ', '_');
          return t(key);
        })
        .join(' ');

      const textToSend =
        languageCode === 'wp'
          ? symptomsWp.length > 0
            ? symptomsWp.join(' ')
            : translatedText
          : symptomsEn.join(' ');

      const data = await extractSymptomsFromText(textToSend, languageCode);

      const newFile = await saveBase64AudioToCache(
        data?.voice_b64,
        `voice_${languageCode}.wav`
      );

      if (newFile) {
        setVoiceFileUri(newFile);
      }
    } catch (error) {
      console.log('Audio update error:', error);
      Alert.alert('Audio Error', 'Could not update audio.');
    } finally {
      setAudioLoading(false);
    }
  }

  const playVoiceAudio = async () => {
    try {
      if (!voiceFileUri) {
        Alert.alert('Audio Error', 'No audio file found.');
        return;
      }

      if (audioLoading) {
        Alert.alert('Please wait', 'Updating audio...');
        return;
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      await stopCurrentAudio();

      const { sound } = await Audio.Sound.createAsync(
        { uri: voiceFileUri },
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
            console.log('Finished audio unload error:', error);
          }
        }
      });
    } catch (error) {
      console.log('Play error:', error);
      Alert.alert('Audio Error', 'Unable to play audio.');
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
            console.log('Cleanup audio error:', error);
          });
      }
    };
  }, []);

  // Called by AppScreen before changing language from the footer modal.
  const beforeLanguageChange = async () => {
    await stopCurrentAudio();
  };

  // Called by AppScreen after changing language from the footer modal.
  const afterLanguageChange = async (selectedLang) => {
    if (selectedLang === 'wp' && symptomsEn.length === 0) {
      setErrorModalVisible(true);
      return;
    }

    await fetchAudioForLanguage(selectedLang);
  };

  const handleYesPress = async () => {
    if (loading) return;

    if (lang === 'wp' && symptomsEn.length === 0) {
      setErrorModalVisible(true);
      return;
    }

    setLoading(true);
    await stopCurrentAudio();

    router.push({
      pathname: isBodyFlow
        ? '/bodytellusmore'
        : isVoiceFlow
        ? '/tellusmorevoice'
        : '/tellusmore',

      params: {
        symptoms_en: toJsonParam(symptomsEn),
        symptoms_wp: toJsonParam(symptomsWp),
        language: lang,
        gender: params.gender || 'male',
        source: params.source || 'text',
      },
    });
  };

  const handleNoPress = async () => {
    await stopCurrentAudio();

    if (isBodyFlow) {
      router.replace('/bodyinput');
    } else if (isVoiceFlow) {
      router.replace('/voiceinput');
    } else {
      router.replace('/textinput');
    }
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
