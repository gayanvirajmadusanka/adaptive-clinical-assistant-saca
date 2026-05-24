// TellUsMoreScreen.js
// Purpose: Loads follow-up questions from FastAPI after detected symptoms.
// AppScreen handles SafeArea, background, footer, and language modal.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  BackHandler,
  Modal,
  ImageBackground,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/tellUsMoreStyles';

import { getFollowUpQuestions } from '../services/triageApi';
import { saveBase64AudioToCache } from '../utils/base64Audio';
import { parseJsonParam } from '../utils/routeParams';
import { buildAnswerList } from '../utils/triagePayloads';

export default function TellUsMoreScreen() {
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
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const soundRef = useRef(null);

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
      setErrorModalVisible(true);
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
          language: lang || params.language || 'en',
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
            <Text style={styles.errorTitle}>{t('no_answer_title')}</Text>

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
              {t('no_answer_message_1')}
            </Text>

            <Text style={styles.errorMessage}>
              {t('no_answer_message_2')}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.errorOkButton,
                pressed && styles.errorOkButtonPressed,
              ]}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={styles.errorOkText}>{t('ok')}</Text>
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
            <Text style={styles.headerText}>{t('tell_us_more')}</Text>
          </View>

          <Text style={styles.progressText}>{t('loading')}</Text>

          <View style={styles.questionBox}>
            <Text style={styles.questionText}>{t('loading_wait')}</Text>
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
            <Text style={styles.headerText}>{t('tell_us_more')}</Text>
          </View>

          <View style={styles.questionBox}>
            <Text style={styles.questionText}>
              {t('no_follow_up_questions')}
            </Text>
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
          <Text style={styles.headerText}>{t('tell_us_more')}</Text>
        </View>

        <Text style={styles.progressText}>
          {t('question')} {currentIndex + 1} {t('of')} {totalQuestions}
        </Text>

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

        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continuePressed,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>
            {currentIndex === questions.length - 1
              ? t('submit')
              : t('continue')}
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