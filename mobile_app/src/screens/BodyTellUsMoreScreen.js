// BodyTellUsMoreScreen.js
// Purpose: Body-input follow-up questions from FastAPI.
// Shows dynamic backend questions and adds images to matching answer options.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';
import { getFollowUpQuestions } from '../services/triageApi';
import { parseJsonParam } from '../utils/routeParams';
import styles from '../styles/bodyTellUsMoreStyles';

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

  pain_none: require('../../assets/images/Pain_Level/none.png'),
  pain_little: require('../../assets/images/Pain_Level/a_little.png'),
  pain_moderate: require('../../assets/images/Pain_Level/moderate.png'),
  pain_very_bad: require('../../assets/images/Pain_Level/very_bad.png'),
  pain_unbearable: require('../../assets/images/Pain_Level/unbearable.png'),

  today: require('../../assets/images/Duration/today.png'),
  yesterday: require('../../assets/images/Duration/yesterday.png'),
  two_three_days: require('../../assets/images/Duration/2_3_days.png'),
  about_week: require('../../assets/images/Duration/about_a_week.png'),
  more_week: require('../../assets/images/Duration/more_than_a_week.png'),
};

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/\+/g, ' plus ')
    .replace(/&/g, 'and')
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

function genderImageKey(selectedGender, maleKey, femaleKey) {
  return selectedGender === 'female' ? femaleKey : maleKey;
}

function getOptionImage(option, selectedGender = 'male') {
  const optionText = getOptionText(option);
  const optionId = getOptionId(option);

  const textKey = normalizeText(optionText);
  const idKey = normalizeText(optionId);

  const aliases = {
    // Gender
    male: 'male',
    man: 'male',
    boy: 'male',

    female: 'female',
    woman: 'female',
    girl: 'female',

    // Child age group
    child: genderImageKey(selectedGender, 'child_male', 'child_female'),
    children: genderImageKey(selectedGender, 'child_male', 'child_female'),
    kid: genderImageKey(selectedGender, 'child_male', 'child_female'),
    kids: genderImageKey(selectedGender, 'child_male', 'child_female'),
    baby: genderImageKey(selectedGender, 'child_male', 'child_female'),
    infant: genderImageKey(selectedGender, 'child_male', 'child_female'),
    toddler: genderImageKey(selectedGender, 'child_male', 'child_female'),
    under_12: genderImageKey(selectedGender, 'child_male', 'child_female'),
    under_13: genderImageKey(selectedGender, 'child_male', 'child_female'),
    age_0_12: genderImageKey(selectedGender, 'child_male', 'child_female'),
    age_0_13: genderImageKey(selectedGender, 'child_male', 'child_female'),
    '0_12': genderImageKey(selectedGender, 'child_male', 'child_female'),
    '0_13': genderImageKey(selectedGender, 'child_male', 'child_female'),

    // Youth age group
    youth: genderImageKey(selectedGender, 'youth_male', 'youth_female'),
    young: genderImageKey(selectedGender, 'youth_male', 'youth_female'),
    teen: genderImageKey(selectedGender, 'youth_male', 'youth_female'),
    teens: genderImageKey(selectedGender, 'youth_male', 'youth_female'),
    teenager: genderImageKey(selectedGender, 'youth_male', 'youth_female'),
    adolescent: genderImageKey(selectedGender, 'youth_male', 'youth_female'),
    young_adult: genderImageKey(selectedGender, 'youth_male', 'youth_female'),
    age_13_17: genderImageKey(selectedGender, 'youth_male', 'youth_female'),
    age_13_18: genderImageKey(selectedGender, 'youth_male', 'youth_female'),
    '13_17': genderImageKey(selectedGender, 'youth_male', 'youth_female'),
    '13_18': genderImageKey(selectedGender, 'youth_male', 'youth_female'),

    // Adult age group
    adult: genderImageKey(selectedGender, 'adult_male', 'adult_female'),
    grown_up: genderImageKey(selectedGender, 'adult_male', 'adult_female'),
    middle_aged: genderImageKey(selectedGender, 'adult_male', 'adult_female'),
    age_18_64: genderImageKey(selectedGender, 'adult_male', 'adult_female'),
    age_18_65: genderImageKey(selectedGender, 'adult_male', 'adult_female'),
    '18_64': genderImageKey(selectedGender, 'adult_male', 'adult_female'),
    '18_65': genderImageKey(selectedGender, 'adult_male', 'adult_female'),

    // Elder age group
    elder: genderImageKey(selectedGender, 'elder_male', 'elder_female'),
    elderly: genderImageKey(selectedGender, 'elder_male', 'elder_female'),
    old: genderImageKey(selectedGender, 'elder_male', 'elder_female'),
    older: genderImageKey(selectedGender, 'elder_male', 'elder_female'),
    senior: genderImageKey(selectedGender, 'elder_male', 'elder_female'),
    older_adult: genderImageKey(selectedGender, 'elder_male', 'elder_female'),
    senior_adult: genderImageKey(selectedGender, 'elder_male', 'elder_female'),
    old_person: genderImageKey(selectedGender, 'elder_male', 'elder_female'),
    age_65: genderImageKey(selectedGender, 'elder_male', 'elder_female'),
    age_65_plus: genderImageKey(selectedGender, 'elder_male', 'elder_female'),
    '65': genderImageKey(selectedGender, 'elder_male', 'elder_female'),
    '65_plus': genderImageKey(selectedGender, 'elder_male', 'elder_female'),

    // Pain level
    none: 'pain_none',
    no: 'pain_none',
    no_pain: 'pain_none',

    little: 'pain_little',
    a_little: 'pain_little',
    mild: 'pain_little',
    mild_pain: 'pain_little',
    low: 'pain_little',

    moderate: 'pain_moderate',
    medium: 'pain_moderate',

    bad: 'pain_very_bad',
    very_bad: 'pain_very_bad',
    severe: 'pain_very_bad',
    severe_pain: 'pain_very_bad',
    high: 'pain_very_bad',

    unbearable: 'pain_unbearable',
    worst: 'pain_unbearable',
    extreme: 'pain_unbearable',
    very_severe: 'pain_unbearable',

    // Duration
    today: 'today',

    yesterday: 'yesterday',

    '2_3_days': 'two_three_days',
    two_three_days: 'two_three_days',
    two_to_three_days: 'two_three_days',
    few_days: 'two_three_days',
    couple_of_days: 'two_three_days',

    about_a_week: 'about_week',
    one_week: 'about_week',
    week: 'about_week',
    around_a_week: 'about_week',

    more_than_a_week: 'more_week',
    more_week: 'more_week',
    over_a_week: 'more_week',
    longer_than_a_week: 'more_week',
  };

  const imageKey = aliases[textKey] || aliases[idKey];

  return imageKey ? OPTION_IMAGES[imageKey] : null;
}

export default function BodyTellUsMoreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, lang } = useLanguage();

  const symptomsEn = parseJsonParam(params.symptoms_en, []);
  const symptomsWp = parseJsonParam(params.symptoms_wp, []);

  const language = params.language || lang || 'en';

  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedGender, setSelectedGender] = useState(params.gender || 'male');

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length || 1;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  async function fetchQuestions() {
    try {
      setLoadingQuestions(true);

      const data = await getFollowUpQuestions(symptomsEn, language);

      setQuestions(data?.questions || []);
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
    const optionText = getOptionText(option);

    setSelectedOption(optionId);

    const normalized = normalizeText(optionText);

    if (normalized === 'male' || normalized === 'man' || normalized === 'boy') {
      setSelectedGender('male');
    }

    if (
      normalized === 'female' ||
      normalized === 'woman' ||
      normalized === 'girl'
    ) {
      setSelectedGender('female');
    }
  };

  const handleContinue = () => {
    if (!currentQuestion) {
      Alert.alert('Error', 'No question found.');
      return;
    }

    if (!selectedOption) {
      Alert.alert('Select answer', 'Please select one option.');
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

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextQuestion = questions[nextIndex];

      setCurrentIndex(nextIndex);
      setSelectedOption(updatedAnswers[nextQuestion?.id]?.answer_id || null);

      animateQuestionChange();
    } else {
      const finalAnswers = Object.values(updatedAnswers);

      router.push({
        pathname: '/loadingseverity',
        params: {
          symptoms_en: JSON.stringify(symptomsEn),
          symptoms_wp: JSON.stringify(symptomsWp),
          answers: JSON.stringify(finalAnswers),
          language: language,
          source: 'body',
          gender: selectedGender,
        },
      });
    }
  };

  const handleBack = () => {
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

  if (loadingQuestions) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />

        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.container}>
            <Text style={styles.questionText}>Loading questions...</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />

        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.container}>
            <Text style={styles.questionText}>No questions found.</Text>

            <Pressable
              style={styles.continueButton}
              onPress={() => router.back()}
            >
              <Text style={styles.continueText}>Back</Text>
            </Pressable>
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
              Question {currentIndex + 1} of {questions.length}
            </Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>

            <Animated.View style={[styles.questionBox, { opacity: fadeAnim }]}>
              <Text style={styles.questionText}>{currentQuestion.text}</Text>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.optionsWrapper}
              >
                {currentQuestion.options?.map((option) => {
                  const optionId = getOptionId(option);
                  const optionText = getOptionText(option);
                  const optionImage = getOptionImage(option, selectedGender);

                  const isSelected = selectedOption === optionId;

                  return (
                    <Pressable
                      key={optionId}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                      onPress={() => handleOptionPress(option)}
                    >
                      {optionImage && (
                        <Image
                          source={optionImage}
                          style={styles.optionImage}
                          resizeMode="contain"
                        />
                      )}

                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {optionText}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Animated.View>

            <Pressable style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueText}>
                {currentIndex === questions.length - 1 ? 'Submit' : 'Continue'}
              </Text>
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

            <View style={styles.footerItem}>
              <Text style={styles.footerIcon}>🌐</Text>
              <Text style={styles.footerText}>{t('language')}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}