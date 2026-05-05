// InputScreen.js
// Purpose: Allows the user to choose the symptom input method: text, voice, or body map.
// It also provides footer navigation and a language selection modal.

// React and React Native imports used to build this screen component.
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
  Image,
  Modal,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router'; // Navigation between screens
import { useLanguage } from '../context/LanguageContext'; // Global language context
import styles from '../styles/inputStyles'; // Styling for this screen

// Main Input Screen Component
// Main screen component: InputScreen
export default function InputScreen() {

  const router = useRouter(); // Used to navigate to other screens
  const { t, setLang } = useLanguage(); // t = translation function, setLang = change language

  // State to control modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // State to store selected language (en/wp)
  const [selectedLang, setSelectedLang] = useState(null);

  // Animation scale value for popup effect
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Function to open language selection modal
  const openLanguageModal = () => {
    setSelectedLang(null); // Reset previous selection
    setModalVisible(true); // Show modal

    // Animate modal scale from small to normal
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  // Function to close modal with animation
  const closeLanguageModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false); // Hide modal after animation
    });
  };

  // Confirm selected language
  const confirmLanguage = () => {
    if (selectedLang) {
      setLang(selectedLang); // Update global language
      closeLanguageModal();  // Close modal
    }
  };

  return (
    // Safe area for proper layout on different devices
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

            {/* Title (translated) */}
            <Text style={styles.title}>{t('input_title')}</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>{t('input_subtitle')}</Text>

            {/* TEXT INPUT CARD */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.textCard,
                pressed && styles.cardPressedGrey, // press effect
              ]}
              onPress={() => router.push('/textinput')} // Navigate to text input screen
            >
              <Image
                source={require('../../assets/images/text.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>{t('text')}</Text>
            </Pressable>

            {/* VOICE INPUT CARD */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.voiceCard,
                pressed && styles.cardPressedGrey,
              ]}
              onPress={() => router.push('/voiceinput')} // Navigate to voice screen
            >
              <Image
                source={require('../../assets/images/voice.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>{t('voice')}</Text>
            </Pressable>

            {/* BODY SELECTION CARD (currently no navigation) */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.bodyCard,
                pressed && styles.cardPressedGrey,
              ]}
            >
              <Image
                source={require('../../assets/images/body.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>{t('body')}</Text>
            </Pressable>
          </View>

          {/* FOOTER SECTION */}
          <View style={styles.footer}>

            {/* HOME BUTTON */}
            <Pressable
              style={styles.footerItem}
              onPress={() => router.replace('/input')} // Reload input screen
            >
              <Text style={styles.footerIcon}>🏠</Text>
              <Text style={styles.footerText}>{t('home')}</Text>
            </Pressable>

            {/* LANGUAGE BUTTON */}
            <Pressable
              style={styles.footerItem}
              onPress={openLanguageModal} // Open language modal
            >
              <Text style={styles.footerIcon}>🌐</Text>
              <Text style={styles.footerText}>{t('language')}</Text>
            </Pressable>
          </View>

          {/* LANGUAGE SELECTION MODAL */}
          <Modal
            transparent
            visible={modalVisible}
            animationType="fade"
            onRequestClose={closeLanguageModal}
          >
            <View style={styles.modalOverlay}>
              
              {/* Animated popup container */}
              <Animated.View
                style={[
                  styles.languageModal,
                  { transform: [{ scale: scaleAnim }] }, // scaling animation
                ]}
              >
                {/* Modal title */}
                <Text style={styles.modalTitle}>{t('select_language')}</Text>

                {/* ENGLISH OPTION */}
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
                      selectedLang === 'en' && styles.languageOptionTextSelected,
                    ]}
                  >
                    {t('english')}
                  </Text>
                </Pressable>

                {/* WARLPIRI OPTION */}
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
                      selectedLang === 'wp' && styles.languageOptionTextSelected,
                    ]}
                  >
                    {t('warlpiri')}
                  </Text>
                </Pressable>

                {/* Confirmation text */}
                <Text style={styles.confirmText}>{t('change_language')}</Text>

                {/* BUTTONS ROW */}
                <View style={styles.modalButtonRow}>

                  {/* CANCEL BUTTON */}
                  <Pressable
                    style={styles.cancelButton}
                    onPress={closeLanguageModal}
                  >
                    <Text style={styles.cancelText}>{t('no')}</Text>
                  </Pressable>

                  {/* CONFIRM BUTTON */}
                  <Pressable
                    style={[
                      styles.confirmButton,
                      !selectedLang && styles.disabledButton, // disable if no selection
                    ]}
                    onPress={confirmLanguage}
                    disabled={!selectedLang}
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