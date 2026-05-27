// AppScreen.js
// Purpose:
// Shared reusable screen wrapper used across the SACA mobile app.
//
// Handles:
// - SafeArea protection
// - StatusBar styling
// - Shared background image
// - Footer navigation
// - Language selection modal
//
// Why:
// Prevents repeating the same layout structure
// on every individual screen.

// Import React hooks
import React, { useRef, useState } from 'react';

// Import reusable React Native components
import {
  View,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Animated,
} from 'react-native';

// Import Expo Router navigation
import { useRouter } from 'expo-router';

// Import global language context
import { useLanguage } from '../context/LanguageContext';

// Import reusable footer component
import AppFooter from './AppFooter';

// Import reusable language modal
import LanguageModal from './LanguageModal';

// Import shared common layout styles
import commonStyles from '../styles/commonLayoutStyles';


// ----------------------------------------------------
// AppScreen Component
// ----------------------------------------------------
// Props:
//
// children               → Screen UI content
// onHomePress            → Optional custom Home action
// languageLabel          → Optional language label override
// languageModalDisabled  → Disable language modal if needed
// beforeLanguageChange   → Async function before language changes
// afterLanguageChange    → Async function after language changes
//
// Why reusable:
// Creates consistent screen layout across the app.
// ----------------------------------------------------
export default function AppScreen({
  children,
  onHomePress,
  languageLabel,
  languageModalDisabled = false,
  beforeLanguageChange,
  afterLanguageChange,
}) {

  // Access Expo Router navigation
  const router = useRouter();

  // Access global language setter
  const { setLang } = useLanguage();


  // ----------------------------------------------------
  // Local state
  // ----------------------------------------------------

  // Controls language modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // Stores selected language temporarily
  const [selectedLang, setSelectedLang] = useState(null);


  // ----------------------------------------------------
  // Animation value
  // ----------------------------------------------------
  // Used for modal scale animation
  const scaleAnim = useRef(new Animated.Value(0.8)).current;


  // ----------------------------------------------------
  // openLanguageModal()
  // ----------------------------------------------------
  // Purpose:
  // Opens language modal with spring animation.
  // ----------------------------------------------------
  const openLanguageModal = () => {

    // Reset previous language selection
    setSelectedLang(null);

    // Show modal
    setModalVisible(true);

    // Animate modal scale
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };


  // ----------------------------------------------------
  // closeLanguageModal()
  // ----------------------------------------------------
  // Purpose:
  // Closes modal with scale-down animation.
  // ----------------------------------------------------
  const closeLanguageModal = () => {

    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 120,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };


  // ----------------------------------------------------
  // confirmLanguage()
  // ----------------------------------------------------
  // Purpose:
  // Confirms and applies selected language.
  //
  // Flow:
  // 1. Run beforeLanguageChange()
  // 2. Update global language
  // 3. Close modal
  // 4. Run afterLanguageChange()
  // ----------------------------------------------------
  const confirmLanguage = async () => {

    // Prevent confirm without selection
    if (!selectedLang) return;

    // Run optional pre-language-change logic
    if (beforeLanguageChange) {
      await beforeLanguageChange(selectedLang);
    }

    // Update global app language
    setLang(selectedLang);

    // Close modal
    closeLanguageModal();

    // Run optional post-language-change logic
    if (afterLanguageChange) {
      await afterLanguageChange(selectedLang);
    }
  };


  // ----------------------------------------------------
  // handleHomePress()
  // ----------------------------------------------------
  // Purpose:
  // Handles Home footer button press.
  //
  // Logic:
  // 1. Run custom Home action if provided
  // 2. Otherwise navigate to input screen
  // ----------------------------------------------------
  const handleHomePress = async () => {

    // Use custom handler if available
    if (onHomePress) {
      await onHomePress();
      return;
    }

    // Default Home navigation
    router.replace('/input');
  };


  // ----------------------------------------------------
  // Main Screen Layout
  // ----------------------------------------------------
  return (

    // Safe area wrapper
    <SafeAreaView style={commonStyles.safeArea}>

      {/* Configure status bar appearance */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5EAD8"
      />

      {/* Main wrapper */}
      <View style={commonStyles.wrapper}>

        {/* Shared app background image */}
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={commonStyles.background}
          resizeMode="cover"
        >

          {/* Render screen-specific content */}
          {children}


          {/* Shared footer */}
          <AppFooter
            onHomePress={handleHomePress}
            onLanguagePress={openLanguageModal}
            languageLabel={languageLabel}
          />


          {/* Shared language selection modal */}
          <LanguageModal
            visible={modalVisible}
            selectedLang={selectedLang}
            scaleAnim={scaleAnim}
            disabled={languageModalDisabled}
            onSelectLanguage={setSelectedLang}
            onCancel={closeLanguageModal}
            onConfirm={confirmLanguage}
          />
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}