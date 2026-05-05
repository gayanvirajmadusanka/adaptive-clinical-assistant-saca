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
import { extractSymptomsFromAudio } from '../services/triageApi';
import {
  readAudioFileAsBase64,
  saveBase64AudioToCache,
} from '../utils/base64Audio';
import { buildDetectedSymptomsParams } from '../utils/routeParams';

export default function VoiceLoadingScreen() {
  const router = useRouter();
  const { audio_uri, language } = useLocalSearchParams();

  // Sends the recorded voice file to FastAPI when this screen opens.
  useEffect(() => {
    sendAudioToApi();
  }, []);

  // Checks that the audio route parameter exists before sending the request.
  function hasValidAudioFile() {
    if (audio_uri) return true;

    Alert.alert('Error', 'No audio file found.');
    router.back();
    return false;
  }

  // Sends audio to FastAPI and prepares the detected symptoms screen params.
  async function sendAudioToApi() {
    try {
      if (!hasValidAudioFile()) return;

      const audioBase64 = await readAudioFileAsBase64(audio_uri);
      const data = await extractSymptomsFromAudio(audioBase64, language || 'en');
      const voiceFileUri = await saveBase64AudioToCache(
        data?.voice_b64,
        `voice_result_${data?.language || language || 'en'}.wav`
      );

      router.replace({
        pathname: '/detectedsymptoms',
        params: buildDetectedSymptomsParams(data, language, voiceFileUri),
      });
    } catch (error) {
      console.log('Audio API error:', error);
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
