// LanguageScreen.js
// Purpose: Lets the user select English or Warlpiri as the global app language.
// The selected language is saved using LanguageContext and then the app navigates to the input screen.

// React and React Native imports used to build this screen component.
import React, { useState } from 'react';
import { useRouter } from 'expo-router'; // Navigation between screens
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext'; // Global language management
import styles from '../styles/languageStyles'; // Styles for this screen

// Language Selection Screen Component
// Main screen component: LanguageScreen
export default function LanguageScreen() {

  const router = useRouter(); // Used for navigation
  const { setLang } = useLanguage(); // Function to change global language

  // State to track selected language (for UI highlight)
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Function when user selects a language
  const handlePress = (language) => {
    setSelectedLanguage(language); // Store selected language for UI

    // Update global language using LanguageContext
    if (language === 'English') {
      setLang('en'); // Set English
    } else if (language === 'Warlpiri') {
      setLang('wp'); // Set Warlpiri
    }

    // Small delay for UI effect before navigation
    setTimeout(() => {
      router.replace('/input'); // Navigate to Input Screen
    }, 200);
  };

  return (
    // Safe area to avoid overlap with device notch
    <SafeAreaView style={styles.safeArea}>
      
      {/* Status bar styling */}
      <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />

      <View style={styles.wrapper}>
        
        {/* Background image */}
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.background}
          resizeMode="cover"
        >

          {/* Main container */}
          <View style={styles.container}>

            {/* Screen title (English + Warlpiri) */}
            <Text style={styles.title}>
              Select Language{'\n'}Wangka
            </Text>

            {/* WARLPIRI BUTTON */}
            <Pressable
              style={[
                styles.button,
                styles.defaultButton,
                selectedLanguage === 'Warlpiri' && styles.selectedButton, // Highlight if selected
              ]}
              onPress={() => handlePress('Warlpiri')} // Handle selection
            >
              <Text
                style={[
                  styles.text,
                  styles.defaultText,
                  selectedLanguage === 'Warlpiri' && styles.selectedText, // Change text style when selected
                ]}
              >
                Warlpiri
              </Text>
            </Pressable>

            {/* ENGLISH BUTTON */}
            <Pressable
              style={[
                styles.button,
                styles.defaultButton,
                selectedLanguage === 'English' && styles.selectedButton,
              ]}
              onPress={() => handlePress('English')}
            >
              <Text
                style={[
                  styles.text,
                  styles.defaultText,
                  selectedLanguage === 'English' && styles.selectedText,
                ]}
              >
                English
              </Text>
            </Pressable>

          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}