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
import * as FileSystem from 'expo-file-system/legacy';
import styles from '../styles/loadingStyles';

const API_URL = 'http://192.168.1.106:8000';

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

        let voiceFileUri = '';

        if (data.voice_b64) {
          const cleanedBase64 = data.voice_b64.replace(
            /^data:audio\/\w+;base64,/,
            ''
          );

          voiceFileUri = FileSystem.cacheDirectory + 'saca_detected_voice.wav';

          await FileSystem.writeAsStringAsync(voiceFileUri, cleanedBase64, {
            encoding: 'base64',
          });
        }

        setApiData({
          ...data,
          voice_file_uri: voiceFileUri,
        });

        setApiFinished(true);
      } catch (error) {
        console.log('API ERROR:', error);

        Alert.alert(
          'Connection Error',
          'Could not connect to FastAPI.'
        );

        router.replace('/textinput');
      }
    };

    sendSymptomsToApi();
  }, []);

  useEffect(() => {
    if (apiFinished && percent >= 100 && apiData && !navigatedRef.current) {
      navigatedRef.current = true;

      router.replace({
        pathname: '/detectedsymptoms',
        params: {
          symptoms_en: JSON.stringify(apiData.symptoms_en || []),
          symptoms_wp: JSON.stringify(apiData.symptoms_wp || []),
          confidence: String(apiData.confidence || ''),
          language: apiData.language || language || 'en',
          voice_file_uri: apiData.voice_file_uri || '',
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