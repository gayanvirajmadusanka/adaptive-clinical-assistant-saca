// TextInputScreen.js
// Purpose: Lets the user manually type symptoms.
// AppScreen handles SafeArea, background, footer, and language modal.

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

  const handleContinue = () => {
    if (!description.trim()) {
      Alert.alert('Missing information', 'Please describe your symptoms first.');
      return;
    }

    router.push({
      pathname: '/loading',
      params: {
        text: description.trim(),
        language: lang || 'en',
        source: 'text',
      },
    });
  };

  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>{t('text_input_title')}</Text>

          <Image
            source={require('../../assets/images/text.png')}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </View>

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

        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continuePressedGreen,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>{t('continue')}</Text>
        </Pressable>

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