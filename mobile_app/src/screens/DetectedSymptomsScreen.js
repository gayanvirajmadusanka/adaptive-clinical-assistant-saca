// DetectedSymptomsScreen.js
// Purpose: Displays symptoms detected by the FastAPI backend.
// If no symptoms are detected, it shows an error popup and returns to TextInputScreen.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  Alert,
  ImageBackground,
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

  const [voiceFileUri, setVoiceFileUri] = useState(null);
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

  useEffect(() => {
    if (symptomsEn.length === 0 && symptomsWp.length === 0) {
      setErrorModalVisible(true);
    }
  }, []);

  useEffect(() => {
    updateAudioForCurrentLanguage();
  }, [lang]);

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
      : '';

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

  const updateAudioForCurrentLanguage = async () => {
    try {
      await stopCurrentAudio();

      if (lang === 'wp' && voiceFileUriWp) {
        setVoiceFileUri(voiceFileUriWp);
        return;
      }

      if (lang !== 'wp' && voiceFileUriEn) {
        setVoiceFileUri(voiceFileUriEn);
        return;
      }

      setVoiceFileUri(null);
    } catch (error) {
      console.log('Update current language audio error:', error);
    }
  };

  async function fetchAudioForLanguage(languageCode) {
    try {
      setAudioLoading(true);
      await stopCurrentAudio();

      if (languageCode === 'en' && voiceFileUriEn) {
        setVoiceFileUri(voiceFileUriEn);
        return voiceFileUriEn;
      }

      if (languageCode === 'wp' && voiceFileUriWp) {
        setVoiceFileUri(voiceFileUriWp);
        return voiceFileUriWp;
      }

      const textToSend =
        languageCode === 'wp'
          ? symptomsWp.length > 0
            ? symptomsWp.join(' ')
            : symptomsEn.join(' ')
          : symptomsEn.join(' ');

      if (!textToSend) {
        return null;
      }

      const data = await extractSymptomsFromText(textToSend, languageCode);

      const audioBase64 =
        languageCode === 'wp'
          ? data?.voice_b64_wp || data?.voice_b64 || ''
          : data?.voice_b64_en || data?.voice_b64 || '';

      if (!audioBase64) {
        return null;
      }

      const newFile = await saveBase64AudioToCache(
        audioBase64,
        `detected_symptoms_${languageCode}.wav`
      );

      if (languageCode === 'wp') {
        setVoiceFileUriWp(newFile);
      } else {
        setVoiceFileUriEn(newFile);
      }

      setVoiceFileUri(newFile);
      return newFile;
    } catch (error) {
      console.log('Audio update error:', error);
      Alert.alert('Audio Error', 'Could not update audio.');
      return null;
    } finally {
      setAudioLoading(false);
    }
  }

  const playVoiceAudio = async () => {
    try {
      if (audioLoading) {
        Alert.alert('Please wait', 'Preparing audio...');
        return;
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      await stopCurrentAudio();

      let fileUri = lang === 'wp' ? voiceFileUriWp : voiceFileUriEn;

      if (!fileUri) {
        fileUri = await fetchAudioForLanguage(lang);
      }

      if (!fileUri) {
        Alert.alert('Audio Error', 'No audio file found.');
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

  const beforeLanguageChange = async () => {
    await stopCurrentAudio();
  };

  const afterLanguageChange = async (selectedLang) => {
    await fetchAudioForLanguage(selectedLang);
  };

  const goBackToTextInput = async () => {
    await stopCurrentAudio();
    setErrorModalVisible(false);
    router.replace('/textinput');
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
              <Text style={styles.errorTitle}>{t('no_symptoms_detected')}</Text>

              <Pressable
                onPress={goBackToTextInput}
                style={styles.errorCloseButton}
              >
                <Text style={styles.errorCloseText}>×</Text>
              </Pressable>
            </View>

            <ImageBackground
              source={require('../../assets/images/background.png')}
              style={styles.errorBody}
              resizeMode="cover"
            >
              <Text style={styles.errorMessageBold}>
                {t('no_symptoms_message_1')}
              </Text>

              <Text style={styles.errorMessage}>
                {t('no_symptoms_message_2')}
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.errorOkButton,
                  pressed && styles.errorOkButtonPressed,
                ]}
                onPress={goBackToTextInput}
              >
                <Text style={styles.errorOkText}>{t('ok')}</Text>
              </Pressable>
            </ImageBackground>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}