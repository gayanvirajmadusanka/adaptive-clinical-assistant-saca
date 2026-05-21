// VoiceInputScreen.js
// Android: uses native SpeechRecognizer via expo-speech-recognition (no faster-whisper needed).
// iOS/other: records audio with expo-av and sends to Python /extract/audio.

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/voiceInputStyles';

const IS_ANDROID = Platform.OS === 'android';

// Recording options for iOS audio path (Android uses native STT instead)
const RECORDING_OPTIONS = {
  ios: {
    extension: '.wav',
    outputFormat: Audio.IOSOutputFormat.LINEARPCM,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 256000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: { mimeType: 'audio/webm', bitsPerSecond: 128000 },
};

export default function VoiceInputScreen() {
  const router = useRouter();

  // ── shared state ──────────────────────────────────────────────────────────
  const [isActive, setIsActive]   = useState(false); // recording (iOS) or listening (Android)

  // ── iOS-only state ────────────────────────────────────────────────────────
  const [recording, setRecording]       = useState(null);
  const [recordedSound, setRecordedSound] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [recordTime, setRecordTime]     = useState('0.00');
  const timerRef   = useRef(null);
  const secondsRef = useRef(0);

  // ── Android-only state ────────────────────────────────────────────────────
  const [transcript, setTranscript] = useState('');

  // ── animation refs ────────────────────────────────────────────────────────
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bar1 = useRef(new Animated.Value(14)).current;
  const bar2 = useRef(new Animated.Value(28)).current;
  const bar3 = useRef(new Animated.Value(18)).current;
  const bar4 = useRef(new Animated.Value(34)).current;
  const bar5 = useRef(new Animated.Value(20)).current;

  // ── Android STT events (hooks must be at top level regardless of platform) ─
  useSpeechRecognitionEvent('start', () => {
    if (IS_ANDROID) { setIsActive(true); startPulse(); animateBars(); }
  });
  useSpeechRecognitionEvent('end', () => {
    if (IS_ANDROID) { setIsActive(false); stopPulse(); stopBars(); }
  });
  useSpeechRecognitionEvent('result', (event) => {
    if (!IS_ANDROID) return;
    const text = event.results[0]?.transcript || '';
    setTranscript(text);
    if (event.isFinal) { setIsActive(false); stopPulse(); stopBars(); }
  });
  useSpeechRecognitionEvent('error', (event) => {
    if (!IS_ANDROID) return;
    setIsActive(false); stopPulse(); stopBars();
    if (event.error !== 'aborted') {
      Alert.alert('Speech recognition error', event.message || 'Please try again.');
    }
  });

  // ── animations ────────────────────────────────────────────────────────────
  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };
  const stopPulse = () => { pulseAnim.stopAnimation(); pulseAnim.setValue(1); };

  const animateBars = () => {
    const anim = (bar, h) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, { toValue: h,  duration: 350, useNativeDriver: false }),
          Animated.timing(bar, { toValue: 12, duration: 350, useNativeDriver: false }),
        ])
      );
    anim(bar1, 35).start(); anim(bar2, 55).start(); anim(bar3, 42).start();
    anim(bar4, 60).start(); anim(bar5, 38).start();
  };
  const stopBars = () => {
    [bar1, bar2, bar3, bar4, bar5].forEach(b => b.stopAnimation());
    bar1.setValue(14); bar2.setValue(28); bar3.setValue(18);
    bar4.setValue(34); bar5.setValue(20);
  };

  // ── timer (iOS only) ──────────────────────────────────────────────────────
  const startTimer = () => {
    secondsRef.current = 0;
    setRecordTime('0.00');
    timerRef.current = setInterval(() => {
      secondsRef.current += 0.1;
      setRecordTime(secondsRef.current.toFixed(2));
    }, 100);
  };
  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  // ── Android STT controls ──────────────────────────────────────────────────
  const startAndroidSTT = async () => {
    const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission required', 'Please allow microphone permission.');
      return;
    }
    setTranscript('');
    ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: true, continuous: false });
  };

  const stopAndroidSTT = () => {
    ExpoSpeechRecognitionModule.stop();
  };

  // ── iOS recording controls ────────────────────────────────────────────────
  const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow microphone permission.');
      return;
    }
    if (recordedSound) { await recordedSound.unloadAsync(); setRecordedSound(null); }
    setRecordingUri(null); setIsPlaying(false);
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(RECORDING_OPTIONS);
    await rec.startAsync();
    setRecording(rec); setIsActive(true);
    startPulse(); animateBars(); startTimer();
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingUri(uri); setRecording(null); setIsActive(false);
    stopPulse(); stopBars(); stopTimer();
  };

  // ── mic button ────────────────────────────────────────────────────────────
  const handleMicPress = async () => {
    try {
      if (IS_ANDROID) {
        isActive ? stopAndroidSTT() : await startAndroidSTT();
      } else {
        isActive ? await stopRecording() : await startRecording();
      }
    } catch (error) {
      console.log('Mic error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // ── iOS playback ──────────────────────────────────────────────────────────
  const handlePlay = async () => {
    if (IS_ANDROID) return;
    try {
      if (!recordingUri) { Alert.alert('No recording yet', 'Please record your voice first.'); return; }
      if (recordedSound && isPlaying) { await recordedSound.stopAsync(); setIsPlaying(false); return; }
      if (recordedSound) { await recordedSound.unloadAsync(); setRecordedSound(null); }
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setRecordedSound(sound); setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate(s => { if (s.didJustFinish) setIsPlaying(false); });
      await sound.playAsync();
    } catch (error) {
      console.log('Playback error:', error);
      Alert.alert('Playback error', 'Could not play recording.');
    }
  };

  // ── delete / reset ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      if (IS_ANDROID) {
        if (isActive) stopAndroidSTT();
        setTranscript('');
      } else {
        if (recording) await recording.stopAndUnloadAsync();
        if (recordedSound) await recordedSound.unloadAsync();
        setRecording(null); setRecordedSound(null); setRecordingUri(null);
        setIsPlaying(false); setRecordTime('0.00');
      }
      setIsActive(false); stopPulse(); stopBars(); stopTimer();
    } catch (error) {
      console.log('Delete error:', error);
    }
  };

  // ── continue ──────────────────────────────────────────────────────────────
  const handleContinue = async () => {
    if (IS_ANDROID) {
      if (!transcript.trim()) { Alert.alert('Nothing recorded', 'Please speak before continuing.'); return; }
      router.push({ pathname: '/voiceloading', params: { transcribed_text: transcript, language: 'en' } });
    } else {
      if (!recordingUri) { Alert.alert('No recording', 'Please record your voice first.'); return; }
      if (recordedSound) { await recordedSound.unloadAsync(); setRecordedSound(null); setIsPlaying(false); }
      router.push({ pathname: '/voiceloading', params: { audio_uri: recordingUri, language: 'en' } });
    }
  };

  const hasResult = IS_ANDROID ? transcript.trim().length > 0 : !!recordingUri;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back-circle-outline" size={26} />
            </Pressable>
            <Text style={styles.headerTitle}>SPEAK</Text>
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
                isActive && styles.recordingBorder,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Pressable onPress={handleMicPress} style={styles.micCircle}>
                <Ionicons
                  name={isActive ? 'mic' : 'mic-outline'}
                  size={70}
                  color="#000"
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

            {IS_ANDROID && transcript ? (
              <Text style={[styles.recordText, { fontStyle: 'italic' }]}>"{transcript}"</Text>
            ) : (
              <Text style={styles.recordText}>
                {isActive
                  ? IS_ANDROID ? 'Listening... tap to stop' : 'Recording... tap to stop'
                  : IS_ANDROID ? 'Tap mic and speak clearly' : 'Click on mic to record voice'}
              </Text>
            )}
          </View>

          <View style={styles.bottomBox}>
            <View style={styles.leftControls}>
              <Pressable onPress={handleDelete} style={styles.deleteButton}>
                <MaterialIcons name="delete-outline" size={28} color="#000" />
              </Pressable>

              {!IS_ANDROID && (
                <>
                  <Pressable onPress={handlePlay} style={styles.playButton}>
                    <Ionicons name={isPlaying ? 'stop' : 'play'} size={34} color="#000" />
                  </Pressable>
                  <Text style={styles.timeText}>{recordTime}</Text>
                </>
              )}
            </View>

            {hasResult && (
              <Pressable onPress={handleContinue} style={styles.continueButton}>
                <Text style={styles.continueText}>Continue</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
