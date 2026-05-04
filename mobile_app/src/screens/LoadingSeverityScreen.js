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

const API_URL = 'http://192.168.1.106:8000';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function LoadingSeverityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [percent, setPercent] = useState(0);
  const [apiFinished, setApiFinished] = useState(false);
  const [resultData, setResultData] = useState(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const navigatedRef = useRef(false);

  const radius = 80;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percent,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (!apiFinished && prev >= 90) return 90;
        if (apiFinished && prev < 100) return prev + 2;
        return prev;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [apiFinished]);

  useEffect(() => {
    const classifySeverity = async () => {
      try {
        const symptomsEn = params.symptoms_en
          ? JSON.parse(params.symptoms_en)
          : [];

        const symptomsWp = params.symptoms_wp
          ? JSON.parse(params.symptoms_wp)
          : [];

        const answers = params.answers
          ? JSON.parse(params.answers)
          : [];

        const language = params.language || 'en';

        const symptomsToSend =
          symptomsEn.length > 0 ? symptomsEn : symptomsWp;

        const response = await fetch(`${API_URL}/classify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symptoms: symptomsToSend,
            answers: answers,
            language: language,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to classify severity');
        }

        const data = await response.json();

        setResultData(data);
        setApiFinished(true);
      } catch (error) {
        console.log('API ERROR:', error);
        Alert.alert('Error', 'Could not get result.');
        router.back();
      }
    };

    classifySeverity();
  }, []);

  useEffect(() => {
    if (percent >= 100 && resultData && !navigatedRef.current) {
      navigatedRef.current = true;

      const symptomsEn = params.symptoms_en
        ? JSON.parse(params.symptoms_en)
        : [];

      const symptomsWp = params.symptoms_wp
        ? JSON.parse(params.symptoms_wp)
        : [];

      const answers = params.answers
        ? JSON.parse(params.answers)
        : [];

      const language = params.language || 'en';

      const symptomsToSend =
        symptomsEn.length > 0 ? symptomsEn : symptomsWp;

      router.replace({
        pathname: '/result',
        params: {
          result_data: JSON.stringify(resultData),
          classify_payload: JSON.stringify({
            symptoms: symptomsToSend,
            answers: answers,
            language: language,
          }),
        },
      });
    }
  }, [percent, resultData]);

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
            <Text style={styles.topText}>Checking severity...</Text>

            <View style={styles.circleWrapper}>
              <Svg width={190} height={190}>
                {/* background */}
                <Circle
                  cx="95"
                  cy="95"
                  r={radius}
                  stroke="#D6A24B"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />

                {/* 🔥 FIXED PROGRESS */}
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
                <Text style={styles.loadingText}>LOADING</Text>
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