// DetectedSymptomsVoiceScreen.js

import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  ImageBackground,
  Platform,
} from 'react-native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/detectedSymptomsStyles';

import {
  extractSymptomsFromText,
  submitAnswerAudio,
  submitAnswerText,
} from '../services/triageApi';

const IS_ANDROID = Platform.OS === 'android';

import {
  readAudioFileAsBase64,
  saveBase64AudioToCache,
} from '../utils/base64Audio';

import {
  parseJsonParam,
  toJsonParam,
} from '../utils/routeParams';

import { WAV_RECORDING_OPTIONS } from '../utils/audioRecordingOptions';

const CONFIRM_SYMPTOMS_QUESTION_ID = 'confirm_symptoms';
const CONFIRM_SYMPTOMS_ANSWER_YES = 'confirm_symptomsy';
const CONFIRM_SYMPTOMS_ANSWER_NO = 'confirm_symptomsn';

const alertAudioMap = {
  en: require('../../assets/audio/ui/could_not_catch_en.wav'),
  wp: require('../../assets/audio/ui/could_not_catch_wp.wav'),
};

const INVALID_SYMPTOM_VALUES = [
  '',
  'none',
  'null',
  'undefined',
  'no symptom',
  'no symptoms',
  'no symptoms detected',
  'not detected',
  'unknown',
];

export default function DetectedSymptomsVoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang } = useLanguage();

  const rawSymptomsEn = parseJsonParam(params.symptoms_en, []);
  const rawSymptomsWp = parseJsonParam(params.symptoms_wp, []);

  const cleanSymptoms = (items = []) => {
    return items
      .map((item) => String(item || '').trim())
      .filter((item) => {
        const normalized = item.toLowerCase();
        return !INVALID_SYMPTOM_VALUES.includes(normalized);
      });
  };

  const symptomsEn = cleanSymptoms(rawSymptomsEn);
  const symptomsWp = cleanSymptoms(rawSymptomsWp);

  const hasNoSymptoms =
    symptomsEn.length === 0 && symptomsWp.length === 0;

  const [voiceFileUriEn, setVoiceFileUriEn] = useState(null);
  const [voiceFileUriWp, setVoiceFileUriWp] = useState(null);

  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [answerErrorModalVisible, setAnswerErrorModalVisible] =
    useState(false);

  const [selectedVoiceAnswer, setSelectedVoiceAnswer] =
    useState(null);

  const [answerRecording, setAnswerRecording] = useState(null);
  const [isAnswerRecording, setIsAnswerRecording] = useState(false);
  const [isSTTActive, setIsSTTActive] = useState(false);

  const USE_ANDROID_STT = IS_ANDROID && lang === 'en';

  useSpeechRecognitionEvent('result', (event) => {
    if (!USE_ANDROID_STT) return;
    const text = event.results[0]?.transcript || '';
    if (event.isFinal && text) {
      setIsSTTActive(false);
      detectYesNoFromText(text);
    }
  });
  useSpeechRecognitionEvent('end', () => {
    if (USE_ANDROID_STT) setIsSTTActive(false);
  });
  useSpeechRecognitionEvent('error', (event) => {
    if (!USE_ANDROID_STT) return;
    setIsSTTActive(false);
    if (event.error !== 'aborted') showAnswerNotRecognizedModal();
  });

  const soundRef = useRef(null);
  const autoPlayedRef = useRef(false);

  const noSymptomsTitle = t('no_symptoms_detected');

  const noSymptomsMessage1 =
    lang === 'wp'
      ? 'Ngula purrkunypa lawa nyangu nyuntu yirrarni-jangka.'
      : 'We could not detect any symptoms from your recording.';

  const noSymptomsMessage2 =
    lang === 'wp'
      ? 'Yirrarni-kari ngarrirni clear-piya.'
      : 'Please try recording again more clearly.';

  const answerErrorTitle = t(
    'voice_not_recognized_title'
  );

  const answerErrorMessage1 =
    lang === 'wp'
      ? 'Answer lawa nyangu. Yuwayi manu Lawa milkikarriya.'
      : 'Could not recognize answer, please select or try again';

  const answerErrorMessage2 = t(
    'voice_not_recognized_hint'
  );

  const okText = t('ok');

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, [])
  );

  useEffect(() => {
    if (hasNoSymptoms) {
      setErrorModalVisible(true);

      setTimeout(() => {
        readNoSymptomsAlertText();
      }, 400);

      return;
    }

    prepareInitialAudioAndAutoPlay();

    return () => {
      stopCurrentAudio();
      stopAnswerRecordingIfActive();
    };
  }, []);

  const symptomsToShow =
    lang === 'wp' && symptomsWp.length > 0
      ? symptomsWp
      : symptomsEn.map((item) => {
          const key = String(item)
            .toLowerCase()
            .replaceAll(' ', '_');

          return t(key);
        });

  const symptomText =
    symptomsToShow.length > 0
      ? symptomsToShow
          .map((item) => `• ${item}`)
          .join('\n')
      : '';

  async function prepareInitialAudioAndAutoPlay() {
    try {
      if (hasNoSymptoms || autoPlayedRef.current) {
        return;
      }

      autoPlayedRef.current = true;

      const fileUri = await getAudioFileForLanguage(
        lang
      );

      if (fileUri) {
        setTimeout(() => {
          playAudioFromUri(fileUri);
        }, 300);
      }
    } catch (error) {
      console.log(
        'Prepare and auto play audio error:',
        error
      );
    }
  }

  async function stopCurrentAudio() {
    try {
      Speech.stop();

      if (soundRef.current) {
        const currentSound = soundRef.current;

        soundRef.current = null;

        const status =
          await currentSound.getStatusAsync();

        if (status.isLoaded) {
          await currentSound.stopAsync();
          await currentSound.unloadAsync();
        }
      }
    } catch (error) {
      console.log('Stop audio error:', error);
    }
  }

  async function playAlertAudio() {
    try {
      await stopCurrentAudio();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      const selectedLang =
        lang === 'wp' ? 'wp' : 'en';

      const audioSource =
        alertAudioMap[selectedLang];

      const { sound } =
        await Audio.Sound.createAsync(
          audioSource,
          {
            shouldPlay: true,
            volume: 1.0,
          }
        );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate(
        async (status) => {
          if (
            status.isLoaded &&
            status.didJustFinish
          ) {
            if (soundRef.current === sound) {
              soundRef.current = null;
            }

            await sound.unloadAsync();
          }
        }
      );
    } catch (error) {
      console.log(
        'Play alert audio error:',
        error
      );
    }
  }

  async function stopAnswerRecordingIfActive() {
    try {
      if (answerRecording) {
        await answerRecording.stopAndUnloadAsync();

        setAnswerRecording(null);
        setIsAnswerRecording(false);
      }
    } catch (error) {
      console.log(
        'Stop answer recording cleanup error:',
        error
      );
    }
  }

  async function readNoSymptomsAlertText() {
    try {
      await playAlertAudio();
    } catch (error) {
      console.log(
        'Read no symptoms alert text error:',
        error
      );
    }
  }

  async function readAnswerErrorText() {
    try {
      await playAlertAudio();
    } catch (error) {
      console.log(
        'Read answer error text error:',
        error
      );
    }
  }

  async function showAnswerNotRecognizedModal() {
    await stopCurrentAudio();

    setAnswerErrorModalVisible(true);

    setTimeout(() => {
      readAnswerErrorText();
    }, 300);
  }

  async function getAudioFileForLanguage(
    languageCode
  ) {
    if (hasNoSymptoms) {
      return null;
    }

    const selectedLang =
      languageCode === 'wp' ? 'wp' : 'en';

    if (
      selectedLang === 'wp' &&
      voiceFileUriWp
    ) {
      return voiceFileUriWp;
    }

    if (
      selectedLang === 'en' &&
      voiceFileUriEn
    ) {
      return voiceFileUriEn;
    }

    const directAudio =
      selectedLang === 'wp'
        ? String(params.voice_b64_wp || '')
        : String(params.voice_b64_en || '');

    if (directAudio) {
      const fileUri =
        await saveBase64AudioToCache(
          directAudio,
          `detected_symptoms_voice_${selectedLang}.wav`
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

    const data =
      await extractSymptomsFromText(
        textToSend,
        selectedLang
      );

    const audioBase64 =
      selectedLang === 'wp'
        ? String(
            data?.voice_b64_wp ||
              data?.voice_b64 ||
              ''
          )
        : String(
            data?.voice_b64_en ||
              data?.voice_b64 ||
              ''
          );

    if (!audioBase64) {
      return null;
    }

    const fileUri =
      await saveBase64AudioToCache(
        audioBase64,
        `detected_symptoms_voice_${selectedLang}.wav`
      );

    if (selectedLang === 'wp') {
      setVoiceFileUriWp(fileUri);
    } else {
      setVoiceFileUriEn(fileUri);
    }

    return fileUri;
  }

  async function playAudioFromUri(fileUri) {
    try {
      await stopCurrentAudio();

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      const { sound } =
        await Audio.Sound.createAsync(
          { uri: fileUri },
          {
            shouldPlay: true,
            volume: 1.0,
          }
        );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate(
        async (status) => {
          if (
            status.isLoaded &&
            status.didJustFinish
          ) {
            if (soundRef.current === sound) {
              soundRef.current = null;
            }

            await sound.unloadAsync();
          }
        }
      );
    } catch (error) {
      console.log(
        'Play audio from uri error:',
        error
      );
    }
  }

  async function playVoiceAudio() {
    try {
      if (audioLoading) {
        return;
      }

      if (hasNoSymptoms) {
        setErrorModalVisible(true);

        await readNoSymptomsAlertText();

        return;
      }

      setAudioLoading(true);

      const fileUri =
        await getAudioFileForLanguage(lang);

      if (!fileUri) {
        await showAnswerNotRecognizedModal();
        return;
      }

      await playAudioFromUri(fileUri);
    } catch (error) {
      console.log(
        'Play detected voice audio error:',
        error
      );

      await showAnswerNotRecognizedModal();
    } finally {
      setAudioLoading(false);
    }
  }

  async function handleYesPress() {
    if (loading) return;

    if (hasNoSymptoms) {
      setErrorModalVisible(true);

      await readNoSymptomsAlertText();

      return;
    }

    setSelectedVoiceAnswer('yes');
    setLoading(true);

    await stopCurrentAudio();

    setTimeout(() => {
      router.push({
        pathname: '/tellusmorevoice',
        params: {
          symptoms_en:
            toJsonParam(symptomsEn),
          symptoms_wp:
            toJsonParam(symptomsWp),
          language: lang,
          source: 'voice',
        },
      });
    }, 350);
  }

  async function handleNoPress() {
    setSelectedVoiceAnswer('no');

    await stopCurrentAudio();

    setTimeout(() => {
      router.replace('/voiceinput');
    }, 350);
  }

  async function startAndroidSTT() {
    const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) { await showAnswerNotRecognizedModal(); return; }
    try {
      const { installedLocales } = await ExpoSpeechRecognitionModule.getSupportedLocales({});
      const locale = installedLocales.find(l => l.startsWith('en')) || 'en-US';
      const onDevice = installedLocales.some(l => l.startsWith('en'));
      setIsSTTActive(true);
      ExpoSpeechRecognitionModule.start({ lang: locale, interimResults: false, continuous: false, requiresOnDeviceRecognition: onDevice });
    } catch {
      setIsSTTActive(false);
      await showAnswerNotRecognizedModal();
    }
  }

  async function detectYesNoFromText(text) {
    try {
      setAudioLoading(true);
      const data = await submitAnswerText(text, CONFIRM_SYMPTOMS_QUESTION_ID, lang);
      const recognized = data?.recognized === true;
      const answerId = String(data?.answer_id || '').toLowerCase();
      if (recognized && answerId === CONFIRM_SYMPTOMS_ANSWER_YES) {
        setSelectedVoiceAnswer('yes');
        setTimeout(() => handleYesPress(), 450);
        return;
      }
      if (recognized && answerId === CONFIRM_SYMPTOMS_ANSWER_NO) {
        setSelectedVoiceAnswer('no');
        setTimeout(() => handleNoPress(), 450);
        return;
      }
      await showAnswerNotRecognizedModal();
    } catch {
      await showAnswerNotRecognizedModal();
    } finally {
      setAudioLoading(false);
    }
  }

  async function handleAnswerMicPress() {
    try {
      if (audioLoading) {
        return;
      }

      if (USE_ANDROID_STT) {
        if (isSTTActive) { ExpoSpeechRecognitionModule.stop(); return; }
        await stopCurrentAudio();
        await startAndroidSTT();
        return;
      }

      if (isAnswerRecording) {
        await stopAnswerRecording();
        return;
      }

      await startAnswerRecording();
    } catch (error) {
      console.log(
        'Answer recording error:',
        error
      );

      await showAnswerNotRecognizedModal();
    }
  }

  async function startAnswerRecording() {
    const permission =
      await Audio.requestPermissionsAsync();

    if (!permission.granted) {
      await showAnswerNotRecognizedModal();
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

    const newRecording =
      new Audio.Recording();

    await newRecording.prepareToRecordAsync(
      WAV_RECORDING_OPTIONS
    );

    await newRecording.startAsync();

    setAnswerRecording(newRecording);
    setIsAnswerRecording(true);
  }

  async function stopAnswerRecording() {
    try {
      if (!answerRecording) {
        return;
      }

      await answerRecording.stopAndUnloadAsync();

      const uri = answerRecording.getURI();

      setAnswerRecording(null);
      setIsAnswerRecording(false);

      if (!uri) {
        await showAnswerNotRecognizedModal();
        return;
      }

      await detectYesNoFromVoice(uri);
    } catch (error) {
      console.log(
        'Stop answer recording error:',
        error
      );

      setAnswerRecording(null);
      setIsAnswerRecording(false);

      await showAnswerNotRecognizedModal();
    }
  }

  async function detectYesNoFromVoice(uri) {
    try {
      setAudioLoading(true);

      const audioBase64 =
        await readAudioFileAsBase64(
          String(uri)
        );

      if (
        !audioBase64 ||
        audioBase64.length < 100
      ) {
        await showAnswerNotRecognizedModal();
        return;
      }

      const data = await submitAnswerAudio(
        audioBase64,
        CONFIRM_SYMPTOMS_QUESTION_ID,
        lang
      );

      console.log(
        'ANSWER AUDIO API DATA:',
        JSON.stringify(data, null, 2)
      );

      const recognized =
        data?.recognized === true;

      const answerId = String(
        data?.answer_id || ''
      ).toLowerCase();

      if (
        recognized &&
        answerId ===
          CONFIRM_SYMPTOMS_ANSWER_YES
      ) {
        setSelectedVoiceAnswer('yes');

        setTimeout(() => {
          handleYesPress();
        }, 450);

        return;
      }

      if (
        recognized &&
        answerId ===
          CONFIRM_SYMPTOMS_ANSWER_NO
      ) {
        setSelectedVoiceAnswer('no');

        setTimeout(() => {
          handleNoPress();
        }, 450);

        return;
      }

      await showAnswerNotRecognizedModal();
    } catch (error) {
      console.log(
        'Detect yes no voice error:',
        error
      );

      await showAnswerNotRecognizedModal();
    } finally {
      setAudioLoading(false);
    }
  }

  async function closeAnswerErrorModal() {
    await stopCurrentAudio();

    setAnswerErrorModalVisible(false);
  }

  async function goBackToVoiceInput() {
    await stopCurrentAudio();

    await stopAnswerRecordingIfActive();

    setErrorModalVisible(false);

    router.replace('/voiceinput');
  }

  async function beforeLanguageChange() {
    await stopCurrentAudio();

    await stopAnswerRecordingIfActive();
  }

  async function afterLanguageChange(
    selectedLang
  ) {
    try {
      setAudioLoading(true);

      await stopCurrentAudio();

      if (hasNoSymptoms) {
        setErrorModalVisible(true);

        setTimeout(() => {
          readNoSymptomsAlertText();
        }, 300);

        return;
      }

      const fileUri =
        await getAudioFileForLanguage(
          selectedLang
        );

      if (fileUri) {
        setTimeout(() => {
          playAudioFromUri(fileUri);
        }, 300);
      }
    } catch (error) {
      console.log(
        'Detected voice language update error:',
        error
      );
    } finally {
      setAudioLoading(false);
    }
  }

  return (
    <AppScreen
      languageLabel={
        audioLoading ? 'Updating...' : undefined
      }
      languageModalDisabled={audioLoading}
      beforeLanguageChange={
        beforeLanguageChange
      }
      afterLanguageChange={
        afterLanguageChange
      }
      onHomePress={async () => {
        await stopCurrentAudio();

        await stopAnswerRecordingIfActive();

        router.replace('/input');
      }}
    >
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>
            {t('detected_title')}
          </Text>
        </View>

        <View style={styles.symptomBox}>
          <Text style={styles.symptomText}>
            {symptomText}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.speakerButton,
              pressed &&
                styles.speakerPressed,
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

        <Text style={styles.questionText}>
          {t('detected_question')}
        </Text>

        <View style={styles.voiceAnswerRow}>
          <Pressable
            style={[
              styles.voiceYesNoButton,
              selectedVoiceAnswer ===
                'yes' &&
                styles.voiceAnswerSelected,
            ]}
            onPress={handleYesPress}
          >
            <Text
              style={[
                styles.voiceYesNoText,
                selectedVoiceAnswer ===
                  'yes' &&
                  styles.voiceAnswerSelectedText,
              ]}
            >
              {t('yes')}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.voiceYesNoButton,
              selectedVoiceAnswer ===
                'no' &&
                styles.voiceAnswerSelected,
            ]}
            onPress={handleNoPress}
          >
            <Text
              style={[
                styles.voiceYesNoText,
                selectedVoiceAnswer ===
                  'no' &&
                  styles.voiceAnswerSelectedText,
              ]}
            >
              {t('no')}
            </Text>
          </Pressable>

          <View style={styles.voiceMicWrapper}>
            <Pressable
              style={[
                styles.detectedMicButton,
                (isAnswerRecording || isSTTActive) &&
                  styles.detectedMicRecording,
              ]}
              onPress={
                handleAnswerMicPress
              }
            >
              <Image
                source={require('../../assets/images/microphone.png')}
                style={styles.detectedMicIcon}
                resizeMode="contain"
              />
            </Pressable>

            <Text
              style={
                styles.tapToAnswerText
              }
            >
              {audioLoading
                ? t('voice_processing')
                : (isAnswerRecording || isSTTActive)
                ? t(
                    'voice_recording_hint'
                  )
                : t(
                    'voice_tap_to_answer'
                  )}
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed &&
              styles.backPressedGrey,
          ]}
          onPress={async () => {
            await stopCurrentAudio();

            await stopAnswerRecordingIfActive();

            router.back();
          }}
        >
          <View
            style={styles.backButtonContent}
          >
            <Image
              source={require('../../assets/images/back-arrow.png')}
              style={
                styles.backArrowImage
              }
              resizeMode="contain"
            />

            <Text style={styles.backText}>
              {t('back')}
            </Text>
          </View>
        </Pressable>
      </View>

      <Modal
        transparent
        visible={errorModalVisible}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalBox}>
            <View style={styles.errorHeader}>
              <Text
                style={styles.errorTitle}
              >
                {noSymptomsTitle}
              </Text>

              <Pressable
                onPress={
                  goBackToVoiceInput
                }
                style={
                  styles.errorCloseButton
                }
              >
                <Text
                  style={
                    styles.errorCloseText
                  }
                >
                  ×
                </Text>
              </Pressable>
            </View>

            <ImageBackground
              source={require('../../assets/images/background.png')}
              style={styles.errorBody}
              resizeMode="cover"
            >
              <Text
                style={
                  styles.errorMessageBold
                }
              >
                {noSymptomsMessage1}
              </Text>

              <Text
                style={styles.errorMessage}
              >
                {noSymptomsMessage2}
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.errorOkButton,
                  pressed &&
                    styles.errorOkButtonPressed,
                ]}
                onPress={
                  goBackToVoiceInput
                }
              >
                <Text
                  style={
                    styles.errorOkText
                  }
                >
                  {okText}
                </Text>
              </Pressable>
            </ImageBackground>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={
          answerErrorModalVisible
        }
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalBox}>
            <View style={styles.errorHeader}>
              <Text
                style={styles.errorTitle}
              >
                {answerErrorTitle}
              </Text>

              <Pressable
                onPress={
                  closeAnswerErrorModal
                }
                style={
                  styles.errorCloseButton
                }
              >
                <Text
                  style={
                    styles.errorCloseText
                  }
                >
                  ×
                </Text>
              </Pressable>
            </View>

            <ImageBackground
              source={require('../../assets/images/background.png')}
              style={styles.errorBody}
              resizeMode="cover"
            >
              <Text
                style={
                  styles.errorMessageBold
                }
              >
                {answerErrorMessage1}
              </Text>

              <Text
                style={styles.errorMessage}
              >
                {answerErrorMessage2}
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.errorOkButton,
                  pressed &&
                    styles.errorOkButtonPressed,
                ]}
                onPress={
                  closeAnswerErrorModal
                }
              >
                <Text
                  style={
                    styles.errorOkText
                  }
                >
                  {okText}
                </Text>
              </Pressable>
            </ImageBackground>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}