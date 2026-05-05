// TextInputScreen.js
// Purpose: Lets the user manually type symptoms.
// It validates text input and sends the description to the loading screen for backend processing.

// React and React Native imports used to build this screen component.
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
  TextInput,
  Modal,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router'; // Navigation
import { useLanguage } from '../context/LanguageContext'; // Language context (global state)
import styles from '../styles/textInputStyles'; // Styling

// Main Text Input Screen Component
// Main screen component: TextInputScreen
export default function TextInputScreen() {

  const router = useRouter(); // Used for navigation
  const { t, setLang, lang } = useLanguage(); // t = translate, setLang = change language, lang = current language

  // Stores user symptom description
  const [description, setDescription] = useState('');

  // Modal visibility state
  const [modalVisible, setModalVisible] = useState(false);

  // Selected language in modal
  const [selectedLang, setSelectedLang] = useState(null);

  // Animation scale value for modal popup
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Open language selection modal
  const openModal = () => {
    setSelectedLang(null); // Reset selection
    setModalVisible(true); // Show modal

    // Animate modal (zoom in)
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  // Close modal with animation
  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 120,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  // Confirm selected language
  const confirmLanguage = () => {
    if (selectedLang) {
      setLang(selectedLang); // Update global language
      closeModal(); // Close modal
    }
  };

  // Continue button logic
  const handleContinue = () => {

    // Check if input is empty
    if (!description.trim()) {
      Alert.alert('Missing information', 'Please describe your symptoms first.');
      return; // Stop execution
    }

    // Navigate to loading screen and send data
    router.push({
      pathname: '/loading',
      params: {
        text: description,       // User input
        language: lang || 'en',  // Current language
      },
    });
  };

  return (
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

          <View style={styles.container}>

            {/* HEADER SECTION */}
            <View style={styles.headerBar}>
              
              {/* Screen title (translated) */}
              <Text style={styles.headerText}>{t('text_input_title')}</Text>

              {/* Icon */}
              <Image
                source={require('../../assets/images/text.png')}
                style={styles.headerIcon}
                resizeMode="contain"
              />
            </View>

            {/* INPUT BOX */}
            <View style={styles.inputBox}>

              {/* Question text */}
              <Text style={styles.questionText}>
                {t('text_input_question')}
              </Text>

              {/* Text Input Field */}
              <TextInput
                style={styles.textInput}
                multiline // Allows multiple lines
                value={description} // Bind state
                onChangeText={setDescription} // Update state on typing
                placeholder={t('text_placeholder')} // Placeholder text
                placeholderTextColor="#555"
              />
            </View>

            {/* CONTINUE BUTTON */}
            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.continuePressedGreen, // press effect
              ]}
              onPress={handleContinue} // Call function
            >
              <Text style={styles.continueText}>{t('continue')}</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>

            {/* BACK BUTTON */}
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backPressedGrey,
              ]}
              onPress={() => router.back()} // Go to previous screen
            >
              <Text style={styles.backText}>{t('back')}</Text>
            </Pressable>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>

            {/* HOME BUTTON */}
            <Pressable
              style={styles.footerItem}
              onPress={() => router.replace('/input')}
            >
              <Text style={styles.footerIcon}>🏠</Text>
              <Text style={styles.footerText}>{t('home')}</Text>
            </Pressable>

            {/* LANGUAGE BUTTON */}
            <Pressable style={styles.footerItem} onPress={openModal}>
              <Text style={styles.footerIcon}>🌐</Text>
              <Text style={styles.footerText}>{t('language')}</Text>
            </Pressable>
          </View>

          {/* LANGUAGE MODAL */}
          <Modal transparent visible={modalVisible} animationType="fade">

            <View style={styles.modalOverlay}>

              {/* Animated Modal */}
              <Animated.View
                style={[
                  styles.languageModal,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >

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
                      selectedLang === 'en' &&
                        styles.languageOptionTextSelected,
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
                      selectedLang === 'wp' &&
                        styles.languageOptionTextSelected,
                    ]}
                  >
                    {t('warlpiri')}
                  </Text>
                </Pressable>

                {/* CONFIRM TEXT */}
                <Text style={styles.confirmText}>{t('change_language')}</Text>

                {/* BUTTON ROW */}
                <View style={styles.modalButtonRow}>

                  {/* CANCEL */}
                  <Pressable style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.cancelText}>{t('no')}</Text>
                  </Pressable>

                  {/* CONFIRM */}
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