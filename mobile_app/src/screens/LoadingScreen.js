// LoadingScreen.js
// Purpose: Sends text symptoms to FastAPI, shows circular progress, and navigates to DetectedSymptomsScreen.
// The progress stops at 90% until the API response is received.

// React and React Native imports used to build this screen component.
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
import Svg, { Circle } from 'react-native-svg'; // Used for circular progress UI
import { useRouter, useLocalSearchParams } from 'expo-router'; // Navigation + receiving params
import styles from '../styles/loadingStyles';

// API + utility functions
import { extractSymptomsFromText } from '../services/triageApi';
import { saveBase64AudioToCache } from '../utils/base64Audio';
import { buildDetectedSymptomsParams } from '../utils/routeParams';

// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Main screen component: LoadingScreen
export default function LoadingScreen() {

  const router = useRouter();

  // Get parameters passed from previous screen
  const { text, language } = useLocalSearchParams();

  // Progress percentage state (0–100)
  const [percent, setPercent] = useState(0);

  // Store API response data
  const [apiData, setApiData] = useState(null);

  // Flag to check if API call is finished
  const [apiFinished, setApiFinished] = useState(false);

  // Animation value for circular progress
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Prevent multiple navigation calls
  const navigatedRef = useRef(false);

  // Circle properties
  const radius = 80;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;

  // Animate progress when percent changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percent,
      duration: percent >= 100 ? 0 : 200,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  // Increment progress automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (!apiFinished && prev >= 90) return 90; // Stop at 90% until API finishes
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 35);

    return () => clearInterval(timer); // Cleanup
  }, [apiFinished]);

  // MAIN FUNCTION → Calls FastAPI
  async function loadDetectedSymptoms() {
    try {
      // Send text + language to backend
      const data = await extractSymptomsFromText(text, language || 'en');

      // Convert base64 voice to file
      const voiceFileUri = await saveBase64AudioToCache(
        data?.voice_b64,
        'saca_detected_voice.wav'
      );

      // Store API response + voice file
      setApiData({
        ...data,
        voice_file_uri: voiceFileUri,
      });

      setApiFinished(true); // API completed
    } catch (error) {
      console.log('Text API error:', error);

      // Show error alert
      Alert.alert('Connection Error', 'Could not connect to FastAPI.');

      // Go back to input screen
      router.replace('/textinput');
    }
  }

  // Call API once when screen loads
  useEffect(() => {
    loadDetectedSymptoms();
  }, []);

  // Navigate when everything is ready
  useEffect(() => {
    if (apiFinished && percent >= 100 && apiData && !navigatedRef.current) {
      navigatedRef.current = true;

      router.replace({
        pathname: '/detectedsymptoms',
        params: buildDetectedSymptomsParams(
          apiData,
          language,
          apiData.voice_file_uri
        ),
      });
    }
  }, [apiFinished, percent, apiData]);

  // Convert progress to circle animation
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

            {/* Top text */}
            <Text style={styles.topText}>Checking your Symptoms...</Text>

            {/* Circular Progress UI */}
            <View style={styles.circleWrapper}>
              {/* SVG draws the circular loading progress. */}
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

                {/* Animated progress circle */}
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

              {/* Center content */}
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
                : 'Please wait while we detect your symptoms...'}
            </Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}