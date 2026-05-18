// InputScreen.js
// Purpose: Allows the user to choose symptom input method: text, voice, or body map.
// AppScreen handles SafeArea, background, footer, and language modal.

import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/inputStyles';

export default function InputScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <AppScreen>
      <View style={styles.container}>
        <Text style={styles.title}>{t('input_title')}</Text>

        <Text style={styles.subtitle}>{t('input_subtitle')}</Text>

        <Pressable
          style={({ pressed }) => [
            styles.card,
            styles.textCard,
            pressed && styles.cardPressedGrey,
          ]}
          onPress={() => router.push('/textinput')}
        >
          <Image
            source={require('../../assets/images/text.png')}
            style={styles.cardImage}
            resizeMode="contain"
          />

          <Text style={styles.cardText}>{t('text')}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.card,
            styles.voiceCard,
            pressed && styles.cardPressedGrey,
          ]}
          onPress={() => router.push('/voiceinput')}
        >
          <Image
            source={require('../../assets/images/voice.png')}
            style={styles.cardImage}
            resizeMode="contain"
          />

          <Text style={styles.cardText}>{t('voice')}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.card,
            styles.bodyCard,
            pressed && styles.cardPressedGrey,
          ]}
          onPress={() => router.push('/bodyinput')}
        >
          <Image
            source={require('../../assets/images/body.png')}
            style={styles.cardImage}
            resizeMode="contain"
          />

          <Text style={styles.cardText}>{t('show')}</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}