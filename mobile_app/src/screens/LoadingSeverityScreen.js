// LoadingSeverityScreen.js

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
import { useLocalSearchParams, useRouter } from 'expo-router';

import styles from '../styles/loadingStyles';
import { classifySymptoms } from '../services/triageApi';
import { parseJsonParam, buildResultParams } from '../utils/routeParams';
import { buildClassifyPayload } from '../utils/triagePayloads';
import { useLanguage } from '../context/LanguageContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function LoadingSeverityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useLanguage();

  const [percent, setPercent] = useState(0);
  const [apiFinished, setApiFinished] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [payloadData, setPayloadData] = useState(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const navigatedRef = useRef(false);

  const radius = 95;
  const strokeWidth = 17;
  const size = 230;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    classifySeverity();

    const timer = setInterval(() => {
      setPercent((prev) => {
        if (!apiFinished) {
          // Faster smooth loading until 95%
          if (prev < 95) return prev + 2;

          return 95;
        }

        // Faster finish animation
        if (prev < 100) {
          return prev + 2;
        }

        return 100;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [apiFinished]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percent,
      duration: 40,
      useNativeDriver: false,
    }).start();

    // Navigate only after 100%
    if (
      percent >= 100 &&
      apiFinished &&
      resultData &&
      payloadData &&
      !navigatedRef.current
    ) {
      navigatedRef.current = true;

      router.replace({
        pathname: '/result',
        params: buildResultParams(resultData, payloadData),
      });
    }
  }, [percent, apiFinished, resultData, payloadData]);

  async function classifySeverity() {
    try {
      const symptomsEn = parseJsonParam(params.symptoms_en, []);
      const symptomsWp = parseJsonParam(params.symptoms_wp, []);
      const answers = parseJsonParam(params.answers, []);
      const language = String(params.language || 'en');

      const payload = buildClassifyPayload(
        symptomsEn,
        symptomsWp,
        answers,
        language
      );

      const data = await classifySymptoms(
        payload.symptoms,
        payload.answers,
        payload.language
      );

      setPayloadData(payload);
      setResultData(data);

      // Tell loading animation API is complete
      setApiFinished(true);
    } catch (error) {
      console.log('Severity API error:', error);

      Alert.alert(
        t('error'),
        t('severity_error_message')
      );

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
            <Text style={styles.topText}>
              {t('analyzing_severity')}
            </Text>

            <View style={styles.circleWrapper}>
              <Svg width={size} height={size}>
                {/* Background circle */}
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke="#D6A24B"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />

                {/* Animated progress circle */}
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
                <Text style={styles.percent}>
                  {Math.min(percent, 100)}%
                </Text>

                <Text style={styles.loadingText}>
                  {percent >= 100
                    ? t('done')
                    : t('loading')}
                </Text>
              </View>
            </View>

            <Text style={styles.bottomText}>
              {t('please_wait_severity')}
            </Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}