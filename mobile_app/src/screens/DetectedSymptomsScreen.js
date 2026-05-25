// DetectedSymptomsScreen.js
// Shows detected symptoms from backend.
// Yes -> TellUsMoreScreen
// No  -> Return to input screen

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  Alert,
  ImageBackground,
} from 'react-native';

import {
  useRouter,
  useLocalSearchParams,
} from 'expo-router';

import { useFocusEffect } from '@react-navigation/native';

import { Audio } from 'expo-av';

import AppScreen from '../components/AppScreen';

import { useLanguage } from '../context/LanguageContext';

import styles from '../styles/detectedSymptomsStyles';

// API helper
import { extractSymptomsFromText } from '../services/triageApi';

// Audio helper
import { saveBase64AudioToCache } from '../utils/base64Audio';

// Route param helpers
import {
  parseJsonParam,
  toJsonParam,
} from '../utils/routeParams';


export default function DetectedSymptomsScreen() {

  const router = useRouter();

  const params = useLocalSearchParams();

  const { t, lang } = useLanguage();

  // Symptoms from previous screen
  const symptomsEn =
    parseJsonParam(params.symptoms_en, []);

  const symptomsWp =
    parseJsonParam(params.symptoms_wp, []);

  // Detect current flow
  const isVoiceFlow =
    params.source === 'voice';

  const isBodyFlow =
    params.source === 'body';

  // Audio files
  const [voiceFileUri, setVoiceFileUri] =
    useState(null);

  const [voiceFileUriEn, setVoiceFileUriEn] =
    useState(null);

  const [voiceFileUriWp, setVoiceFileUriWp] =
    useState(null);

  // Error modal
  const [errorModalVisible, setErrorModalVisible] =
    useState(false);

  // Loading states
  const [loading, setLoading] =
    useState(false);

  const [audioLoading, setAudioLoading] =
    useState(false);

  // Current audio player
  const soundRef = useRef(null);


  // Reset loading when screen focuses
  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, [])
  );


  // Show error modal if no symptoms
  useEffect(() => {

    if (
      symptomsEn.length === 0 &&
      symptomsWp.length === 0
    ) {
      setErrorModalVisible(true);
    }

  }, []);


  // Update audio when language changes
  useEffect(() => {
    updateAudioForCurrentLanguage();
  }, [lang]);


  // Symptoms shown on screen
  const symptomsToShow =
    lang === 'wp' &&
    symptomsWp.length > 0
      ? symptomsWp
      : symptomsEn.map((item) => {

          const key =
            String(item)
              .toLowerCase()
              .replaceAll(' ', '_');

          return t(key);
        });


  // Final symptom text
  const symptomText =
    symptomsToShow.length > 0
      ? symptomsToShow
          .map((item) => `• ${item}`)
          .join('\n')
      : '';


  // Stop current audio
  const stopCurrentAudio = async () => {
    try {

      if (soundRef.current) {

        const currentSound =
          soundRef.current;

        soundRef.current = null;

        const status =
          await currentSound.getStatusAsync();

        if (status.isLoaded) {

          await currentSound.stopAsync();

          await currentSound.unloadAsync();
        }
      }

    } catch (error) {

      console.log(
        'Stop audio error:',
        error
      );
    }
  };


  // Update audio for selected language
  const updateAudioForCurrentLanguage =
    async () => {

      try {

        await stopCurrentAudio();

        // Warlpiri
        if (
          lang === 'wp' &&
          voiceFileUriWp
        ) {
          setVoiceFileUri(voiceFileUriWp);
          return;
        }

        // English
        if (
          lang !== 'wp' &&
          voiceFileUriEn
        ) {
          setVoiceFileUri(voiceFileUriEn);
          return;
        }

        setVoiceFileUri(null);

      } catch (error) {

        console.log(
          'Update current language audio error:',
          error
        );
      }
    };


  // Fetch backend audio
  async function fetchAudioForLanguage(
    languageCode
  ) {

    try {

      setAudioLoading(true);

      await stopCurrentAudio();

      // Use cached English audio
      if (
        languageCode === 'en' &&
        voiceFileUriEn
      ) {
        setVoiceFileUri(voiceFileUriEn);
        return voiceFileUriEn;
      }

      // Use cached Warlpiri audio
      if (
        languageCode === 'wp' &&
        voiceFileUriWp
      ) {
        setVoiceFileUri(voiceFileUriWp);
        return voiceFileUriWp;
      }

      // Symptom text
      const textToSend =
        languageCode === 'wp'
          ? symptomsWp.length > 0
            ? symptomsWp.join(' ')
            : symptomsEn.join(' ')
          : symptomsEn.join(' ');

      if (!textToSend) {
        return null;
      }

      // Backend API call
      const data =
        await extractSymptomsFromText(
          textToSend,
          languageCode
        );

      // Backend audio
      const audioBase64 =
        languageCode === 'wp'
          ? data?.voice_b64_wp ||
            data?.voice_b64 ||
            ''
          : data?.voice_b64_en ||
            data?.voice_b64 ||
            '';

      if (!audioBase64) {
        return null;
      }

      // Save audio file
      const newFile =
        await saveBase64AudioToCache(
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

      console.log(
        'Audio update error:',
        error
      );

      Alert.alert(
        'Audio Error',
        'Could not update audio.'
      );

      return null;

    } finally {

      setAudioLoading(false);
    }
  }


  // Play audio
  const playVoiceAudio = async () => {

    try {

      if (audioLoading) {

        Alert.alert(
          'Please wait',
          'Preparing audio...'
        );

        return;
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      await stopCurrentAudio();

      let fileUri =
        lang === 'wp'
          ? voiceFileUriWp
          : voiceFileUriEn;

      // Generate audio if missing
      if (!fileUri) {
        fileUri =
          await fetchAudioForLanguage(lang);
      }

      if (!fileUri) {

        Alert.alert(
          'Audio Error',
          'No audio file found.'
        );

        return;
      }

      // Play audio
      const { sound } =
        await Audio.Sound.createAsync(
          { uri: fileUri },
          {
            shouldPlay: true,
            volume: 1.0,
          }
        );

      soundRef.current = sound;

      // Cleanup after audio finish
      sound.setOnPlaybackStatusUpdate(
        async (status) => {

          if (
            status.isLoaded &&
            status.didJustFinish
          ) {
            try {

              if (soundRef.current === sound) {
                soundRef.current = null;
              }

              await sound.unloadAsync();

            } catch (error) {

              console.log(
                'Finished audio unload error:',
                error
              );
            }
          }
        }
      );

    } catch (error) {

      console.log(
        'Play error:',
        error
      );

      Alert.alert(
        'Audio Error',
        'Unable to play audio.'
      );
    }
  };


  // Cleanup audio on screen close
  useEffect(() => {

    return () => {

      if (soundRef.current) {

        const currentSound =
          soundRef.current;

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

            console.log(
              'Cleanup audio error:',
              error
            );
          });
      }
    };
  }, []);


  // Stop audio before language change
  const beforeLanguageChange =
    async () => {
      await stopCurrentAudio();
    };


  // Reload audio after language change
  const afterLanguageChange =
    async (selectedLang) => {
      await fetchAudioForLanguage(
        selectedLang
      );
    };


  // Return to input screen
  const goBackToTextInput =
    async () => {

      await stopCurrentAudio();

      setErrorModalVisible(false);

      router.replace('/textinput');
    };


  // YES button
  const handleYesPress = async () => {

    if (loading) return;

    // Show modal if no symptoms
    if (
      symptomsEn.length === 0 &&
      symptomsWp.length === 0
    ) {

      setErrorModalVisible(true);

      return;
    }

    setLoading(true);

    await stopCurrentAudio();

    // Open correct TellUsMore screen
    router.push({

      pathname: isBodyFlow
        ? '/bodytellusmore'
        : isVoiceFlow
        ? '/tellusmorevoice'
        : '/tellusmore',

      params: {
        symptoms_en:
          toJsonParam(symptomsEn),

        symptoms_wp:
          toJsonParam(symptomsWp),

        language: lang,

        gender:
          params.gender || 'male',

        source:
          params.source || 'text',
      },
    });
  };


  // NO button
  const handleNoPress = async () => {

    await stopCurrentAudio();

    // Return to correct input screen
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
      languageLabel={
        audioLoading
          ? 'Updating...'
          : undefined
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
        router.replace('/input');
      }}
    >

      <View style={styles.container}>

        {/* Header */}
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>
            {t('detected_title')}
          </Text>
        </View>

        {/* Symptoms box */}
        <View style={styles.symptomBox}>

          <Text style={styles.symptomText}>
            {symptomText}
          </Text>

          {/* Speaker button */}
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

        {/* Question */}
        <Text style={styles.questionText}>
          {t('detected_question')}
        </Text>

        {/* Yes / No buttons */}
        <View style={styles.buttonRow}>

          {/* YES */}
          <Pressable
            style={({ pressed }) => [
              styles.choiceButton,
              pressed && styles.choicePressed,
            ]}
            onPress={handleYesPress}
          >
            <Text style={styles.choiceText}>
              {t('yes')}
            </Text>
          </Pressable>

          {/* NO */}
          <Pressable
            style={({ pressed }) => [
              styles.choiceButton,
              pressed && styles.choicePressed,
            ]}
            onPress={handleNoPress}
          >
            <Text style={styles.choiceText}>
              {t('no')}
            </Text>
          </Pressable>
        </View>

        {/* Back button */}
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

            <Text style={styles.backText}>
              {t('back')}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Error modal */}
      <Modal
        transparent
        visible={errorModalVisible}
        animationType="fade"
      >

        <View style={styles.modalOverlay}>

          <View style={styles.errorModalBox}>

            {/* Modal header */}
            <View style={styles.errorHeader}>

              <Text style={styles.errorTitle}>
                {t('no_symptoms_detected')}
              </Text>

              <Pressable
                onPress={goBackToTextInput}
                style={styles.errorCloseButton}
              >
                <Text style={styles.errorCloseText}>
                  ×
                </Text>
              </Pressable>
            </View>

            {/* Modal body */}
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

              {/* OK button */}
              <Pressable
                style={({ pressed }) => [
                  styles.errorOkButton,
                  pressed &&
                    styles.errorOkButtonPressed,
                ]}
                onPress={goBackToTextInput}
              >
                <Text style={styles.errorOkText}>
                  {t('ok')}
                </Text>
              </Pressable>
            </ImageBackground>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}