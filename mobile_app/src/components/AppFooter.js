// AppFooter.js
// Purpose: Reusable footer used across SACA screens.
// Provides quick Home and Language actions.
// Prevents repeating the same footer UI on every screen.

// Import React
import React from 'react';

// Import reusable React Native components
import { Pressable, Text, View } from 'react-native';

// Import Expo Router for navigation
import { useRouter } from 'expo-router';

// Import global language context
import { useLanguage } from '../context/LanguageContext';

// Import shared footer/common layout styles
import commonStyles from '../styles/commonLayoutStyles';


// ----------------------------------------------------
// AppFooter Component
// ----------------------------------------------------
// Props:
// onHomePress      → optional custom Home button action
// onLanguagePress  → opens language selection modal
// languageLabel    → optional custom language label
//
// Why reusable:
// Keeps footer UI consistent across all app screens
// ----------------------------------------------------
export default function AppFooter({
  onHomePress,
  onLanguagePress,
  languageLabel,
}) {

  // Access Expo Router navigation
  const router = useRouter();

  // Access translation helper
  const { t } = useLanguage();


  // ----------------------------------------------------
  // handleHomePress()
  // ----------------------------------------------------
  // Purpose:
  // Handles Home button navigation.
  //
  // Logic:
  // 1. Use custom handler if screen provides one
  // 2. Otherwise navigate to input screen
  // ----------------------------------------------------
  const handleHomePress = async () => {

    // If custom Home action exists
    if (onHomePress) {

      // Run custom function
      await onHomePress();

      return;
    }

    // Default navigation to input screen
    router.replace('/input');
  };


  // ----------------------------------------------------
  // Footer UI
  // ----------------------------------------------------
  return (

    // Main footer container
    <View style={commonStyles.footer}>

      {/* ------------------------------------------------
          HOME BUTTON
         ------------------------------------------------ */}
      <Pressable
        style={commonStyles.footerItem}
        onPress={handleHomePress}
      >

        {/* Home icon */}
        <Text style={commonStyles.footerIcon}>🏠</Text>

        {/* Translated Home label */}
        <Text style={commonStyles.footerText}>
          {t('home')}
        </Text>
      </Pressable>


      {/* ------------------------------------------------
          LANGUAGE BUTTON
         ------------------------------------------------ */}
      <Pressable
        style={commonStyles.footerItem}
        onPress={onLanguagePress}
      >

        {/* Language icon */}
        <Text style={commonStyles.footerIcon}>🌐</Text>

        {/* Current language label */}
        <Text style={commonStyles.footerText}>
          {languageLabel || t('language')}
        </Text>
      </Pressable>
    </View>
  );
}