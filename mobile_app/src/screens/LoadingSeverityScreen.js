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

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function LoadingSeverityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [percent, setPercent] = useState(0);
  const [apiFinished, setApiFinished] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [classifyPayload, setClassifyPayload] = useState(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const navigatedRef = useRef(false);

  const radius = 80;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;

  // Animates the circular progress value.
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percent,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  // Updates loading percentage while waiting for the API response.
  useEffect(() => {
    const timer = setInterval(updateProgressPercent, 60);
    return () => clearInterval(timer);
  }, [apiFinished]);

  // Starts severity classification when this screen opens.
  useEffect(() => {
    classifySeverity();
  }, []);

  // Moves to the result screen after progress reaches 100 percent.
  useEffect(() => {
    navigateToResultWhenReady();
  }, [percent, resultData]);

  // Controls fake loading progress while the real API is processing.
  function updateProgressPercent() {
    setPercent((prev) => {
      if (!apiFinished && prev >= 90) return 90;
      if (apiFinished && prev < 100) return prev + 2;
      return prev;
    });
  }

  // Reads route params and creates the classify request payload.
  function getClassifyPayloadFromParams() {
    const symptomsEn = parseJsonParam(params.symptoms_en, []);
    const symptomsWp = parseJsonParam(params.symptoms_wp, []);
    const answers = parseJsonParam(params.answers, []);
    const language = params.language || 'en';

    return buildClassifyPayload(symptomsEn, symptomsWp, answers, language);
  }

  // Sends symptoms and answers to FastAPI for severity classification.
  async function classifySeverity() {
    try {
      const payload = getClassifyPayloadFromParams();
      const data = await classifySymptoms(
        payload.symptoms,
        payload.answers,
        payload.language
      );

      setClassifyPayload(payload);
      setResultData(data);
      setApiFinished(true);
    } catch (error) {
      console.log('Severity API error:', error);
      Alert.alert('Error', 'Could not get result.');
      router.back();
    }
  }

  // Navigates to the result screen once both API data and loading are complete.
  function navigateToResultWhenReady() {
    if (percent < 100 || !resultData || !classifyPayload || navigatedRef.current) {
      return;
    }

    navigatedRef.current = true;

    router.replace({
      pathname: '/result',
      params: buildResultParams(resultData, classifyPayload),
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
            <Text style={styles.topText}>Checking severity...</Text>

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
