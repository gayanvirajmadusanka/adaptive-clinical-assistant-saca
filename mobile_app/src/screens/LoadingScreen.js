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
import { useLanguage } from '../context/LanguageContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function LoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useLanguage();

  const [percent, setPercent] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const navigatedRef = useRef(false);

  const radius = 95;
  const strokeWidth = 17;
  const size = 230;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    sendTextToApi();

    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev < 95) return prev + 3;
        return 95;
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percent,
      duration: 50,
      useNativeDriver: false,
    }).start();
  }, [percent]);

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

      if (navigatedRef.current) return;
      navigatedRef.current = true;

      setPercent(100);

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
          language: selectedLanguage,
          source: 'text',
        },
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
            <Text style={styles.topText}>{t('detecting_symptoms')}</Text>

            <View style={styles.circleWrapper}>
              <Svg width={size} height={size}>
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke="#D6A24B"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />

                <AnimatedCircle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke="#B65A24"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin={`${center}, ${center}`}
                />
              </Svg>

              <View style={styles.circleContent}>
                <Text style={styles.percent}>{percent}%</Text>

                <Text style={styles.loadingText}>
                  {percent >= 100 ? t('done') : t('loading')}
                </Text>
              </View>
            </View>

            <Text style={styles.bottomText}>{t('please_wait_symptoms')}</Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}