// TellUsMoreVoiceScreen.js
// Purpose: Voice version of Tell Us More.
// AppScreen handles SafeArea, background, footer, and language modal.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Animated,
  Alert,
  BackHandler,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/tellUsMoreVoiceStyles';

import {
  getFollowUpQuestions,
  resolveAnswerAudio,
} from '../services/triageApi';

import {
  saveBase64AudioToCache,
  readAudioFileAsBase64,
} from '../utils/base64Audio';

import { parseJsonParam } from '../utils/routeParams';
import { buildAnswerList } from '../utils/triagePayloads';
import { WAV_RECORDING_OPTIONS } from '../utils/audioRecordingOptions';

export default function TellUsMoreVoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang } = useLanguage();

  const symptomsEn = parseJsonParam(params.symptoms_en, []);
  const symptomsWp = parseJsonParam(params.symptoms_wp, []);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const [audioLoading, setAudioLoading] = useState(false);
  const [questionAudioPlaying, setQuestionAudioPlaying] = useState(false);

  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [recordedSound, setRecordedSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [recordDuration, setRecordDuration] = useState('0.00');
  const [resolvingVoice, setResolvingVoice] = useState(false);
  const [voiceAnswerMap, setVoiceAnswerMap] = useState({});

  const soundRef = useRef(null);
  const timerRef = useRef(null);
  const secondsRef = useRef(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bar1 = useRef(new Animated.Value(14)).current;
  const bar2 = useRef(new Animated.Value(28)).current;
  const bar3 = useRef(new Animated.Value(18)).current;
  const bar4 = useRef(new Animated.Value(34)).current;
  const bar5 = useRef(new Animated.Value(20)).current;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length || 1;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const optionCount = currentQuestion?.options?.length || 0;
  const isTwoOptionQuestion = optionCount === 2;

  const multiOptionColors = [
    styles.optionColor1,
    styles.optionColor2,
    styles.optionColor3,
    styles.optionColor4,
    styles.optionColor5,
  ];

  async function fetchQuestions(languageCode) {
    try {
      setLoadingQuestions(true);

      const data = await getFollowUpQuestions(symptomsEn, languageCode);

      const backendQuestions = Array.isArray(data)
        ? data
        : data?.questions || [];

      setQuestions(backendQuestions);
      setCurrentIndex(0);
      setAnswers({});
      setSelectedOption(null);
      setVoiceAnswerMap({});
      await resetVoiceAnswer();
    } catch (error) {
      console.log('Questions API error:', error);
      Alert.alert('Error', 'Could not load questions.');
    } finally {
      setLoadingQuestions(false);
    }
  }

  useEffect(() => {
    fetchQuestions(lang || params.language || 'en');
  }, []);

  const stopCurrentAudio = async () => {
    try {
      if (soundRef.current) {
        const sound = soundRef.current;
        soundRef.current = null;

        const status = await sound.getStatusAsync();

        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      }

      setQuestionAudioPlaying(false);
    } catch (error) {
      console.log('Stop audio error:', error);
      setQuestionAudioPlaying(false);
    }
  };

  const playQuestionAudio = async () => {
    try {
      if (!currentQuestion?.voice_b64) return;

      if (questionAudioPlaying) {
        await stopCurrentAudio();
        return;
      }

      if (audioLoading) return;

      setAudioLoading(true);

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      await stopCurrentAudio();

      const fileUri = await saveBase64AudioToCache(
        currentQuestion.voice_b64,
        `question_${currentQuestion.id}.wav`
      );

      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true, volume: 1.0 }
      );

      soundRef.current = sound;
      setQuestionAudioPlaying(true);

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          if (soundRef.current === sound) {
            soundRef.current = null;
          }

          setQuestionAudioPlaying(false);
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Question audio error:', error);
      setQuestionAudioPlaying(false);
      Alert.alert('Audio Error', 'Cannot play audio.');
    } finally {
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    if (!currentQuestion?.id || !currentQuestion?.voice_b64) return;

    const timer = setTimeout(() => {
      playQuestionAudio();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentQuestion?.id]);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 550,
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
    setRecordDuration('0.00');

    timerRef.current = setInterval(() => {
      secondsRef.current += 0.1;
      setRecordDuration(secondsRef.current.toFixed(2));
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
        await stopVoiceRecording();
      } else {
        await startVoiceRecording();
      }
    } catch (error) {
      console.log('Voice answer recording error:', error);
      Alert.alert('Recording error', 'Could not record your voice answer.');
    }
  };

  const startVoiceRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        'Please allow microphone permission to record your answer.'
      );
      return;
    }

    await stopCurrentAudio();

    if (recordedSound) {
      await recordedSound.unloadAsync();
      setRecordedSound(null);
    }

    setRecordingUri(null);
    setIsPlayingVoice(false);
    setResolvingVoice(false);

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

  const stopVoiceRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    const duration = secondsRef.current.toFixed(2);

    if (!uri) {
      Alert.alert('Recording error', 'Audio file was not saved.');
      return;
    }

    setRecordingUri(uri);
    setRecording(null);
    setIsRecording(false);
    setRecordDuration(duration);

    stopPulse();
    stopBars();
    stopTimer();

    if (currentQuestion?.id) {
      setVoiceAnswerMap((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          uri,
          duration,
        },
      }));
    }

    setTimeout(() => {
      resolveRecordedAnswer(uri, currentQuestion?.id);
    }, 1000);
  };

  const resolveRecordedAnswer = async (uri, questionId) => {
    try {
      if (!uri || !questionId) return;

      setResolvingVoice(true);

      const audioBase64 = await readAudioFileAsBase64(String(uri));

      const data = await resolveAnswerAudio(
        audioBase64,
        questionId,
        lang || 'en'
      );

      if (data?.recognized && data?.answer_id) {
        setSelectedOption(data.answer_id);

        setAnswers((prev) => ({
          ...prev,
          [questionId]: {
            question_id: questionId,
            answer_id: data.answer_id,
            answer_text:
              currentQuestion?.options?.find(
                (item) => item.id === data.answer_id
              )?.text || '',
          },
        }));
      } else {
        Alert.alert(
          'Voice not recognised',
          data?.message || 'Please select the answer manually.'
        );
      }
    } catch (error) {
      console.log('Resolve answer audio error:', error);

      Alert.alert(
        'Voice answer error',
        'Could not check your voice answer. Please select manually.'
      );
    } finally {
      setResolvingVoice(false);
    }
  };

  const handlePlayVoice = async () => {
    try {
      if (!recordingUri) return;

      if (recordedSound && isPlayingVoice) {
        await recordedSound.stopAsync();
        setIsPlayingVoice(false);
        return;
      }

      if (recordedSound) {
        await recordedSound.unloadAsync();
        setRecordedSound(null);
      }

      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });

      setRecordedSound(sound);
      setIsPlayingVoice(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlayingVoice(false);
          sound.unloadAsync();
          setRecordedSound(null);
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.log('Voice answer playback error:', error);
      Alert.alert('Playback error', 'Could not play your voice answer.');
    }
  };

  const handleDeleteVoice = async () => {
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
      setIsRecording(false);
      setIsPlayingVoice(false);
      setRecordDuration('0.00');
      setResolvingVoice(false);

      stopPulse();
      stopBars();
      stopTimer();

      if (currentQuestion?.id) {
        setVoiceAnswerMap((prev) => {
          const copy = { ...prev };
          delete copy[currentQuestion.id];
          return copy;
        });
      }
    } catch (error) {
      console.log('Delete voice answer error:', error);
    }
  };

  const resetVoiceAnswer = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
      }

      if (recordedSound) {
        await recordedSound.unloadAsync();
      }
    } catch (error) {
      console.log('Reset voice answer error:', error);
    }

    setRecording(null);
    setRecordedSound(null);
    setRecordingUri(null);
    setIsRecording(false);
    setIsPlayingVoice(false);
    setRecordDuration('0.00');
    setResolvingVoice(false);

    stopPulse();
    stopBars();
    stopTimer();
  };

  const restoreVoiceForQuestion = (questionId) => {
    const savedVoice = voiceAnswerMap[questionId];

    if (savedVoice) {
      setRecordingUri(savedVoice.uri);
      setRecordDuration(savedVoice.duration || '0.00');
    } else {
      setRecordingUri(null);
      setRecordDuration('0.00');
    }

    setIsRecording(false);
    setIsPlayingVoice(false);
    setResolvingVoice(false);
  };

  const handleOptionPress = (option) => {
    setSelectedOption(option.id);

    if (currentQuestion?.id) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          question_id: currentQuestion.id,
          answer_id: option.id,
          answer_text: option.text,
        },
      }));
    }
  };

  const handleContinue = async () => {
    if (!selectedOption) {
      Alert.alert('Select answer', 'Please select or speak one answer.');
      return;
    }

    const selected = currentQuestion.options.find(
      (item) => item.id === selectedOption
    );

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: {
        question_id: currentQuestion.id,
        answer_id: selected.id,
        answer_text: selected.text,
      },
    };

    setAnswers(updatedAnswers);
    await stopCurrentAudio();

    if (recordedSound) {
      await recordedSound.unloadAsync();
      setRecordedSound(null);
      setIsPlayingVoice(false);
    }

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextQuestion = questions[nextIndex];

      setCurrentIndex(nextIndex);
      setSelectedOption(updatedAnswers[nextQuestion.id]?.answer_id || null);
      restoreVoiceForQuestion(nextQuestion.id);
    } else {
      const finalAnswers = buildAnswerList(updatedAnswers);

      router.push({
        pathname: '/loadingseverity',
        params: {
          symptoms_en: JSON.stringify(symptomsEn),
          symptoms_wp: JSON.stringify(symptomsWp),
          answers: JSON.stringify(finalAnswers),
          language: lang || params.language || 'en',
          source: 'voice',
        },
      });
    }
  };

  const handleBack = async () => {
    await stopCurrentAudio();

    if (recordedSound) {
      await recordedSound.unloadAsync();
      setRecordedSound(null);
      setIsPlayingVoice(false);
    }

    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      const previousQuestion = questions[previousIndex];
      const previousAnswer = answers[previousQuestion.id];

      setCurrentIndex(previousIndex);
      setSelectedOption(previousAnswer?.answer_id || null);
      restoreVoiceForQuestion(previousQuestion.id);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    const backAction = () => {
      handleBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [currentIndex, questions, answers, voiceAnswerMap]);

  useEffect(() => {
    return () => {
      stopCurrentAudio();
      resetVoiceAnswer();
    };
  }, []);

  const beforeLanguageChange = async () => {
    await stopCurrentAudio();
    await resetVoiceAnswer();
  };

  const afterLanguageChange = async (selectedLang) => {
    await fetchQuestions(selectedLang);
  };

  if (loadingQuestions) {
    return (
      <AppScreen
        beforeLanguageChange={beforeLanguageChange}
        afterLanguageChange={afterLanguageChange}
        onHomePress={async () => {
          await stopCurrentAudio();
          await resetVoiceAnswer();
          router.replace('/input');
        }}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen
      beforeLanguageChange={beforeLanguageChange}
      afterLanguageChange={afterLanguageChange}
      onHomePress={async () => {
        await stopCurrentAudio();
        await resetVoiceAnswer();
        router.replace('/input');
      }}
    >
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>Tell us more</Text>
        </View>

        <Text style={styles.questionNumber}>
          Question {currentIndex + 1} of {totalQuestions}
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>

        <View style={styles.contentRow}>
          <View style={styles.questionBox}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionText}>{currentQuestion?.text}</Text>

              <Pressable
                style={({ pressed }) => [
                  styles.speakerButton,
                  pressed && styles.speakerPressed,
                ]}
                onPress={playQuestionAudio}
                disabled={audioLoading}
              >
                <Image
                  source={require('../../assets/images/speaker.png')}
                  style={styles.speakerIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            <View style={styles.optionsWrapper}>
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = selectedOption === option.id;

                return (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.optionButton,
                      isTwoOptionQuestion
                        ? styles.twoOptionStyle
                        : multiOptionColors[index],
                      isSelected && styles.selectedOption,
                    ]}
                    onPress={() => handleOptionPress(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      • {option.text}
                    </Text>
                  </Pressable>
                );
              })}

              {recordingUri && (
                <View style={styles.voiceRecordedBox}>
                  <Text style={styles.voiceRecordedText}>
                    {resolvingVoice
                      ? 'Checking voice answer...'
                      : 'Voice answer recorded'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.voiceBox}>
            <Text style={styles.voiceTitle}>Speak your answer</Text>

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

            {isRecording && (
              <View style={styles.waveformContainer}>
                <Animated.View style={[styles.waveBar, { height: bar1 }]} />
                <Animated.View style={[styles.waveBar, { height: bar2 }]} />
                <Animated.View style={[styles.waveBar, { height: bar3 }]} />
                <Animated.View style={[styles.waveBar, { height: bar4 }]} />
                <Animated.View style={[styles.waveBar, { height: bar5 }]} />
              </View>
            )}

            <Text style={styles.voiceHint}>
              {isRecording
                ? 'Recording... tap mic to stop'
                : 'Click on mic to record voice'}
            </Text>

            {recordingUri && (
              <View style={styles.voicePlaybackBar}>
                <Pressable
                  onPress={handlePlayVoice}
                  style={styles.voicePlayButton}
                >
                  <Ionicons
                    name={isPlayingVoice ? 'stop' : 'play'}
                    size={28}
                    color="#000"
                  />
                </Pressable>

                <Text style={styles.voiceDurationText}>{recordDuration}</Text>

                <Pressable
                  onPress={handleDeleteVoice}
                  style={styles.voiceDeleteButton}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={23}
                    color="#000"
                  />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continuePressed,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>
            {currentIndex === questions.length - 1 ? 'Submit' : 'Continue'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backPressedGrey,
          ]}
          onPress={handleBack}
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