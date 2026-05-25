// DetectedSymptomsBodyScreen.js
// Shows detected symptoms from body flow.
// Yes -> BodyTellUsMoreScreen
// No  -> BodyInputScreen

import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  Alert,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';

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


export default function DetectedSymptomsBodyScreen() {

  const router = useRouter();

  const params = useLocalSearchParams();

  const { t, lang } = useLanguage();

  // Symptoms from previous screen
  const symptomsEn =
    parseJsonParam(params.symptoms_en, []);

  const symptomsWp =
    parseJsonParam(params.symptoms_wp, []);

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

  // Audio loading state
  const [audioLoading, setAudioLoading] =
    useState(false);

  // Selected Yes / No
  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  // Current audio player
  const soundRef = useRef(null);


  // Load initial audio
  useEffect(() => {
    fetchInitialAudio();
  }, []);


  // Update audio when language changes
  useEffect(() => {
    updateAudioForCurrentLanguage();
  }, [lang]);


  // Stop audio on screen close
  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  }, []);


  // Symptoms shown on screen
  const symptomsToShow =
    lang === 'wp' && symptomsWp.length > 0
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
      : 'No symptoms detected';


  // Load initial audio files
  async function fetchInitialAudio() {
    try {

      const voiceB64En =
        params.voice_b64_en || '';

      const voiceB64Wp =
        params.voice_b64_wp || '';

      // English audio
      if (voiceB64En) {

        const fileEn =
          await saveBase64AudioToCache(
            voiceB64En,
            'body_detected_symptoms_en.wav'
          );

        if (fileEn) {

          setVoiceFileUriEn(fileEn);

          if (lang !== 'wp') {
            setVoiceFileUri(fileEn);
          }
        }
      }

      // Warlpiri audio
      if (voiceB64Wp) {

        const fileWp =
          await saveBase64AudioToCache(
            voiceB64Wp,
            'body_detected_symptoms_wp.wav'
          );

        if (fileWp) {

          setVoiceFileUriWp(fileWp);

          if (lang === 'wp') {
            setVoiceFileUri(fileWp);
          }
        }
      }

    } catch (error) {

      console.log(
        'Initial body audio load error:',
        error
      );
    }
  }


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


  // Update audio when language changes
  const updateAudioForCurrentLanguage =
    async () => {

      try {

        await stopCurrentAudio();

        // Warlpiri
        if (lang === 'wp') {

          if (voiceFileUriWp) {
            setVoiceFileUri(voiceFileUriWp);
            return;
          }

          if (params.voice_b64_wp) {

            const fileWp =
              await saveBase64AudioToCache(
                params.voice_b64_wp,
                'body_detected_symptoms_wp.wav'
              );

            setVoiceFileUriWp(fileWp);

            setVoiceFileUri(fileWp);

            return;
          }
        }

        // English
        if (voiceFileUriEn) {
          setVoiceFileUri(voiceFileUriEn);
          return;
        }

        if (params.voice_b64_en) {

          const fileEn =
            await saveBase64AudioToCache(
              params.voice_b64_en,
              'body_detected_symptoms_en.wav'
            );

          setVoiceFileUriEn(fileEn);

          setVoiceFileUri(fileEn);
        }

      } catch (error) {

        console.log(
          'Update body audio language error:',
          error
        );
      }
    };


  // Fetch audio from backend
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

      // Direct backend audio
      const directAudio =
        languageCode === 'wp'
          ? params.voice_b64_wp || ''
          : params.voice_b64_en || '';

      if (directAudio) {

        const newFile =
          await saveBase64AudioToCache(
            directAudio,
            `body_detected_symptoms_${languageCode}.wav`
          );

        if (languageCode === 'wp') {
          setVoiceFileUriWp(newFile);
        } else {
          setVoiceFileUriEn(newFile);
        }

        setVoiceFileUri(newFile);

        return newFile;
      }

      // Symptom text for backend
      const textToSend =
        languageCode === 'wp'
          ? symptomsWp.length > 0
            ? symptomsWp.join(' ')
            : symptomsEn.join(' ')
          : symptomsEn.join(' ');

      if (!textToSend) {

        Alert.alert(
          'Audio Error',
          'No symptom text found.'
        );

        return null;
      }

      // Backend API call
      const data =
        await extractSymptomsFromText(
          textToSend,
          languageCode
        );

      // Get audio
      const audioBase64 =
        languageCode === 'wp'
          ? data?.voice_b64_wp || ''
          : data?.voice_b64_en || '';

      if (!audioBase64) {

        Alert.alert(
          'Audio Error',
          'No audio returned from backend.'
        );

        return null;
      }

      // Save audio file
      const newFile =
        await saveBase64AudioToCache(
          audioBase64,
          `body_detected_symptoms_${languageCode}.wav`
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
        'Body audio update error:',
        error
      );

      Alert.alert(
        'Audio Error',
        'Could not prepare audio.'
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

      let fileUri = voiceFileUri;

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
        'Play body audio error:',
        error
      );

      Alert.alert(
        'Audio Error',
        'Unable to play audio.'
      );
    }
  };


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


  // YES button
  const handleYesPress = async () => {

    setSelectedAnswer('yes');

    // Show modal if no symptoms
    if (
      symptomsEn.length === 0 &&
      symptomsWp.length === 0
    ) {

      setErrorModalVisible(true);

      return;
    }

    await stopCurrentAudio();

    // Open BodyTellUsMoreScreen
    setTimeout(() => {

      router.push({
        pathname: '/bodytellusmore',

        params: {
          symptoms_en:
            toJsonParam(symptomsEn),

          symptoms_wp:
            toJsonParam(symptomsWp),

          language: lang,

          gender:
            params.gender || 'male',

          source: 'body',
        },
      });

    }, 250);
  };


  // NO button
  const handleNoPress = async () => {

    setSelectedAnswer('no');

    await stopCurrentAudio();

    // Go back to body input
    setTimeout(() => {
      router.replace('/bodyinput');
    }, 250);
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
          {t('detected_question') ||
            'Does this match you?'}
        </Text>

        {/* Yes / No buttons */}
        <View style={styles.iconButtonRow}>

          {/* YES */}
          <Pressable
            style={({ pressed }) => [
              styles.iconChoiceButton,

              selectedAnswer === 'yes' &&
                styles.iconChoiceSelected,

              pressed &&
                styles.iconChoicePressed,
            ]}
            onPress={handleYesPress}
          >
            <Image
              source={require('../../assets/images/yes_icon.png')}
              style={[
                styles.yesNoIcon,

                selectedAnswer === 'yes' &&
                  styles.yesNoIconSelected,
              ]}
              resizeMode="contain"
            />
          </Pressable>

          {/* NO */}
          <Pressable
            style={({ pressed }) => [
              styles.iconChoiceButton,

              selectedAnswer === 'no' &&
                styles.iconChoiceSelected,

              pressed &&
                styles.iconChoicePressed,
            ]}
            onPress={handleNoPress}
          >
            <Image
              source={require('../../assets/images/no_icon.png')}
              style={[
                styles.yesNoIcon,

                selectedAnswer === 'no' &&
                  styles.yesNoIconSelected,
              ]}
              resizeMode="contain"
            />
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
                No Symptoms Detected
              </Text>

              <Pressable
                onPress={() =>
                  setErrorModalVisible(false)
                }
                style={styles.errorCloseButton}
              >
                <Text style={styles.errorCloseText}>
                  ×
                </Text>
              </Pressable>
            </View>

            {/* Modal body */}
            <View style={styles.errorBody}>

              <Text style={styles.errorMessageBold}>
                We could not detect any symptoms.
              </Text>

              <Text style={styles.errorMessage}>
                Please go back and select your body symptoms again.
              </Text>

              {/* OK button */}
              <Pressable
                style={({ pressed }) => [
                  styles.errorOkButton,
                  pressed &&
                    styles.errorOkButtonPressed,
                ]}
                onPress={() =>
                  setErrorModalVisible(false)
                }
              >
                <Text style={styles.errorOkText}>
                  Ok
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}