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
import { extractSymptomsFromText } from '../services/triageApi';
import { saveBase64AudioToCache } from '../utils/base64Audio';
import { buildDetectedSymptomsParams } from '../utils/routeParams';


const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function LoadingScreen() {
  const router = useRouter();
  const { text, language } = useLocalSearchParams();

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
      duration: percent >= 100 ? 0 : 200,
      useNativeDriver: false,
    }).start();
  }, [percent]);

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

  // Sends text input to FastAPI and stores the extracted symptoms.
  async function loadDetectedSymptoms() {
    try {
      const data = await extractSymptomsFromText(text, language || 'en');
      const voiceFileUri = await saveBase64AudioToCache(
        data?.voice_b64,
        'saca_detected_voice.wav'
      );

      setApiData({
        ...data,
        voice_file_uri: voiceFileUri,
      });

      setApiFinished(true);
    } catch (error) {
      console.log('Text API error:', error);
      Alert.alert('Connection Error', 'Could not connect to FastAPI.');
      router.replace('/textinput');
    }
  }

  useEffect(() => {
    loadDetectedSymptoms();
  }, []);

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
            <Text style={styles.topText}>Checking your Symptoms...</Text>

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