// DetectedSymptomsVoiceScreen.js

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Image, Modal, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/detectedSymptomsStyles';

import {
  extractSymptomsFromText,
  resolveAnswerAudio,
} from '../services/triageApi';

import {
  saveBase64AudioToCache,
  readAudioFileAsBase64,
} from '../utils/base64Audio';

import { parseJsonParam, toJsonParam } from '../utils/routeParams';

export default function DetectedSymptomsVoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang } = useLanguage();

  const symptomsEn = parseJsonParam(params.symptoms_en, []);
  const symptomsWp = parseJsonParam(params.symptoms_wp, []);

  const [voiceFileUriEn, setVoiceFileUriEn] = useState(null);
  const [voiceFileUriWp, setVoiceFileUriWp] = useState(null);

  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const [recording, setRecording] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [checkingVoice, setCheckingVoice] = useState(false);
  const [selectedVoiceAnswer, setSelectedVoiceAnswer] = useState(null);
  const [voiceStatusText, setVoiceStatusText] = useState('Tap to Answer');

  const [recordedVoiceUri, setRecordedVoiceUri] = useState(null);
  const [recordedDuration, setRecordedDuration] = useState('0.00');

  const soundRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, [])
  );

  const symptomsToShow =
    lang === 'wp' && symptomsWp.length > 0
      ? symptomsWp
      : symptomsEn.map((item) => {
          const key = String(item).toLowerCase().replaceAll(' ', '_');
          return t(key);
        });

  const symptomText =
    symptomsToShow.length > 0
      ? symptomsToShow.map((item) => `• ${item}`).join('\n')
      : 'No symptoms detected';

  useEffect(() => {
    prepareInitialAudio();

    return () => {
      stopCurrentAudio();
    };
  }, []);

  async function prepareInitialAudio() {
    try {
      const voiceB64En = String(params.voice_b64_en || '');
      const voiceB64Wp = String(params.voice_b64_wp || '');

      if (voiceB64En) {
        const fileEn = await saveBase64AudioToCache(
          voiceB64En,
          'detected_symptoms_voice_en.wav'
        );
        setVoiceFileUriEn(fileEn);
      }

      if (voiceB64Wp) {
        const fileWp = await saveBase64AudioToCache(
          voiceB64Wp,
          'detected_symptoms_voice_wp.wav'
        );
        setVoiceFileUriWp(fileWp);
      }
    } catch (error) {
      console.log('Prepare detected voice audio error:', error);
    }
  }

  async function stopCurrentAudio() {
    try {
      if (soundRef.current) {
        const currentSound = soundRef.current;
        soundRef.current = null;

        const status = await currentSound.getStatusAsync();

        if (status.isLoaded) {
          await currentSound.stopAsync();
          await currentSound.unloadAsync();
        }
      }
    } catch (error) {
      console.log('Stop audio error:', error);
    }
  }

  async function getAudioFileForLanguage(languageCode) {
    const selectedLang = languageCode === 'wp' ? 'wp' : 'en';

    if (selectedLang === 'wp' && voiceFileUriWp) return voiceFileUriWp;
    if (selectedLang === 'en' && voiceFileUriEn) return voiceFileUriEn;

    const directAudio =
      selectedLang === 'wp'
        ? String(params.voice_b64_wp || '')
        : String(params.voice_b64_en || '');

    if (directAudio) {
      const fileUri = await saveBase64AudioToCache(
        directAudio,
        `detected_symptoms_voice_${selectedLang}.wav`
      );

      if (selectedLang === 'wp') {
        setVoiceFileUriWp(fileUri);
      } else {
        setVoiceFileUriEn(fileUri);
      }

      return fileUri;
    }

    const textToSend =
      selectedLang === 'wp'
        ? symptomsWp.length > 0
          ? symptomsWp.join(' ')
          : symptomsEn.join(' ')
        : symptomsEn.join(' ');

    if (!textToSend) return null;

    const data = await extractSymptomsFromText(textToSend, selectedLang);

    const audioBase64 =
      selectedLang === 'wp'
        ? String(data?.voice_b64_wp || '')
        : String(data?.voice_b64_en || '');

    if (!audioBase64) return null;

    const fileUri = await saveBase64AudioToCache(
      audioBase64,
      `detected_symptoms_voice_${selectedLang}.wav`
    );

    if (selectedLang === 'wp') {
      setVoiceFileUriWp(fileUri);
    } else {
      setVoiceFileUriEn(fileUri);
    }

    return fileUri;
  }

  async function playVoiceAudio() {
    try {
      if (audioLoading) {
        Alert.alert('Please wait', 'Preparing audio...');
        return;
      }

      setAudioLoading(true);

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      await stopCurrentAudio();

      const fileUri = await getAudioFileForLanguage(lang);

      if (!fileUri) {
        Alert.alert('Audio Error', 'No detected symptoms audio found.');
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true, volume: 1.0 }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          if (soundRef.current === sound) {
            soundRef.current = null;
          }

          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Play detected voice audio error:', error);
      Alert.alert('Audio Error', 'Unable to play audio.');
    } finally {
      setAudioLoading(false);
    }
  }

  async function handleVoiceAnswerPress() {
    if (checkingVoice || loading) return;

    if (isListening) {
      await stopVoiceRecording();
    } else {
      await startVoiceRecording();
    }
  }

  async function startVoiceRecording() {
    try {
      await stopCurrentAudio();

      const permission = await Audio.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow microphone permission.');
        return;
      }

      setSelectedVoiceAnswer(null);
      setRecordedVoiceUri(null);
      setRecordedDuration('0.00');
      setVoiceStatusText('Listening...');

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const newRecording = new Audio.Recording();

      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      await newRecording.startAsync();

      setRecording(newRecording);
      setIsListening(true);

      console.log('YES/NO RECORDING STARTED');
    } catch (error) {
      console.log('Start yes/no recording error:', error);

      setRecording(null);
      setIsListening(false);
      setVoiceStatusText('Tap to Answer');

      Alert.alert('Voice Error', 'Could not start recording.');
    }
  }

  async function stopVoiceRecording() {
    try {
      if (!recording) {
        setIsListening(false);
        setVoiceStatusText('Tap to Answer');
        return;
      }

      const status = await recording.getStatusAsync();

      const durationSeconds = status.durationMillis
        ? (status.durationMillis / 1000).toFixed(2)
        : '0.00';

      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();

      setRecording(null);
      setIsListening(false);
      setRecordedVoiceUri(uri);
      setRecordedDuration(durationSeconds);

      console.log('YES/NO RECORDING URI:', uri);
      console.log('YES/NO RECORDING DURATION:', durationSeconds);

      if (!uri) {
        setVoiceStatusText('Tap to Answer');
        Alert.alert('Voice Error', 'No recording was saved.');
        return;
      }

      setVoiceStatusText('Checking answer...');
      await resolveRecordedYesNo(uri);
    } catch (error) {
      console.log('Stop yes/no recording error:', error);

      setRecording(null);
      setIsListening(false);
      setCheckingVoice(false);
      setVoiceStatusText('Tap to Answer');

      Alert.alert('Voice Error', 'Could not stop recording.');
    }
  }

  async function resolveRecordedYesNo(uri) {
    try {
      setCheckingVoice(true);

      const audioBase64 = await readAudioFileAsBase64(String(uri));

      console.log('YES/NO BASE64 LENGTH:', audioBase64?.length);

      const data = await resolveAnswerAudio(
        audioBase64,
        'does_it_match',
        lang || 'en'
      );

      console.log('YES/NO RAW BACKEND RESPONSE:', JSON.stringify(data, null, 2));

      const spokenText = String(
        data?.answer_text ||
          data?.answer ||
          data?.transcript ||
          data?.text ||
          data?.recognized_text ||
          data?.speech_text ||
          ''
      ).toLowerCase();

      console.log('YES/NO SPOKEN TEXT:', spokenText);

      const isYes =
        spokenText.includes('yes') ||
        spokenText.includes('yeah') ||
        spokenText.includes('correct') ||
        spokenText.includes('right') ||
        spokenText.includes('match') ||
        spokenText.includes('yuwa') ||
        spokenText.includes('yuwayi');

      const isNo =
        spokenText.includes('no') ||
        spokenText.includes('nope') ||
        spokenText.includes('wrong') ||
        spokenText.includes('not') ||
        spokenText.includes('kula');

      console.log('YES/NO MATCH RESULT:', {
        isYes,
        isNo,
        spokenText,
      });

      if (isYes) {
        setSelectedVoiceAnswer('yes');
        setVoiceStatusText('Voice matched: YES');

        setTimeout(() => {
          handleYesPress();
        }, 800);

        return;
      }

      if (isNo) {
        setSelectedVoiceAnswer('no');
        setVoiceStatusText('Voice matched: NO');

        setTimeout(() => {
          handleNoPress();
        }, 800);

        return;
      }

      setSelectedVoiceAnswer(null);
      setVoiceStatusText('Voice not matched');

      Alert.alert(
        'Voice not recognised',
        `Detected text: ${spokenText || 'empty'}`
      );

      setTimeout(() => {
        setVoiceStatusText('Tap to Answer');
      }, 1500);
    } catch (error) {
      console.log('Resolve yes/no voice error:', error);

      setSelectedVoiceAnswer(null);
      setVoiceStatusText('Voice not matched');

      Alert.alert('Voice Error', 'Could not recognise your answer.');

      setTimeout(() => {
        setVoiceStatusText('Tap to Answer');
      }, 1500);
    } finally {
      setCheckingVoice(false);
    }
  }

  async function playRecordedVoiceAnswer() {
    try {
      if (!recordedVoiceUri) {
        Alert.alert('No recording', 'Please record your answer first.');
        return;
      }

      await stopCurrentAudio();

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: recordedVoiceUri },
        { shouldPlay: true, volume: 1.0 }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          if (soundRef.current === sound) {
            soundRef.current = null;
          }

          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Play recorded answer error:', error);
      Alert.alert('Audio Error', 'Could not play recorded answer.');
    }
  }

  async function deleteRecordedVoiceAnswer() {
    await stopCurrentAudio();

    setRecordedVoiceUri(null);
    setRecordedDuration('0.00');
    setSelectedVoiceAnswer(null);
    setVoiceStatusText('Tap to Answer');

    console.log('Deleted recorded Yes/No answer');
  }

  async function handleYesPress() {
    if (loading) return;

    if (symptomsEn.length === 0 && symptomsWp.length === 0) {
      setErrorModalVisible(true);
      return;
    }

    setSelectedVoiceAnswer('yes');
    setLoading(true);

    await stopCurrentAudio();

    router.push({
      pathname: '/tellusmorevoice',
      params: {
        symptoms_en: toJsonParam(symptomsEn),
        symptoms_wp: toJsonParam(symptomsWp),
        language: lang,
        source: 'voice',
      },
    });
  }

  async function handleNoPress() {
    setSelectedVoiceAnswer('no');

    await stopCurrentAudio();

    router.replace('/voiceinput');
  }

  async function beforeLanguageChange() {
    await stopCurrentAudio();
  }

  async function afterLanguageChange(selectedLang) {
    try {
      setAudioLoading(true);
      await stopCurrentAudio();
      await getAudioFileForLanguage(selectedLang);
    } catch (error) {
      console.log('Detected voice language update error:', error);
    } finally {
      setAudioLoading(false);
    }
  }

  return (
    <AppScreen
      languageLabel={audioLoading ? 'Updating...' : undefined}
      languageModalDisabled={audioLoading}
      beforeLanguageChange={beforeLanguageChange}
      afterLanguageChange={afterLanguageChange}
      onHomePress={async () => {
        await stopCurrentAudio();
        router.replace('/input');
      }}
    >
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>{t('detected_title')}</Text>
        </View>

        <View style={styles.symptomBox}>
          <Text style={styles.symptomText}>{symptomText}</Text>

          <Pressable
            style={({ pressed }) => [
              styles.speakerButton,
              pressed && styles.speakerPressed,
            ]}
            onPress={playVoiceAudio}
          >
            <Image
              source={require('../../assets/images/speaker.png')}
              style={styles.speakerIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        <Text style={styles.questionText}>{t('detected_question')}</Text>

        <View style={styles.voiceAnswerRow}>
          <Pressable
            style={[
              styles.voiceYesNoButton,
              selectedVoiceAnswer === 'yes' && styles.voiceAnswerSelected,
            ]}
            onPress={handleYesPress}
          >
            <Text
              style={[
                styles.voiceYesNoText,
                selectedVoiceAnswer === 'yes' &&
                  styles.voiceAnswerSelectedText,
              ]}
            >
              {t('yes')}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.voiceYesNoButton,
              selectedVoiceAnswer === 'no' && styles.voiceAnswerSelected,
            ]}
            onPress={handleNoPress}
          >
            <Text
              style={[
                styles.voiceYesNoText,
                selectedVoiceAnswer === 'no' &&
                  styles.voiceAnswerSelectedText,
              ]}
            >
              {t('no')}
            </Text>
          </Pressable>

          <View style={styles.voiceMicWrapper}>
            <Pressable
              style={[
                styles.detectedMicButton,
                isListening && styles.detectedMicRecording,
              ]}
              onPress={handleVoiceAnswerPress}
            >
              <Image
                source={require('../../assets/images/microphone.png')}
                style={styles.detectedMicIcon}
                resizeMode="contain"
              />
            </Pressable>

            <Text style={styles.tapToAnswerText}>{voiceStatusText}</Text>

            {recordedVoiceUri && (
              <View style={styles.detectedRecordedBox}>
                <Pressable
                  style={styles.detectedPlayButton}
                  onPress={playRecordedVoiceAnswer}
                >
                  <Ionicons name="play" size={17} color="#000" />
                </Pressable>

                <Text style={styles.detectedDurationText}>
                  {recordedDuration}
                </Text>

                <Pressable
                  style={styles.detectedDeleteButton}
                  onPress={deleteRecordedVoiceAnswer}
                >
                  <Ionicons name="trash" size={17} color="#000" />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backPressedGrey,
          ]}
          onPress={async () => {
            await stopCurrentAudio();
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

      <Modal transparent visible={errorModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalBox}>
            <View style={styles.errorHeader}>
              <Text style={styles.errorTitle}>No Symptoms Detected</Text>

              <Pressable
                onPress={() => setErrorModalVisible(false)}
                style={styles.errorCloseButton}
              >
                <Text style={styles.errorCloseText}>×</Text>
              </Pressable>
            </View>

            <View style={styles.errorBody}>
              <Text style={styles.errorMessageBold}>
                We could not detect any symptoms from your voice.
              </Text>

              <Text style={styles.errorMessage}>
                Please try speaking your symptoms in more detail.
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.errorOkButton,
                  pressed && styles.errorOkButtonPressed,
                ]}
                onPress={() => setErrorModalVisible(false)}
              >
                <Text style={styles.errorOkText}>Ok</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}