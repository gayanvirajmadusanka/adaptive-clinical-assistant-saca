// TellUsMoreScreen.js
// Purpose: Loads follow-up questions from FastAPI after detected symptoms.
// Shows one question at a time, collects answers, then sends user to severity loading screen.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
  Modal,
  Animated,
  Alert,
  BackHandler,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';

import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/tellUsMoreStyles';

import { getFollowUpQuestions } from '../services/triageApi';
import { saveBase64AudioToCache } from '../utils/base64Audio';
import { parseJsonParam } from '../utils/routeParams';
import { buildAnswerList } from '../utils/triagePayloads';

export default function TellUsMoreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang, setLang } = useLanguage();

  const symptomsEn = parseJsonParam(params.symptoms_en, []);
  const symptomsWp = parseJsonParam(params.symptoms_wp, []);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const soundRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length || 1;

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
    } catch (error) {
      console.log('Follow-up question error:', error);
      Alert.alert('Error', 'Could not load follow-up questions.');
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

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          if (soundRef.current === sound) {
            soundRef.current = null;
          }

          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Question audio error:', error);
      Alert.alert('Audio Error', 'Cannot play audio.');
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
      const finalAnswers = buildAnswerList(updatedAnswers);

      router.push({
        pathname: '/loadingseverity',
        params: {
          symptoms_en: JSON.stringify(symptomsEn),
          symptoms_wp: JSON.stringify(symptomsWp),
          answers: JSON.stringify(finalAnswers),
          language: params.language || lang || 'en',
          source: params.source || 'text',
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

        <View style={styles.wrapper}>
          <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
          >
            <View style={styles.container}>
              <View style={styles.headerBar}>
                <Text style={styles.headerText}>Tell us more</Text>
              </View>

              <Text style={styles.progressText}>Loading questions...</Text>

              <View style={styles.questionBox}>
                <Text style={styles.questionText}>Please wait...</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Pressable
                style={styles.footerItem}
                onPress={() => router.replace('/input')}
              >
                <Text style={styles.footerIcon}>🏠</Text>
                <Text style={styles.footerText}>{t('home')}</Text>
              </Pressable>

              <Pressable style={styles.footerItem} onPress={openModal}>
                <Text style={styles.footerIcon}>🌐</Text>
                <Text style={styles.footerText}>{t('language')}</Text>
              </Pressable>
            </View>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
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
                <Text style={styles.headerText}>Tell us more</Text>
              </View>

              <View style={styles.questionBox}>
                <Text style={styles.questionText}>
                  No follow-up questions found.
                </Text>
              </View>

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

            <View style={styles.footer}>
              <Pressable
                style={styles.footerItem}
                onPress={() => router.replace('/input')}
              >
                <Text style={styles.footerIcon}>🏠</Text>
                <Text style={styles.footerText}>{t('home')}</Text>
              </Pressable>

              <Pressable style={styles.footerItem} onPress={openModal}>
                <Text style={styles.footerIcon}>🌐</Text>
                <Text style={styles.footerText}>{t('language')}</Text>
              </Pressable>
            </View>
          </ImageBackground>
        </View>
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
            {/* HEADER */}
            <View style={styles.headerBar}>
              <Text style={styles.headerText}>Tell us more</Text>
            </View>

            {/* QUESTION COUNT */}
            <Text style={styles.progressText}>
              Question {currentIndex + 1} of {totalQuestions}
            </Text>

            {/* PROGRESS BAR */}
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                  },
                ]}
              />
            </View>

            {/* QUESTION BOX */}
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>{currentQuestion.text}</Text>

              <Pressable
                style={({ pressed }) => [
                  styles.speakerButton,
                  pressed && styles.speakerPressed,
                ]}
                onPress={playQuestionAudio}
              >
                <Image
                  source={require('../../assets/images/speaker.png')}
                  style={styles.speakerIcon}
                  resizeMode="contain"
                />
              </Pressable>

              {currentQuestion.options?.map((option, index) => {
                const isSelected = selectedOption === option.id;

                return (
                  <Pressable
                    key={option.id || index}
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
            </View>

            {/* CONTINUE BUTTON */}
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

            {/* BACK BUTTON */}
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

          {/* FOOTER */}
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

          {/* LANGUAGE MODAL */}
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
                  <Pressable
                    style={({ pressed }) => [
                      styles.cancelButton,
                      pressed && styles.modalButtonPressed,
                    ]}
                    onPress={closeModal}
                  >
                    <Text style={styles.cancelText}>{t('no')}</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.confirmButton,
                      pressed && styles.modalButtonPressed,
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