// AboutScreen.js
// Purpose: Displays About SACA information.
// AppScreen handles SafeArea, background, footer, and language modal.

import React from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/aboutStyles';

export default function AboutScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('about_title')}</Text>

        <Image
          source={require('../../assets/images/SACA_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.subTitle}>{t('about_subtitle')}</Text>

        <Text style={styles.paragraph}>
          {t('about_paragraph')}
        </Text>

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
      </ScrollView>
    </AppScreen>
  );
}