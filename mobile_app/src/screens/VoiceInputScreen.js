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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/voiceInputStyles';

export default function VoiceInputScreen() {
  const router = useRouter();

  const [recording, setRecording] = useState(null);
  const [recordedSound, setRecordedSound] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);

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

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
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
    const createAnimation = (bar, height) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: height,
            duration: 350,
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: 12,
            duration: 350,
            useNativeDriver: false,
          }),
        ])
      );

    createAnimation(bar1, 35).start();
    createAnimation(bar2, 55).start();
    createAnimation(bar3, 42).start();
    createAnimation(bar4, 60).start();
    createAnimation(bar5, 38).start();
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

  const handleMicPress = async () => {
    try {
      if (isRecording) {
        await stopRecording();
      } else {
        await startRecording();
      }
    } catch (error) {
      console.log('Recording error:', error);
      Alert.alert('Error', 'Recording failed.');
    }
  };

  const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow microphone permission.');
      return;
    }

    if (recordedSound) {
      await recordedSound.unloadAsync();
      setRecordedSound(null);
    }

    setRecordingUri(null);
    setIsPlaying(false);

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const rec = new Audio.Recording();

    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();

    setRecording(rec);
    setIsRecording(true);

    startPulse();
    animateBars();
    startTimer();
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    setRecordingUri(uri);
    setRecording(null);
    setIsRecording(false);

    stopPulse();
    stopBars();
    stopTimer();
  };

  const handlePlay = async () => {
    try {
      if (!recordingUri) {
        Alert.alert('No recording yet', 'Please record your voice first.');
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

      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });

      setRecordedSound(sound);
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.log('Playback error:', error);
      Alert.alert('Playback error', 'Could not play recording.');
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
      setIsPlaying(false);
      setIsRecording(false);
      setRecordTime('0.00');

      stopPulse();
      stopBars();
      stopTimer();
    } catch (error) {
      console.log('Delete error:', error);
    }
  };

  const handleContinue = async () => {
    if (!recordingUri) {
      Alert.alert('No recording', 'Please record your voice first.');
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
        audio_uri: recordingUri,
        language: 'en',
      },
    });
  };

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
                isRecording && styles.recordingBorder,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Pressable onPress={handleMicPress} style={styles.micCircle}>
                <Ionicons
                  name={isRecording ? 'mic' : 'mic-outline'}
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

            <Text style={styles.recordText}>
              {isRecording
                ? 'Recording... tap to stop'
                : 'Click on mic to record voice'}
            </Text>
          </View>

          <View style={styles.bottomBox}>
            <View style={styles.leftControls}>
              <Pressable onPress={handleDelete} style={styles.deleteButton}>
                <MaterialIcons name="delete-outline" size={28} color="#000" />
              </Pressable>

              <Pressable onPress={handlePlay} style={styles.playButton}>
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
                <Text style={styles.continueText}>Continue</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}