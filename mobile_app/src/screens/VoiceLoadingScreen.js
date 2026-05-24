// VoiceLoadingScreen.js
// Handles two paths:
//   Android English → receives transcribed_text from native STT → calls /extract/text
//   iOS English     → receives audio_uri → base64 encodes → calls /extract/audio
// Shows circular loading progress then opens DetectedSymptomsVoiceScreen.

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
import { extractSymptomsFromText, extractSymptomsFromAudio } from '../services/triageApi';
import { useLanguage } from '../context/LanguageContext';
import {
  readAudioFileAsBase64,
  saveBase64AudioToCache,
} from '../utils/base64Audio';
import { buildDetectedSymptomsParams } from '../utils/routeParams';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function VoiceLoadingScreen() {
  const router = useRouter();
  const { audio_uri, language, transcribed_text } = useLocalSearchParams();
  const { t } = useLanguage();

  const selectedLanguage = String(language || 'en');

  const [percent, setPercent] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const navigatedRef = useRef(false);

  const radius = 95;
  const strokeWidth = 17;
  const size = 230;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const screenText = {
    top: t('voice_loading_top'),
    bottom: t('voice_loading_bottom'),
    preparing: t('voice_loading_preparing'),
    loading: t('loading'),
    done: t('done'),
  };

  useEffect(() => {
    sendAudioToApi();

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

  async function sendAudioToApi() {
    try {
      let data;

      if (transcribed_text) {
        // Android native STT path: text already transcribed, send directly
        data = await extractSymptomsFromText(transcribed_text, selectedLanguage);
      } else {
        // iOS audio path: encode audio and send to /extract/audio
        if (!audio_uri) {
          Alert.alert('Error', 'No audio file found. Please record again.');
          router.back();
          return;
        }

        console.log('VOICE AUDIO URI:', audio_uri);
        console.log('VOICE SELECTED LANGUAGE:', selectedLanguage);

        const audioBase64 = await readAudioFileAsBase64(String(audio_uri));

        console.log('VOICE BASE64 LENGTH:', audioBase64?.length);
        console.log('VOICE BASE64 START:', audioBase64?.substring(0, 30));

        if (!audioBase64 || audioBase64.length < 100) {
          Alert.alert('Error', 'Recorded audio is empty. Please record again.');
          router.back();
          return;
        }

        data = await extractSymptomsFromAudio(audioBase64, selectedLanguage);

        console.log('VOICE API DATA:', JSON.stringify(data, null, 2));
      }

      const voiceFileUri = await saveBase64AudioToCache(
        data?.voice_b64,
        `voice_result_${data?.language || selectedLanguage}.wav`
      );

      if (navigatedRef.current) return;
      navigatedRef.current = true;

      setPercent(100);

      router.replace({
        pathname: '/detectedsymptomsvoice',
        params: {
          ...buildDetectedSymptomsParams(data, selectedLanguage, voiceFileUri),
          source: 'voice',
        },
      });
    } catch (error) {
      console.log('Audio API error:', error?.message || error);
      console.log('FULL Audio API error:', error);

      Alert.alert('Error', 'Could not process your voice. Please try again.');
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
              {screenText.top}
            </Text>

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
                  {percent >= 100
                    ? screenText.done
                    : screenText.loading}
                </Text>
              </View>
            </View>

            <Text style={styles.bottomText}>
              {percent >= 100
                ? screenText.preparing
                : screenText.bottom}
            </Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}
