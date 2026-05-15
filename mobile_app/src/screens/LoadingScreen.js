// LoadingScreen.js
// Purpose: Sends text/body symptoms to FastAPI, shows circular progress,
// and navigates to DetectedSymptomsScreen.

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

import {
  extractSymptomsFromText,
  extractSymptomsFromBody,
} from '../services/triageApi';

import { saveBase64AudioToCache } from '../utils/base64Audio';
import { buildDetectedSymptomsParams } from '../utils/routeParams';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function LoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const text = params.text || '';
  const language = params.language || 'en';
  const source = params.source || 'text';
  const gender = params.gender || 'male';

  const [percent, setPercent] = useState(0);
  const [apiData, setApiData] = useState(null);
  const [apiFinished, setApiFinished] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const navigatedRef = useRef(false);

  const radius = 80;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;

  // Animate progress circle
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percent,
      duration: percent >= 100 ? 0 : 120,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  // Faster loading animation
  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        // Stop at 90% until API finishes
        if (!apiFinished && prev >= 90) {
          return 90;
        }

        // Stop at 100%
        if (prev >= 100) {
          return 100;
        }

        // Faster increase
        return prev + 2;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [apiFinished]);

  // Send symptoms to FastAPI
  async function loadDetectedSymptoms() {
    try {
      let data;

      // BODY FLOW
      if (source === 'body') {
        const symptomsArray = String(text)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);

        data = await extractSymptomsFromBody(
          symptomsArray,
          language || 'en'
        );
      }

      // TEXT FLOW
      else {
        data = await extractSymptomsFromText(
          text,
          language || 'en'
        );
      }

      // Save backend audio locally
      const voiceFileUri = await saveBase64AudioToCache(
        data?.voice_b64,
        'saca_detected_voice.wav'
      );

      setApiData({
        ...data,
        voice_file_uri: voiceFileUri,
      });

      // API finished
      setApiFinished(true);
    } catch (error) {
      console.log('Symptoms API error:', error);

      Alert.alert(
        'Connection Error',
        'Could not connect to FastAPI.'
      );

      if (source === 'body') {
        router.replace('/bodyinput');
      } else {
        router.replace('/textinput');
      }
    }
  }

  // Load symptoms on screen start
  useEffect(() => {
    loadDetectedSymptoms();
  }, []);

  // Navigate when loading reaches 100
  useEffect(() => {
    if (
      apiFinished &&
      percent >= 100 &&
      apiData &&
      !navigatedRef.current
    ) {
      navigatedRef.current = true;

      router.replace({
        pathname: '/detectedsymptoms',
        params: {
          ...buildDetectedSymptomsParams(
            apiData,
            language,
            apiData.voice_file_uri
          ),

          source: source || 'text',
          gender: gender || 'male',
        },
      });
    }
  }, [apiFinished, percent, apiData]);

  // Circular progress animation
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5EAD8"
      />

      <View style={styles.wrapper}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.container}>
            {/* TOP TITLE */}
            <Text style={styles.topText}>
              Checking your Symptoms...
            </Text>

            {/* PROGRESS CIRCLE */}
            <View style={styles.circleWrapper}>
              <Svg width={190} height={190}>
                {/* BACKGROUND CIRCLE */}
                <Circle
                  cx="95"
                  cy="95"
                  r={radius}
                  stroke="#D6A24B"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />

                {/* PROGRESS CIRCLE */}
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

              {/* PERCENT TEXT */}
              <View style={styles.circleContent}>
                <Text style={styles.percent}>
                  {percent}%
                </Text>

                <Text style={styles.loadingText}>
                  {percent >= 100
                    ? 'DONE'
                    : 'LOADING'}
                </Text>
              </View>
            </View>

            {/* BOTTOM TEXT */}
            <Text style={styles.bottomText}>
              {percent >= 100
                ? 'Preparing your results...'
                : 'Please wait while we detect your symptoms...'}
            </Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}