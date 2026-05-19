// VoiceInputScreen.js
// Purpose: Records the user's symptom description by voice.
// Auto-plays describe_symptoms_en/wp audio when this screen opens.
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

const describeSymptomsAudio = {
  en: require('../../assets/audio/ui/describe_symptoms_en.wav'),
  wp: require('../../assets/audio/ui/describe_symptoms_wp.wav'),
};

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
  const instructionSoundRef = useRef(null);

  useEffect(() => {
    playDescribeSymptomsAudio(lang);

    return () => {
      cleanupAudio();
    };
  }, []);

  const stopInstructionAudio = async () => {
    try {
      if (instructionSoundRef.current) {
        const sound = instructionSoundRef.current;
        instructionSoundRef.current = null;

        const status = await sound.getStatusAsync();

        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      }
    } catch (error) {
      console.log('Stop instruction audio error:', error);
    }
  };

  const playDescribeSymptomsAudio = async (languageCode) => {
    try {
      await stopInstructionAudio();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      const selectedAudio =
        languageCode === 'wp'
          ? describeSymptomsAudio.wp
          : describeSymptomsAudio.en;

      const { sound } = await Audio.Sound.createAsync(
        selectedAudio,
        {
          shouldPlay: true,
          volume: 1.0,
        }
      );

      instructionSoundRef.current = sound;

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          try {
            if (instructionSoundRef.current === sound) {
              instructionSoundRef.current = null;
            }

            await sound.unloadAsync();
          } catch (error) {
            console.log('Describe audio unload error:', error);
          }
        }
      });
    } catch (error) {
      console.log('Describe symptoms audio error:', error);
    }
  };

  const cleanupAudio = async () => {
    try {
      stopTimer();
      stopPulse();
      stopBars();

      await stopInstructionAudio();

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
    loopBar(bar5, 40, 370).start();
  };

  const stopBars = () => {
    bar1.stopAnimation();
    bar2.stopAnimation();
    bar3.stopAnimation();
    bar4.stopAnimation();
    bar5.stopAnimation();

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
      secondsRef.current += 0.01;
      setRecordTime(secondsRef.current.toFixed(2));
    }, 10);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const getAudioExtension = (uri) => {
    const extension = String(uri || '').split('.').pop();
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

    await stopInstructionAudio();

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
      await stopInstructionAudio();

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

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: playableUri },
        {
          shouldPlay: true,
          volume: 1.0,
        }
      );

      setRecordedSound(sound);
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          sound.unloadAsync();
          setRecordedSound(null);
        }
      });
    } catch (error) {
      console.log('Playback error:', error);
      Alert.alert('Playback error', 'Could not play the recorded voice.');
      setIsPlaying(false);
    }
  };

  const handleDelete = async () => {
    try {
      await stopInstructionAudio();

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

    await stopInstructionAudio();

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

  const beforeLanguageChange = async () => {
    await stopInstructionAudio();
  };

  const afterLanguageChange = async (selectedLang) => {
    if (!isRecording) {
      await playDescribeSymptomsAudio(selectedLang);
    }
  };

  return (
    <AppScreen
      beforeLanguageChange={beforeLanguageChange}
      afterLanguageChange={afterLanguageChange}
      onHomePress={async () => {
        await cleanupAudio();
        router.replace('/input');
      }}
    >
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>
            {t('speak_option') || 'Speak'}
          </Text>

          <Image
            source={require('../../assets/images/voice.png')}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </View>

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

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backPressedGrey,
          ]}
          onPress={async () => {
            await cleanupAudio();
            router.back();
          }}
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