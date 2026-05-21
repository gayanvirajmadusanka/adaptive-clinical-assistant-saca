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

  // Loads follow-up questions from backend based on detected symptoms and selected language.
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

  // Stops currently playing question audio.
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

  // Plays backend-generated voice for the current question.
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

  // Clean up audio when leaving this screen.
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

  // Saves current answer and moves to next question or severity loading screen.
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
          language: lang || params.language || 'en',
          source: params.source || 'text',
        },
      });
    }
  };

  // Handles back button. Previous question first, then previous screen.
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

  // Android hardware back button support.
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

  // Called by AppScreen before changing language.
  const beforeLanguageChange = async () => {
    await stopCurrentAudio();
  };

  // Called by AppScreen after changing language.
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
          router.replace('/input');
        }}
      >
        <View style={styles.container}>
          <View style={styles.headerBar}>
            <Text style={styles.headerText}>{t('tell_us_more')}</Text>            
          </View>

          <Text style={styles.progressText}>Loading questions...</Text>

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
            <Text style={styles.headerText}>{t('tell_us_more')}</Text>
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
          Question {currentIndex + 1} of {totalQuestions}
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
            {currentIndex === questions.length - 1 ? t('submit') : t('continue')}
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