// LoadingScreen.js

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

import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

import styles from '../styles/loadingStyles';
import { extractSymptomsFromText } from '../services/triageApi';
import { toJsonParam } from '../utils/routeParams';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function LoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [percent, setPercent] = useState(0);
  const [detectedData, setDetectedData] = useState(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const navigatedRef = useRef(false);

  const radius = 80;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    sendTextToApi();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (detectedData && prev >= 97) return 100;
        if (prev < 97) return prev + 1;
        return 97;
      });
    }, 110);

    return () => clearInterval(timer);
  }, [detectedData]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percent,
      duration: 80,
      useNativeDriver: false,
    }).start();

    if (percent === 100 && detectedData && !navigatedRef.current) {
      navigatedRef.current = true;

      requestAnimationFrame(() => {
        goToDetectedSymptoms(detectedData);
      });
    }
  }, [percent, detectedData]);

  async function sendTextToApi() {
    try {
      const text = String(params.text || '').trim();
      const selectedLanguage = String(params.language || 'en');

      if (!text) {
        Alert.alert('Error', 'No symptom text found.');
        router.replace('/textinput');
        return;
      }

      const data = await extractSymptomsFromText(text, selectedLanguage);

      setDetectedData({
        data,
        selectedLanguage,
      });
    } catch (error) {
      console.log('Text API error:', error);

      Alert.alert(
        'Error',
        'Could not detect symptoms. Please check backend connection.'
      );

      router.replace('/textinput');
    }
  }

  function goToDetectedSymptoms(finalData) {
    const data = finalData.data;
    const selectedLanguage = finalData.selectedLanguage;

    const symptomsEn =
      data?.detected_symptoms_en ||
      data?.symptoms_en ||
      data?.symptoms ||
      [];

    const symptomsWp =
      data?.detected_symptoms_wp ||
      data?.symptoms_wp ||
      [];

    router.replace({
      pathname: '/detectedsymptoms',
      params: {
        symptoms_en: toJsonParam(symptomsEn),
        symptoms_wp: toJsonParam(symptomsWp),
        voice_b64_en: data?.voice_b64_en || '',
        voice_b64_wp: data?.voice_b64_wp || '',
        language: selectedLanguage,
        source: 'text',
      },
    });
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
            <Text style={styles.topText}>Detecting symptoms...</Text>

            <View style={styles.circleWrapper}>
              <Svg width={190} height={190}>
                <Circle
                  cx="95"
                  cy="95"
                  r={radius}
                  stroke="#D6A24B"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />

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

              <View style={styles.circleContent}>
                <Text style={styles.percent}>{percent}%</Text>

                <Text style={styles.loadingText}>
                  {percent >= 100 ? 'DONE' : 'LOADING'}
                </Text>
              </View>
            </View>

            <Text style={styles.bottomText}>
              Please wait while we analyse your symptoms...
            </Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}