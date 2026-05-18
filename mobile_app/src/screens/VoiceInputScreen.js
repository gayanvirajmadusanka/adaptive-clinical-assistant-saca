// VoiceInputScreen.js
// Purpose: Records the user's symptom description by voice.
// AppScreen handles SafeArea, background, footer, and language modal.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Alert,
  Image,
} from 'react-native';

import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import { WAV_RECORDING_OPTIONS } from '../utils/audioRecordingOptions';
import styles from '../styles/voiceInputStyles';

export default function VoiceInputScreen() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const [recording, setRecording] = useState(null);
  const [recordedSound, setRecordedSound] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [safeRecordingUri, setSafeRecordingUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordTime, setRecordTime] = useState('0.00');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bar1 = useRef(new Animated.Value(14)).current;
  const bar2 = useRef(new Animated.Value(28)).current;
  const bar3 = useRef(new Animated.Value(18)).current;
  const bar4 = useRef(new Animated.Value(34)).current;
  const bar5 = useRef(new Animated.Value(20)).current;

  const timerRef = useRef(null);
  const secondsRef = useRef(0);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = async () => {
    try {
      stopTimer();
      stopPulse();
      stopBars();

      if (recording) {
        await recording.stopAndUnloadAsync();
      }

      if (recordedSound) {
        await recordedSound.unloadAsync();
      }
    } catch (error) {
      console.log('Audio cleanup error:', error);
    }
  };

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.16,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const animateBars = () => {
    const loopBar = (bar, height, duration) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: height,
            duration,
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: 12,
            duration,
            useNativeDriver: false,
          }),
        ])
      );

    loopBar(bar1, 36, 330).start();
    loopBar(bar2, 58, 390).start();
    loopBar(bar3, 44, 350).start();
    loopBar(bar4, 62, 410).start();
    loopBar(bar5, 38, 360).start();
  };

  const stopBars = () => {
    [bar1, bar2, bar3, bar4, bar5].forEach((bar) => bar.stopAnimation());

    bar1.setValue(14);
    bar2.setValue(28);
    bar3.setValue(18);
    bar4.setValue(34);
    bar5.setValue(20);
  };

  const startTimer = () => {
    secondsRef.current = 0;
    setRecordTime('0.00');

    timerRef.current = setInterval(() => {
      secondsRef.current += 0.1;
      setRecordTime(secondsRef.current.toFixed(2));
    }, 100);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const getAudioExtension = (uri) => {
    if (!uri) return '3gp';

    const cleanUri = uri.split('?')[0];
    const extension = cleanUri.split('.').pop();

    return extension || '3gp';
  };

  const copyRecordingToSafeCache = async (sourceUri) => {
    const extension = getAudioExtension(sourceUri);
    const safeUri = `${FileSystem.cacheDirectory}saca_voice_recording_${Date.now()}.${extension}`;

    await FileSystem.copyAsync({
      from: sourceUri,
      to: safeUri,
    });

    return safeUri;
  };

  const handleMicPress = async () => {
    try {
      if (isRecording) {
        await stopRecording();
        return;
      }

      await startRecording();
    } catch (error) {
      console.log('Recording error:', error);
      Alert.alert(
        'Recording error',
        'Could not record your voice. Please try again.'
      );
    }
  };

  const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        'Please allow microphone permission to record your symptoms.'
      );
      return;
    }

    if (recordedSound) {
      await recordedSound.unloadAsync();
      setRecordedSound(null);
    }

    setRecordingUri(null);
    setSafeRecordingUri(null);
    setIsPlaying(false);

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    const newRecording = new Audio.Recording();

    await newRecording.prepareToRecordAsync(WAV_RECORDING_OPTIONS);
    await newRecording.startAsync();

    setRecording(newRecording);
    setIsRecording(true);

    startPulse();
    animateBars();
    startTimer();
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();

      if (!uri) {
        Alert.alert(
          'Recording error',
          'Audio file was not saved. Please record again.'
        );

        setRecording(null);
        setIsRecording(false);

        stopPulse();
        stopBars();
        stopTimer();
        return;
      }

      const copiedUri = await copyRecordingToSafeCache(uri);

      setRecordingUri(uri);
      setSafeRecordingUri(copiedUri);
      setRecording(null);
      setIsRecording(false);

      stopPulse();
      stopBars();
      stopTimer();
    } catch (error) {
      console.log('STOP RECORDING ERROR:', error);

      setRecording(null);
      setRecordingUri(null);
      setSafeRecordingUri(null);
      setIsRecording(false);

      stopPulse();
      stopBars();
      stopTimer();

      Alert.alert(
        'Recording error',
        'Could not save your recording. Please try again.'
      );
    }
  };

  const handlePlay = async () => {
    try {
      const playableUri = safeRecordingUri || recordingUri;

      if (!playableUri) {
        Alert.alert('No recording', 'Please record your voice first.');
        return;
      }

      if (recordedSound && isPlaying) {
        await recordedSound.stopAsync();
        setIsPlaying(false);
        return;
      }

      if (recordedSound) {
        await recordedSound.unloadAsync();
        setRecordedSound(null);
      }

      const { sound } = await Audio.Sound.createAsync({ uri: playableUri });

      setRecordedSound(sound);
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          sound.unloadAsync();
          setRecordedSound(null);
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.log('Playback error:', error);
      Alert.alert('Playback error', 'Could not play the recorded voice.');
      setIsPlaying(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
      }

      if (recordedSound) {
        await recordedSound.unloadAsync();
      }

      setRecording(null);
      setRecordedSound(null);
      setRecordingUri(null);
      setSafeRecordingUri(null);
      setIsRecording(false);
      setIsPlaying(false);
      setRecordTime('0.00');

      stopPulse();
      stopBars();
      stopTimer();
    } catch (error) {
      console.log('Delete recording error:', error);
    }
  };

  const handleContinue = async () => {
    const finalAudioUri = safeRecordingUri || recordingUri;

    if (!finalAudioUri) {
      Alert.alert('No recording', 'Please record your voice first.');
      return;
    }

    if (isRecording) {
      Alert.alert(
        'Recording still active',
        'Please stop recording before continuing.'
      );
      return;
    }

    if (recordedSound) {
      await recordedSound.unloadAsync();
      setRecordedSound(null);
      setIsPlaying(false);
    }

    router.push({
      pathname: '/voiceloading',
      params: {
        audio_uri: finalAudioUri,
        language: lang || 'en',
      },
    });
  };

  return (
    <AppScreen>
      <View style={styles.container}>
        {/* HEADER SECTION - same position as TextInputScreen */}
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>{t('speak_option') || 'Speak'}</Text>

          <Image
            source={require('../../assets/images/voice.png')}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </View>

        {/* RECORDING BOX */}
        <View style={styles.recordBox}>
          <Animated.View
            style={[
              styles.pulseCircle,
              isRecording && styles.recordingBorder,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Pressable onPress={handleMicPress} style={styles.micCircle}>
              <Image
                source={require('../../assets/images/microphone.png')}
                style={styles.micImage}
                resizeMode="contain"
              />
            </Pressable>
          </Animated.View>

          <View style={styles.waveformContainer}>
            <Animated.View style={[styles.waveBar, { height: bar1 }]} />
            <Animated.View style={[styles.waveBar, { height: bar2 }]} />
            <Animated.View style={[styles.waveBar, { height: bar3 }]} />
            <Animated.View style={[styles.waveBar, { height: bar4 }]} />
            <Animated.View style={[styles.waveBar, { height: bar5 }]} />
          </View>

          <Text style={styles.recordText}>
            {isRecording
              ? t('recording_hint') || 'Recording... tap to stop'
              : t('speak_hint') || 'Click on mic to record voice'}
          </Text>
        </View>

        {/* PLAYBACK / DELETE / CONTINUE BAR */}
        <View style={styles.bottomBox}>
          <View style={styles.leftControls}>
            <Pressable
              onPress={handleDelete}
              disabled={!recordingUri && !isRecording}
              style={[
                styles.deleteButton,
                !recordingUri && !isRecording && styles.disabledControl,
              ]}
            >
              <MaterialIcons name="delete-outline" size={28} color="#000" />
            </Pressable>

            <Pressable
              onPress={handlePlay}
              disabled={!recordingUri}
              style={[
                styles.playButton,
                !recordingUri && styles.disabledControl,
              ]}
            >
              <Ionicons
                name={isPlaying ? 'stop' : 'play'}
                size={34}
                color="#000"
              />
            </Pressable>

            <Text style={styles.timeText}>{recordTime}</Text>
          </View>

          {recordingUri && (
            <Pressable onPress={handleContinue} style={styles.continueButton}>
              <Text style={styles.continueText}>
                {t('continue') || 'Continue'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* BACK BUTTON - same style as TextInputScreen */}
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backPressedGrey,
          ]}
          onPress={() => router.back()}
        >
          <View style={styles.backButtonContent}>
            <Image
              source={require('../../assets/images/back-arrow.png')}
              style={styles.backArrowImage}
              resizeMode="contain"
            />

            <Text style={styles.backText}>{t('back')}</Text>
          </View>
        </Pressable>
      </View>
    </AppScreen>
  );
}