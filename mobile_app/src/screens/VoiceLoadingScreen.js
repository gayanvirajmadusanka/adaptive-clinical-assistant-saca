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
import * as FileSystem from 'expo-file-system/legacy';
import styles from '../styles/loadingStyles';

const API_URL = 'http://192.168.1.106:8000';

export default function VoiceLoadingScreen() {
  const router = useRouter();
  const { audio_uri, language } = useLocalSearchParams();

  useEffect(() => {
    sendAudioToApi();
  }, []);

  const saveBase64Audio = async (voiceB64, langCode) => {
    if (!voiceB64) return '';

    const cleaned = voiceB64.replace(/^data:audio\/\w+;base64,/, '');
    const fileUri = FileSystem.cacheDirectory + `voice_result_${langCode}.wav`;

    await FileSystem.writeAsStringAsync(fileUri, cleaned, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return fileUri;
  };

  const sendAudioToApi = async () => {
    try {
      if (!audio_uri) {
        Alert.alert('Error', 'No audio file found.');
        router.back();
        return;
      }

      const audioBase64Raw = await FileSystem.readAsStringAsync(audio_uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const audioBase64 = audioBase64Raw.replace(
        /^data:audio\/\w+;base64,/,
        ''
      );

      console.log('Audio URI:', audio_uri);
      console.log('Sending audio length:', audioBase64.length);

      const response = await fetch(`${API_URL}/extract/audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_b64: audioBase64,
          language: language || 'en',
        }),
      });

      const responseText = await response.text();
      console.log('Audio API status:', response.status);
      console.log('Audio API response:', responseText);

      if (!response.ok) {
        throw new Error(responseText);
      }

      const data = JSON.parse(responseText);

      const voiceFileUri = await saveBase64Audio(
        data.voice_b64,
        data.language || language || 'en'
      );

      router.replace({
        pathname: '/detectedsymptoms',
        params: {
          symptoms_en: JSON.stringify(data.symptoms_en || []),
          symptoms_wp: JSON.stringify(data.symptoms_wp || []),
          voice_file_uri: voiceFileUri,
          language: data.language || language || 'en',
        },
      });
    } catch (error) {
      console.log('Audio API error:', error);

      Alert.alert(
        'Error',
        'Could not process your voice. Please try again.'
      );

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
          <ActivityIndicator size="large" color="#8B2E0A" />
          <Text style={styles.loadingText}>Processing your voice...</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}