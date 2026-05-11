// VoiceLoadingScreen.js
// Purpose: Reads the recorded voice file, converts it to base64, sends it to FastAPI,
// then opens DetectedSymptomsScreen with detected symptoms and backend audio response.

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from '../styles/loadingStyles';
import { useLanguage } from '../context/LanguageContext';
import { extractSymptomsFromAudio } from '../services/triageApi';
import { readAudioFileAsBase64, saveBase64AudioToCache } from '../utils/base64Audio';
import { buildDetectedSymptomsParams } from '../utils/routeParams';
import { TEST_AUDIO_BASE64 } from '../constants/testAudioBase64';

export default function VoiceLoadingScreen() {
  const router = useRouter();
  const { audio_uri, language } = useLocalSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    sendAudioToApi();
  }, []);

  const hasValidAudioFile = () => {
    if (audio_uri) return true;

    Alert.alert('Error', 'No audio file found. Please record again.');
    router.back();
    return false;
  };

  const sendAudioToApi = async () => {
    try {
      if (!hasValidAudioFile()) return;

      const selectedLanguage = language || 'en';

      console.log('VOICE AUDIO URI:', audio_uri);
      console.log('VOICE SELECTED LANGUAGE:', selectedLanguage);

      //const audioBase64 = await readAudioFileAsBase64(String(audio_uri));
      const audioBase64 = TEST_AUDIO_BASE64;

      console.log('VOICE BASE64 LENGTH:', audioBase64?.length);

      if (!audioBase64 || audioBase64.length < 100) {
        Alert.alert('Error', 'Recorded audio is empty. Please record again.');
        router.back();
        return;
      }

      const data = await extractSymptomsFromAudio(audioBase64, selectedLanguage);

      console.log('VOICE API DATA:', data);

      const voiceFileUri = await saveBase64AudioToCache(
        data?.voice_b64,
        `voice_result_${data?.language || selectedLanguage}.wav`
      );

      router.replace({
        pathname: '/detectedsymptoms',
        params: buildDetectedSymptomsParams(data, selectedLanguage, voiceFileUri),
      });
    } catch (error) {
      console.log('Audio API error:', error?.message || error);
      console.log('FULL Audio API error:', error);

      Alert.alert('Error', 'Could not process your voice. Please try again.');
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />

      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#8B3A1C" />
          <Text style={styles.loadingText}>
            {t('processing_voice') || 'Processing your voice...'}
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}