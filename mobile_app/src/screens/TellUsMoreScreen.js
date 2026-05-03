import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
  Modal,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/tellUsMoreStyles';

export default function TellUsMoreScreen() {
  const router = useRouter();
  const { t, setLang } = useLanguage();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const questions = [
    {
      id: 'pain_level',
      title: t('pain_level'),
      question: t('pain_question'),
      options: [
        {
          label: t('none'),
          value: 'None',
          style: 'noneButton',
          textStyle: 'noneText',
        },
        {
          label: t('little'),
          value: 'A little',
          style: 'littleButton',
          textStyle: 'littleText',
        },
        {
          label: t('moderate'),
          value: 'Moderate',
          style: 'moderateButton',
          textStyle: 'lightText',
        },
        {
          label: t('very_bad'),
          value: 'Very bad',
          style: 'veryBadButton',
          textStyle: 'lightText',
        },
        {
          label: t('unbearable'),
          value: 'Unbearable',
          style: 'unbearableButton',
          textStyle: 'lightText',
        },
      ],
    },
    {
      id: 'duration',
      title: t('duration'),
      question: t('duration_question'),
      options: [
        {
          label: t('today'),
          value: 'Today',
          style: 'noneButton',
          textStyle: 'noneText',
        },
        {
          label: t('few_days'),
          value: 'Few days',
          style: 'littleButton',
          textStyle: 'littleText',
        },
        {
          label: t('one_week'),
          value: 'One week',
          style: 'moderateButton',
          textStyle: 'lightText',
        },
        {
          label: t('more_than_week'),
          value: 'More than one week',
          style: 'veryBadButton',
          textStyle: 'lightText',
        },
      ],
    },
    {
      id: 'fever',
      title: t('fever'),
      question: t('fever_question'),
      options: [
        {
          label: t('yes'),
          value: 'Yes',
          style: 'veryBadButton',
          textStyle: 'lightText',
        },
        {
          label: t('no'),
          value: 'No',
          style: 'noneButton',
          textStyle: 'noneText',
        },
      ],
    },
    {
      id: 'breathing',
      title: t('breathing'),
      question: t('breathing_question'),
      options: [
        {
          label: t('yes'),
          value: 'Yes',
          style: 'veryBadButton',
          textStyle: 'lightText',
        },
        {
          label: t('no'),
          value: 'No',
          style: 'noneButton',
          textStyle: 'noneText',
        },
      ],
    },
    {
      id: 'getting_worse',
      title: t('getting_worse'),
      question: t('getting_worse_question'),
      options: [
        {
          label: t('yes'),
          value: 'Yes',
          style: 'veryBadButton',
          textStyle: 'lightText',
        },
        {
          label: t('no'),
          value: 'No',
          style: 'noneButton',
          textStyle: 'noneText',
        },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.id];

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

  const confirmLanguage = () => {
    if (selectedLang) {
      setLang(selectedLang);
      closeModal();
    }
  };

  const selectAnswer = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      router.push({
        pathname: '/result',
        params: {
          answers: JSON.stringify({
            ...answers,
            [currentQuestion.id]: selectedAnswer,
          }),
        },
      });
    }
  };

  const handleBack = () => {
    setCurrentQuestionIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }

      router.back();
      return prevIndex;
    });
  };

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
              <Text style={styles.headerText}>{t('tell_us_more')}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.question}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>

              <Text style={styles.sectionTitle}>{currentQuestion.title}</Text>

              <Text style={styles.question}>{currentQuestion.question}</Text>

              {currentQuestion.options.map((item) => (
                <Pressable
                  key={item.value}
                  style={({ pressed }) => [
                    styles.answerButton,
                    styles[item.style],
                    selectedAnswer === item.value && styles.selectedAnswer,
                    pressed && styles.pressedAnswer,
                  ]}
                  onPress={() => selectAnswer(item.value)}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      selectedAnswer === item.value &&
                        styles.radioOuterSelected,
                    ]}
                  >
                    {selectedAnswer === item.value && (
                      <View style={styles.radioInner} />
                    )}
                  </View>

                  <Text style={[styles.answerText, styles[item.textStyle]]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                !selectedAnswer && styles.disabledButton,
                pressed && styles.continuePressed,
              ]}
              disabled={!selectedAnswer}
              onPress={handleContinue}
            >
              <Text style={styles.continueText}>
                {currentQuestionIndex === questions.length - 1
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
              <Text style={styles.backText}>{t('back')}</Text>
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