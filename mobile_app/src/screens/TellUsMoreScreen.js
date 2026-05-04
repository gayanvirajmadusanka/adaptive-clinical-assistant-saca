import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
  Image,
  Modal,
  Animated,
  Alert,
  BackHandler
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/tellUsMoreStyles';

const API_URL = 'http://192.168.1.106:8000';

export default function TellUsMoreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang, setLang } = useLanguage();

  const symptomsEn = params.symptoms_en ? JSON.parse(params.symptoms_en) : [];

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [audioLoading, setAudioLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const soundRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length || 6;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const fetchQuestions = async (languageCode) => {
    try {
      setLoadingQuestions(true);

      const response = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomsEn,
          language: languageCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to load questions');
      }

      const data = await response.json();

      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setAnswers({});
      setSelectedOption(null);
    } catch (error) {
      console.log('Questions API error:', error);
      Alert.alert('Error', 'Could not load questions.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchQuestions(lang || 'en');
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
    } catch (error) {
      console.log('Stop audio error:', error);
    }
  };

  const playQuestionAudio = async () => {
    try {
      if (!currentQuestion?.voice_b64) {
        Alert.alert('Audio Error', 'No audio available.');
        return;
      }

      if (audioLoading) return;

      setAudioLoading(true);

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      await stopCurrentAudio();

      const cleaned = currentQuestion.voice_b64.replace(
        /^data:audio\/\w+;base64,/,
        ''
      );

      const fileUri =
        FileSystem.cacheDirectory + `question_${currentQuestion.id}.wav`;

      await FileSystem.writeAsStringAsync(fileUri, cleaned, {
        encoding: 'base64',
      });

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
      console.log('Audio error:', error);
      Alert.alert('Audio Error', 'Cannot play audio.');
    } finally {
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        const sound = soundRef.current;
        soundRef.current = null;

        sound
          .getStatusAsync()
          .then((status) => {
            if (status.isLoaded) {
              sound.stopAsync();
              sound.unloadAsync();
            }
          })
          .catch((error) => {
            console.log('Cleanup audio error:', error);
          });
      }
    };
  }, []);

  const handleOptionPress = (option) => {
    setSelectedOption(option.id);
  };

  const handleContinue = async () => {
    if (!selectedOption) {
      Alert.alert('Select answer', 'Please select one option.');
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

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      const finalAnswers = Object.values(updatedAnswers).map((item) => ({
        question_id: item.question_id,
        answer_id: item.answer_id,
      }));

      router.push({
        pathname: '/loadingseverity',
        params: {
          symptoms_en: JSON.stringify(symptomsEn),
          symptoms_wp: params.symptoms_wp || JSON.stringify([]),
          answers: JSON.stringify(finalAnswers),
          language: params.language || lang || 'en',
        },
      });
    }
  };

  const handleBack = async () => {
    await stopCurrentAudio();

    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      const previousQuestion = questions[previousIndex];
      const previousAnswer = answers[previousQuestion.id];

      setCurrentIndex(previousIndex);
      setSelectedOption(previousAnswer?.answer_id || null);
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
}, [currentIndex, questions, answers]);

  const openModal = () => {
    setSelectedLang(null);
    setModalVisible(true);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 120,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const confirmLanguage = async () => {
    if (!selectedLang) return;

    await stopCurrentAudio();

    setLang(selectedLang);
    closeModal();

    await fetchQuestions(selectedLang);
  };

  if (loadingQuestions) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />

        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading questions...</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

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
            <View style={styles.headerBar}>
              <Pressable onPress={handleBack} style={styles.backCircle}>
                <Text style={styles.backArrow}>←</Text>
              </Pressable>

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

            <View style={styles.questionBox}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionText}>
                  {currentQuestion?.text}
                </Text>

                <Pressable
                  style={styles.speakerButton}
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
                        styles.optionItem,
                        index === 1 && styles.optionLight,
                        index === 2 && styles.optionMedium,
                        index === 3 && styles.optionDark,
                        isSelected && styles.optionSelected,
                      ]}
                      onPress={() => handleOptionPress(option)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        • {option.text}
                      </Text>
                    </Pressable>
                  );
                })}
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
          </View>

          <View style={styles.footer}>
            <Pressable
              style={styles.footerItem}
              onPress={async () => {
                await stopCurrentAudio();
                router.replace('/input');
              }}
            >
              <Text style={styles.footerIcon}>🏠</Text>
              <Text style={styles.footerText}>{t('home')}</Text>
            </Pressable>

            <Pressable style={styles.footerItem} onPress={openModal}>
              <Text style={styles.footerIcon}>🌐</Text>
              <Text style={styles.footerText}>{t('language')}</Text>
            </Pressable>
          </View>

          <Modal transparent visible={modalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <Animated.View
                style={[
                  styles.languageModal,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                <Text style={styles.modalTitle}>{t('select_language')}</Text>

                <Pressable
                  style={[
                    styles.languageOption,
                    selectedLang === 'en' && styles.languageOptionSelected,
                  ]}
                  onPress={() => setSelectedLang('en')}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      selectedLang === 'en' &&
                        styles.languageOptionTextSelected,
                    ]}
                  >
                    {t('english')}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.languageOption,
                    selectedLang === 'wp' && styles.languageOptionSelected,
                  ]}
                  onPress={() => setSelectedLang('wp')}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      selectedLang === 'wp' &&
                        styles.languageOptionTextSelected,
                    ]}
                  >
                    {t('warlpiri')}
                  </Text>
                </Pressable>

                <Text style={styles.confirmText}>{t('change_language')}</Text>

                <View style={styles.modalButtonRow}>
                  <Pressable style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.cancelText}>{t('no')}</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.confirmButton,
                      !selectedLang && styles.disabledButton,
                    ]}
                    disabled={!selectedLang}
                    onPress={confirmLanguage}
                  >
                    <Text style={styles.confirmButtonText}>{t('yes')}</Text>
                  </Pressable>
                </View>
              </Animated.View>
            </View>
          </Modal>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}