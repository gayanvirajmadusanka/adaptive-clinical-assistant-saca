// VoiceLoadingScreen.js
// Handles two paths:
//   Android English → receives transcribed_text from native STT → calls /extract/text
//   iOS English     → receives audio_uri → base64 encodes → calls /extract/audio

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
import { extractSymptomsFromText, extractSymptomsFromAudio } from '../services/triageApi';
import {
  readAudioFileAsBase64,
  saveBase64AudioToCache,
} from '../utils/base64Audio';
import { buildDetectedSymptomsParams } from '../utils/routeParams';

export default function VoiceLoadingScreen() {
  const router = useRouter();
  const { audio_uri, language, transcribed_text } = useLocalSearchParams();

  useEffect(() => {
    sendToApi();
  }, []);

  async function sendToApi() {
    try {
      let data;

      if (transcribed_text) {
        // Android native STT path: text is already transcribed, send directly
        data = await extractSymptomsFromText(transcribed_text, language || 'en');
      } else {
        // iOS audio path: encode audio and send to /extract/audio
        if (!audio_uri) {
          Alert.alert('Error', 'No audio file found.');
          router.back();
          return;
        }
        const audioBase64 = await readAudioFileAsBase64(audio_uri);
        data = await extractSymptomsFromAudio(audioBase64, language || 'en');
      }

      const voiceFileUri = await saveBase64AudioToCache(
        data?.voice_b64,
        `voice_result_${data?.language || language || 'en'}.wav`
      );

      router.replace({
        pathname: '/detectedsymptoms',
        params: buildDetectedSymptomsParams(data, language, voiceFileUri),
      });
    } catch (error) {
      console.log('Voice loading error:', error);
      Alert.alert('Error', 'Could not process your voice. Please try again.');
      router.back();
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#8B2E0A" />
          <Text style={styles.loadingText}>Processing your voice...</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
