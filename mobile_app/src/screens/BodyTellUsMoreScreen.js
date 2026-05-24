// BodyTellUsMoreScreen.js
// Purpose: Body follow-up questions using backend option IDs, option images,
// speaker audio, same option layout for all questions, pain question special layout,
// and custom alert modal.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Alert,
  Animated,
  BackHandler,
  Modal,
  ImageBackground,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import { getFollowUpQuestions } from '../services/triageApi';
import { parseJsonParam } from '../utils/routeParams';
import { saveBase64AudioToCache } from '../utils/base64Audio';

import styles from '../styles/bodyTellUsMoreStyles';

const SPEAKER_ICON = require('../../assets/images/speaker.png');

const OPTION_IMAGES = {
  male: require('../../assets/images/male_image.png'),
  female: require('../../assets/images/female_image.png'),

  child_male: require('../../assets/images/Age_Group/child_male.png'),
  child_female: require('../../assets/images/Age_Group/child_female.png'),
  youth_male: require('../../assets/images/Age_Group/youth_male.png'),
  youth_female: require('../../assets/images/Age_Group/youth_female.png'),
  adult_male: require('../../assets/images/Age_Group/adult_male.png'),
  adult_female: require('../../assets/images/Age_Group/adult_female.png'),
  elder_male: require('../../assets/images/Age_Group/elder_male.png'),
  elder_female: require('../../assets/images/Age_Group/elder_female.png'),

  today: require('../../assets/images/Duration/today.png'),
  yesterday: require('../../assets/images/Duration/yesterday.png'),
  two_three_days: require('../../assets/images/Duration/2_3_days.png'),
  about_week: require('../../assets/images/Duration/about_a_week.png'),
  more_week: require('../../assets/images/Duration/more_than_a_week.png'),

  pain_none: require('../../assets/images/Pain_Level/none.png'),
  pain_little: require('../../assets/images/Pain_Level/a_little.png'),
  pain_moderate: require('../../assets/images/Pain_Level/moderate.png'),
  pain_very_bad: require('../../assets/images/Pain_Level/very_bad.png'),
  pain_unbearable: require('../../assets/images/Pain_Level/unbearable.png'),

  yes: require('../../assets/images/yes_icon.png'),
  no: require('../../assets/images/no_icon.png'),
};

const OPTION_CONFIG = {
  // Gender
  '0a1': { gender: 'male', image: 'male' },
  '0a2': { gender: 'female', image: 'female' },

  // Age
  '0b1': { imageMale: 'child_male', imageFemale: 'child_female' },
  '0b2': { imageMale: 'youth_male', imageFemale: 'youth_female' },
  '0b3': { imageMale: 'adult_male', imageFemale: 'adult_female' },
  '0b4': { imageMale: 'elder_male', imageFemale: 'elder_female' },

  // Duration
  '1a': { image: 'today' },
  '1b': { image: 'yesterday' },
  '1c': { image: 'two_three_days' },
  '1d': { image: 'about_week' },
  '1e': { image: 'more_week' },

  // Pain
  '2a': { image: 'pain_none' },
  '2b': { image: 'pain_little' },
  '2c': { image: 'pain_moderate' },
  '2d': { image: 'pain_very_bad' },
  '2e': { image: 'pain_unbearable' },
};

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function getOptionText(option) {
  return (
    option?.text ||
    option?.label ||
    option?.answer_text ||
    option?.value ||
    String(option?.id || '')
  );
}

function getOptionId(option) {
  return String(option?.id || getOptionText(option));
}

function isYesOption(option) {
  const text = normalizeText(getOptionText(option));
  const id = normalizeText(getOptionId(option));

  return (
    id === 'yes' ||
    text === 'yes' ||
    text === 'yuwai' ||
    text === 'yuwayi'
  );
}

function getOptionImage(option, question, selectedGender) {
  if (question?.type === 'yes_no') {
    return isYesOption(option) ? OPTION_IMAGES.yes : OPTION_IMAGES.no;
  }

  const config = OPTION_CONFIG[getOptionId(option)];

  if (!config) {
    return null;
  }

  if (config.imageMale || config.imageFemale) {
    const imageKey =
      selectedGender === 'female'
        ? config.imageFemale
        : config.imageMale;

    return OPTION_IMAGES[imageKey];
  }

  return OPTION_IMAGES[config.image];
}

function checkPainQuestion(question) {
  const id = String(question?.id || '');
  const type = String(question?.question_type || question?.type || '').toLowerCase();
  const text = String(question?.text || '').toLowerCase();

  return (
    id === '2' ||
    id === '4' ||
    type.includes('pain') ||
    text.includes('how bad is your pain') ||
    text.includes('pain')
  );
}

export default function BodyTellUsMoreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang } = useLanguage();

  const symptomsEn = parseJsonParam(params.symptoms_en, []);
  const symptomsWp = parseJsonParam(params.symptoms_wp, []);

  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedGender, setSelectedGender] = useState(params.gender || 'male');
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const soundRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length || 1;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

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
      console.log('Stop body tell us more audio error:', error);
    }
  }

  async function playQuestionAudio() {
    try {
      if (!currentQuestion?.voice_b64) {
        Alert.alert('Audio Error', 'No audio available.');
        return;
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      await stopCurrentAudio();

      const fileUri = await saveBase64AudioToCache(
        currentQuestion.voice_b64,
        `body_question_${currentQuestion.id}.wav`
      );

      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true, volume: 1.0 }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          try {
            if (soundRef.current === sound) {
              soundRef.current = null;
            }

            await sound.unloadAsync();
          } catch (error) {
            console.log('Finished body question audio unload error:', error);
          }
        }
      });
    } catch (error) {
      console.log('Body question audio error:', error);
      Alert.alert('Audio Error', 'Cannot play audio.');
    }
  }

  async function fetchQuestions(languageCode = lang || params.language || 'en') {
    try {
      setLoadingQuestions(true);
      await stopCurrentAudio();

      const data = await getFollowUpQuestions(symptomsEn, languageCode);

      const backendQuestions = Array.isArray(data)
        ? data
        : data?.questions || [];

      setQuestions(backendQuestions);
      setCurrentIndex(0);
      setAnswers({});
      setSelectedOption(null);
    } catch (error) {
      console.log('Body questions API error:', error);
      Alert.alert('Error', 'Could not load follow-up questions.');
    } finally {
      setLoadingQuestions(false);
    }
  }

  useEffect(() => {
    fetchQuestions();

    return () => {
      stopCurrentAudio();
    };
  }, []);

  const animateQuestionChange = () => {
    fadeAnim.setValue(0.4);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const handleOptionPress = (option) => {
    const optionId = getOptionId(option);
    const config = OPTION_CONFIG[optionId];

    setSelectedOption(optionId);

    if (config?.gender) {
      setSelectedGender(config.gender);
    }
  };

  const handleContinue = async () => {
    if (!currentQuestion) {
      Alert.alert('Error', 'No question found.');
      return;
    }

    if (!selectedOption) {
      setErrorModalVisible(true);
      return;
    }

    const selected = currentQuestion.options.find(
      (item) => getOptionId(item) === selectedOption
    );

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: {
        question_id: currentQuestion.id,
        answer_id: getOptionId(selected),
        answer_text: getOptionText(selected),
      },
    };

    setAnswers(updatedAnswers);
    await stopCurrentAudio();

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextQuestion = questions[nextIndex];

      setCurrentIndex(nextIndex);
      setSelectedOption(updatedAnswers[nextQuestion?.id]?.answer_id || null);
      animateQuestionChange();
      return;
    }

    const finalAnswers = Object.values(updatedAnswers);

    router.push({
      pathname: '/loadingseverity',
      params: {
        symptoms_en: JSON.stringify(symptomsEn),
        symptoms_wp: JSON.stringify(symptomsWp),
        answers: JSON.stringify(finalAnswers),
        language: lang || params.language || 'en',
        source: 'body',
        gender: selectedGender,
      },
    });
  };

  const handleBack = async () => {
    await stopCurrentAudio();

    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      const previousQuestion = questions[previousIndex];

      setCurrentIndex(previousIndex);
      setSelectedOption(answers[previousQuestion?.id]?.answer_id || null);
      animateQuestionChange();
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

  const beforeLanguageChange = async () => {
    await stopCurrentAudio();
  };

  const afterLanguageChange = async (selectedLang) => {
    await fetchQuestions(selectedLang);
  };

  const renderNoAnswerModal = () => (
    <Modal transparent visible={errorModalVisible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.errorModalBox}>
          <View style={styles.errorHeader}>
            <Text style={styles.errorTitle}>
              {t('no_answer_title') || 'No Answer Selected'}
            </Text>

            <Pressable
              onPress={() => setErrorModalVisible(false)}
              style={styles.errorCloseButton}
            >
              <Text style={styles.errorCloseText}>×</Text>
            </Pressable>
          </View>

          <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.errorBody}
            resizeMode="cover"
          >
            <Text style={styles.errorMessageBold}>
              {t('no_answer_message_1') ||
                'Please select one answer before continuing.'}
            </Text>

            <Text style={styles.errorMessage}>
              {t('no_answer_message_2') ||
                'Tap one option and then press continue.'}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.errorOkButton,
                pressed && styles.errorOkButtonPressed,
              ]}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={styles.errorOkText}>{t('ok') || 'Ok'}</Text>
            </Pressable>
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );

  if (loadingQuestions) {
    return (
      <AppScreen
        beforeLanguageChange={beforeLanguageChange}
        afterLanguageChange={afterLanguageChange}
        onHomePress={async () => {
          await stopCurrentAudio();
          router.replace('/input');
        }}
      >
        <View style={styles.container}>
          <View style={styles.headerBar}>
            <Text style={styles.headerText}>Tell us more</Text>
          </View>

          <Text style={styles.questionNumber}>Loading questions...</Text>

          <View style={styles.questionBox}>
            <Text style={styles.questionText}>Please wait...</Text>
          </View>
        </View>
      </AppScreen>
    );
  }

  if (!currentQuestion) {
    return (
      <AppScreen
        beforeLanguageChange={beforeLanguageChange}
        afterLanguageChange={afterLanguageChange}
        onHomePress={async () => {
          await stopCurrentAudio();
          router.replace('/input');
        }}
      >
        <View style={styles.container}>
          <View style={styles.headerBar}>
            <Text style={styles.headerText}>Tell us more</Text>
          </View>

          <View style={styles.questionBox}>
            <Text style={styles.questionText}>No follow-up questions found.</Text>
          </View>

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

        {renderNoAnswerModal()}
      </AppScreen>
    );
  }

  return (
    <AppScreen
      beforeLanguageChange={beforeLanguageChange}
      afterLanguageChange={afterLanguageChange}
      onHomePress={async () => {
        await stopCurrentAudio();
        router.replace('/input');
      }}
    >
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>Tell us more</Text>
        </View>

        <Text style={styles.questionNumber}>
          Question {currentIndex + 1} of {questions.length}
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
        </View>

        <Animated.View style={[styles.questionBox, { opacity: fadeAnim }]}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>

          <Pressable
            style={({ pressed }) => [
              styles.speakerButton,
              pressed && styles.speakerPressed,
            ]}
            onPress={playQuestionAudio}
          >
            <Image
              source={SPEAKER_ICON}
              style={styles.speakerIcon}
              resizeMode="contain"
            />
          </Pressable>

          <ScrollView
            style={styles.optionsScroll}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}
            indicatorStyle="black"
            contentContainerStyle={styles.optionsWrapper}
          >
            {currentQuestion.options?.map((option) => {
              const optionId = getOptionId(option);
              const optionText = getOptionText(option);
              const optionImage = getOptionImage(
                option,
                currentQuestion,
                selectedGender
              );
              const isSelected = selectedOption === optionId;
              const isPainQuestion = checkPainQuestion(currentQuestion);

              return (
                <Pressable
                  key={optionId}
                  style={[
                    isPainQuestion ? styles.painOptionCard : styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => handleOptionPress(option)}
                >
                  {optionImage ? (
                    <Image
                      source={optionImage}
                      style={
                        isPainQuestion
                          ? styles.painOptionImage
                          : styles.optionImage
                      }
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={
                        isPainQuestion
                          ? styles.painOptionImagePlaceholder
                          : styles.optionImagePlaceholder
                      }
                    >
                      <Text style={styles.placeholderText}>?</Text>
                    </View>
                  )}

                  <Text
                    style={[
                      isPainQuestion ? styles.painOptionText : styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                    numberOfLines={3}
                  >
                    {optionText}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

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

      {renderNoAnswerModal()}
    </AppScreen>
  );
}