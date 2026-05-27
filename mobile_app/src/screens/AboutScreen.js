// AboutScreen.js
// Purpose: Displays About SACA information.
// AppScreen handles SafeArea, background, footer, and language modal.

import React from 'react';

// Import basic React Native UI components
import { View, Text, Image, Pressable, ScrollView } from 'react-native';

// Import Expo router for navigation between screens
import { useRouter } from 'expo-router';

// Import reusable AppScreen wrapper component
import AppScreen from '../components/AppScreen';

// Import language translation hook
import { useLanguage } from '../context/LanguageContext';

// Import styles for this screen
import styles from '../styles/aboutStyles';

export default function AboutScreen() {

  // Router object used for screen navigation
  const router = useRouter();

  // t() function is used for language translation
  const { t } = useLanguage();

  return (

    // AppScreen provides common background, footer, and safe area
    <AppScreen>

      {/* ScrollView allows content to scroll on smaller screens */}
      <ScrollView contentContainerStyle={styles.container}>

        {/* Main title */}
        <Text style={styles.title}>{t('about_title')}</Text>

        {/* SACA logo image */}
        <Image
          source={require('../../assets/images/SACA_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Subtitle text */}
        <Text style={styles.subTitle}>{t('about_subtitle')}</Text>

        {/* About description paragraph */}
        <Text style={styles.paragraph}>
          {t('about_paragraph')}
        </Text>

        {/* BACK BUTTON */}
        <Pressable

          // Change style slightly when button is pressed
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backPressedGrey,
          ]}

          // Go back to previous screen
          onPress={() => router.back()}
        >
          <View style={styles.backButtonContent}>

            {/* Back arrow image */}
            <Image
              source={require('../../assets/images/back-arrow.png')}
              style={styles.backArrowImage}
              resizeMode="contain"
            />

            {/* Back button text */}
            <Text style={styles.backText}>{t('back')}</Text>

          </View>
        </Pressable>

      </ScrollView>
    </AppScreen>
  );
}