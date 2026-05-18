// TextInputScreen.js
// Purpose: Lets the user manually type symptoms.
// The shared AppScreen component now handles SafeArea, background, footer, and language modal.

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/textInputStyles';

export default function TextInputScreen() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const [description, setDescription] = useState('');

  // Validates the typed symptom description before sending it to the loading screen.
  const handleContinue = () => {
    if (!description.trim()) {
      Alert.alert('Missing information', 'Please describe your symptoms first.');
      return;
    }

    router.push({
      pathname: '/loading',
      params: {
        text: description,
        language: lang || 'en',
      },
    });
  };

  return (
    <AppScreen>
      <View style={styles.container}>
        {/* HEADER SECTION */}
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>{t('text_input_title')}</Text>

          <Image
            source={require('../../assets/images/text.png')}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </View>

        {/* INPUT BOX */}
        <View style={styles.inputBox}>
          <Text style={styles.questionText}>{t('text_input_question')}</Text>

          <TextInput
            style={styles.textInput}
            multiline
            value={description}
            onChangeText={setDescription}
            placeholder={t('text_placeholder')}
            placeholderTextColor="#555"
          />
        </View>

        {/* CONTINUE BUTTON */}
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continuePressedGreen,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>{t('continue')}</Text>
        </Pressable>

        {/* BACK BUTTON */}
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
    </AppScreen>
  );
}
