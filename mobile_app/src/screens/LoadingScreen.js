// LoadingScreen.js
// Purpose: Sends text/body symptoms to FastAPI, shows circular progress,
// and navigates to DetectedSymptomsScreen.
// Important: Audio is NOT saved here anymore, so loading does not wait after 100%.

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

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percent,
      duration: percent >= 100 ? 0 : 120,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (!apiFinished && prev >= 90) return 90;
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [apiFinished]);

  async function loadDetectedSymptoms() {
    try {
      let data;

      if (source === 'body') {
        const symptomsArray = String(text)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);

        data = await extractSymptomsFromBody(symptomsArray, language || 'en');
      } else {
        data = await extractSymptomsFromText(text, language || 'en');
      }

      setApiData(data);
      setApiFinished(true);
      setPercent(100);
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

  useEffect(() => {
    loadDetectedSymptoms();
  }, []);

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
          symptoms_en: JSON.stringify(apiData?.symptoms_en || []),
          symptoms_wp: JSON.stringify(apiData?.symptoms_wp || []),

          confidence: String(apiData?.confidence ?? 0),
          input_type: apiData?.input_type || source || 'text',
          language: apiData?.language || language || 'en',

          voice_b64_en: apiData?.voice_b64_en || '',
          voice_b64_wp: apiData?.voice_b64_wp || '',

          original_text: text || '',
          source: source || 'text',
          gender: gender || 'male',
        },
      });
    }
  }, [apiFinished, percent, apiData]);

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
            <Text style={styles.topText}>
              Checking your Symptoms...
            </Text>

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
                <Text style={styles.percent}>
                  {percent}%
                </Text>

                <Text style={styles.loadingText}>
                  {percent >= 100 ? 'DONE' : 'LOADING'}
                </Text>
              </View>
            </View>

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