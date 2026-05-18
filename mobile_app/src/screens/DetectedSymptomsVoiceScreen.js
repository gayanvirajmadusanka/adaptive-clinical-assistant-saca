// DetectedSymptomsVoiceScreen.js
// Purpose: Voice version of DetectedSymptomsScreen.
// It plays detected symptoms when screen loads.
// User can say "yes" or "no"; UI updates and automatically navigates.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  Alert,
  Animated,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/detectedSymptomsStyles';

import {
  extractSymptomsFromText,
  resolveAnswerAudio,
} from '../services/triageApi';

import {
  saveBase64AudioToCache,
  readAudioFileAsBase64,
} from '../utils/base64Audio';

import { parseJsonParam, toJsonParam } from '../utils/routeParams';
import { WAV_RECORDING_OPTIONS } from '../utils/audioRecordingOptions';

export default function DetectedSymptomsVoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang } = useLanguage();

  const symptomsEn = parseJsonParam(params.symptoms_en, []);
  const symptomsWp = parseJsonParam(params.symptoms_wp, []);

  const initialVoiceFileUri = params.voice_file_uri || null;

  const [voiceFileUri, setVoiceFileUri] = useState(initialVoiceFileUri);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [checkingVoice, setCheckingVoice] = useState(false);

  const soundRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const hasPlayedInitialAudio = useRef(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, [])
  );

  const symptomsToShow = symptomsEn.map((item) => {
    const key = String(item).toLowerCase().replaceAll(' ', '_');
    return t(key);
  });

  const symptomText =
    symptomsToShow.length > 0
      ? symptomsToShow.map((item) => `• ${item}`).join('\n')
      : 'No symptoms detected';

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

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

  // IMPORTANT:
  // uriToPlay is passed directly so it does not accidentally play old cached audio.
  const playVoiceAudio = async (uriToPlay = voiceFileUri) => {
    try {
      if (!uriToPlay) return;

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      await stopCurrentAudio();

      const { sound } = await Audio.Sound.createAsync(
        { uri: uriToPlay },
        {
          shouldPlay: true,
          volume: 1.0,
        }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          if (soundRef.current === sound) {
            soundRef.current = null;
          }

          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Play detected symptoms audio error:', error);
    }
  };

  useEffect(() => {
    if (voiceFileUri && !hasPlayedInitialAudio.current) {
      hasPlayedInitialAudio.current = true;

      setTimeout(() => {
        playVoiceAudio(voiceFileUri);
      }, 500);
    }
  }, [voiceFileUri]);

  async function fetchAudioForLanguage(languageCode) {
    try {
      setAudioLoading(true);
      await stopCurrentAudio();

      const textToSend =
        languageCode === 'wp'
          ? symptomsWp.length > 0
            ? symptomsWp.join(' ')
            : symptomsEn.join(' ')
          : symptomsEn.join(' ');

      const data = await extractSymptomsFromText(textToSend, languageCode);

      const newFile = await saveBase64AudioToCache(
        data?.voice_b64,
        `voice_detected_${languageCode}_${Date.now()}.wav`
      );

      if (newFile) {
        setVoiceFileUri(newFile);

        setTimeout(() => {
          playVoiceAudio(newFile);
        }, 500);
      }
    } catch (error) {
      console.log('Audio update error:', error);
      Alert.alert('Audio Error', 'Could not update audio.');
    } finally {
      setAudioLoading(false);
    }
  }

  const goNextAfterYes = async () => {
    if (loading) return;

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

  const goBackAfterNo = async () => {
    await stopCurrentAudio();
    router.replace('/voiceinput');
  };

  const selectAnswerAndNavigate = async (answer) => {
    if (loading) return;

    setSelectedAnswer(answer);

    setTimeout(async () => {
      if (answer === 'yes') {
        await goNextAfterYes();
      } else {
        await goBackAfterNo();
      }
    }, 600);
  };

  const startVoiceAnswerRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        'Please allow microphone permission to answer by voice.'
      );
      return;
    }

    await stopCurrentAudio();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    const newRecording = new Audio.Recording();

    await newRecording.prepareToRecordAsync(WAV_RECORDING_OPTIONS);
    await newRecording.startAsync();

    setRecording(newRecording);
    setIsRecording(true);
    startPulse();
  };

  const stopVoiceAnswerRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();

    setRecording(null);
    setIsRecording(false);
    stopPulse();

    if (!uri) {
      Alert.alert('Recording error', 'Audio file was not saved.');
      return;
    }

    await checkSpokenYesNo(uri);
  };

  const handleMicPress = async () => {
    try {
      if (isRecording) {
        await stopVoiceAnswerRecording();
      } else {
        await startVoiceAnswerRecording();
      }
    } catch (error) {
      console.log('Detected voice answer recording error:', error);
      Alert.alert('Recording error', 'Could not record your answer.');
    }
  };

  const checkSpokenYesNo = async (uri) => {
    try {
      setCheckingVoice(true);

      const audioBase64 = await readAudioFileAsBase64(String(uri));

      const data = await resolveAnswerAudio(
        audioBase64,
        'detected_symptoms_confirm',
        lang || 'en'
      );

      const answerId = String(data?.answer_id || '').toLowerCase();
      const transcript = String(
        data?.transcript || data?.text || ''
      ).toLowerCase();

      if (
        answerId === 'yes' ||
        answerId === 'y' ||
        transcript.includes('yes') ||
        transcript.includes('yuwayi')
      ) {
        await selectAnswerAndNavigate('yes');
        return;
      }

      if (
        answerId === 'no' ||
        answerId === 'n' ||
        transcript.includes('no') ||
        transcript.includes('lawa')
      ) {
        await selectAnswerAndNavigate('no');
        return;
      }

      Alert.alert(
        'Voice not recognised',
        data?.message || 'Please say yes or no again, or tap the button manually.'
      );
    } catch (error) {
      console.log('Resolve detected voice answer error:', error);
      Alert.alert(
        'Voice answer error',
        'Could not understand your voice answer. Please tap YES or NO manually.'
      );
    } finally {
      setCheckingVoice(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCurrentAudio();

      if (recording) {
        recording.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, [recording]);

  const beforeLanguageChange = async () => {
    await stopCurrentAudio();
  };

  const afterLanguageChange = async (selectedLang) => {
    if (selectedLang === 'wp' && symptomsEn.length === 0) {
      setErrorModalVisible(true);
      return;
    }

    await fetchAudioForLanguage(selectedLang);
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
            onPress={() => playVoiceAudio(voiceFileUri)}
          >
            <Image
              source={require('../../assets/images/speaker.png')}
              style={styles.speakerIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        <View style={styles.voiceAnswerContainer}>
          <Text style={styles.voiceQuestionTitle}>
            {t('detected_question')}
          </Text>

          <View style={styles.voiceAnswerRow}>
            <Pressable
              style={[
                styles.voiceYesNoButton,
                selectedAnswer === 'yes' && styles.voiceAnswerSelected,
              ]}
              onPress={() => selectAnswerAndNavigate('yes')}
              disabled={loading}
            >
              <Text
                style={[
                  styles.voiceYesNoText,
                  selectedAnswer === 'yes' && styles.voiceAnswerSelectedText,
                ]}
              >
                {t('yes')}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.voiceYesNoButton,
                selectedAnswer === 'no' && styles.voiceAnswerSelected,
              ]}
              onPress={() => selectAnswerAndNavigate('no')}
              disabled={loading}
            >
              <Text
                style={[
                  styles.voiceYesNoText,
                  selectedAnswer === 'no' && styles.voiceAnswerSelectedText,
                ]}
              >
                {t('no')}
              </Text>
            </Pressable>

            <View style={styles.voiceMicWrapper}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Pressable
                  style={[
                    styles.detectedMicButton,
                    isRecording && styles.detectedMicRecording,
                  ]}
                  onPress={handleMicPress}
                  disabled={checkingVoice || loading}
                >
                  <Image
                    source={require('../../assets/images/microphone.png')}
                    style={styles.detectedMicIcon}
                    resizeMode="contain"
                  />
                </Pressable>
              </Animated.View>

              <Text style={styles.tapToAnswerText}>
                {checkingVoice
                  ? 'Checking...'
                  : isRecording
                  ? 'Tap to Stop'
                  : 'Tap to Answer'}
              </Text>
            </View>
          </View>
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