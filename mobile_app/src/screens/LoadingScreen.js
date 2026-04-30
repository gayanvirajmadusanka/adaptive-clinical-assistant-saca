import React, { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from '../styles/loadingStyles';

const API_URL = 'http://10.227.128.20:8000'; 
// Replace with your own laptop IPv4 address.
// Example: http://192.168.0.12:8000

export default function LoadingScreen() {
  const router = useRouter();
  const { text, language } = useLocalSearchParams();

  useEffect(() => {
    const sendSymptomsToApi = async () => {
      try {
        const response = await fetch(`${API_URL}/extract/text`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            language: language || 'en',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to connect to FastAPI');
        }

        const data = await response.json();

        router.replace({
          pathname: '/detectedsymptoms',
          params: {
            symptoms_en: JSON.stringify(data.symptoms_en || []),
            symptoms_wp: JSON.stringify(data.symptoms_wp || []),
            confidence: String(data.confidence || ''),
            language: data.language || language || 'en',
          },
        });
      } catch (error) {
        Alert.alert(
          'Connection Error',
          'Could not connect to FastAPI. Check your backend server and IP address.'
        );

        router.replace('/textinput');
      }
    };

    sendSymptomsToApi();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />

      <View style={styles.wrapper}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.container}>
            <Text style={styles.topText}>Checking your Symptoms...</Text>

            <View style={styles.circle}>
              <View style={styles.progressArc} />
              <Text style={styles.percent}>75%</Text>
              <Text style={styles.loadingText}>LOADING</Text>
            </View>

            <Text style={styles.bottomText}>
              Please wait while we detect your symptoms...
            </Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}