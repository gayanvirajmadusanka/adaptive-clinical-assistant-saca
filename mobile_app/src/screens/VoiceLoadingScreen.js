// VoiceLoadingScreen.js
// Handles two paths:
//   Android English → receives transcribed_text from native STT → calls /extract/text
//   iOS English     → receives audio_uri → base64 encodes → calls /extract/audio
// Shows circular loading progress then opens DetectedSymptomsVoiceScreen.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';

import Svg, { Circle } from 'react-native-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';

import styles from '../styles/loadingStyles';
import { extractSymptomsFromText, extractSymptomsFromAudio } from '../services/triageApi';
import { readAudioFileAsBase64, saveBase64AudioToCache } from '../utils/base64Audio';
import { buildDetectedSymptomsParams } from '../utils/routeParams';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function VoiceLoadingScreen() {
  const router = useRouter();

  const { audio_uri, language, transcribed_text } = useLocalSearchParams();

  const [percent, setPercent] = useState(0);
  const [apiData, setApiData] = useState(null);
  const [apiFinished, setApiFinished] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const navigatedRef = useRef(false);

  const radius = 80;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;

  // Animate circular progress
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percent,
      duration: percent >= 100 ? 0 : 200,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  // Fake loading animation until API finishes
  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (!apiFinished && prev >= 90) return 90;
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 35);
    return () => clearInterval(timer);
  }, [apiFinished]);

  // Start API request
  useEffect(() => {
    sendToApi();
  }, []);

  // Navigate after loading completes
  useEffect(() => {
    if (apiFinished && percent >= 100 && apiData && !navigatedRef.current) {
      navigatedRef.current = true;
      router.replace({
        pathname: '/detectedsymptomsvoice',
        params: {
          ...buildDetectedSymptomsParams(apiData, language || 'en', apiData.voice_file_uri),
          source: 'voice',
        },
      });
    }
  }, [apiFinished, percent, apiData]);

  async function sendToApi() {
    try {
      let data;

      if (transcribed_text) {
        // Android native STT path: text already transcribed, send directly
        data = await extractSymptomsFromText(transcribed_text, language || 'en');
      } else {
        // iOS audio path: encode audio and send to /extract/audio
        if (!audio_uri) {
          Alert.alert('Error', 'No audio file found. Please record again.');
          router.back();
          return;
        }

        const selectedLanguage = language || 'en';

        console.log('VOICE AUDIO URI:', audio_uri);
        console.log('VOICE SELECTED LANGUAGE:', selectedLanguage);

        const audioBase64 = await readAudioFileAsBase64(String(audio_uri));

        console.log('VOICE BASE64 LENGTH:', audioBase64?.length);
        console.log('VOICE BASE64 START:', audioBase64?.substring(0, 30));

        if (!audioBase64 || audioBase64.length < 100) {
          Alert.alert('Error', 'Recorded audio is empty. Please record again.');
          router.back();
          return;
        }

        data = await extractSymptomsFromAudio(audioBase64, selectedLanguage);

        console.log('VOICE API DATA:', JSON.stringify(data, null, 2));
        console.log('DETECTED EN:', data?.symptoms_en || data?.detected_symptoms_en);
        console.log('DETECTED WP:', data?.symptoms_wp || data?.detected_symptoms_wp);
        console.log('TRANSCRIPT:', data?.transcript || data?.text);
      }

      const voiceFileUri = await saveBase64AudioToCache(
        data?.voice_b64,
        `voice_result_${data?.language || language || 'en'}.wav`
      );

      setApiData({ ...data, voice_file_uri: voiceFileUri });
      setApiFinished(true);
      setPercent(100);
    } catch (error) {
      console.log('Audio API error:', error?.message || error);
      console.log('FULL Audio API error:', error);

      Alert.alert('Error', 'Could not process your voice. Please try again.');
      router.back();
    }
  }

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

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
            <Text style={styles.topText}>Checking your Voice...</Text>

            {/* Circular loader */}
            <View style={styles.circleWrapper}>
              <Svg width={190} height={190}>
                {/* Background circle */}
                <Circle
                  cx="95"
                  cy="95"
                  r={radius}
                  stroke="#D6A24B"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />

                {/* Progress circle */}
                {percent >= 100 ? (
                  <Circle
                    cx="95"
                    cy="95"
                    r={radius}
                    stroke="#B65A24"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                ) : (
                  <AnimatedCircle
                    cx="95"
                    cy="95"
                    r={radius}
                    stroke="#B65A24"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="95, 95"
                  />
                )}
              </Svg>

              {/* Percent text */}
              <View style={styles.circleContent}>
                <Text style={styles.percent}>{percent}%</Text>
                <Text style={styles.loadingText}>
                  {percent >= 100 ? 'DONE' : 'LOADING'}
                </Text>
              </View>
            </View>

            {/* Bottom text */}
            <Text style={styles.bottomText}>
              {percent >= 100
                ? 'Preparing your results...'
                : 'Please wait while we process your voice...'}
            </Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}
