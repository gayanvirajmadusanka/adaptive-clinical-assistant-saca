// TextInputScreen.js
// Purpose: Lets the user manually type symptoms.
// It validates text input and sends the description to the loading screen for backend processing.

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
import { useRouter } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/textInputStyles';

export default function TextInputScreen() {
  const router = useRouter();
  const { t, setLang, lang } = useLanguage();

  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const openModal = () => {
    setSelectedLang(null);
    setModalVisible(true);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 120,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const confirmLanguage = () => {
    if (selectedLang) {
      setLang(selectedLang);
      closeModal();
    }
  };

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />

      <View style={styles.wrapper}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.background}
          resizeMode="cover"
        >
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
              <Text style={styles.questionText}>
                {t('text_input_question')}
              </Text>

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

          {/* FOOTER */}
          <View style={styles.footer}>
            <Pressable
              style={styles.footerItem}
              onPress={() => router.replace('/input')}
            >
              <Text style={styles.footerIcon}>🏠</Text>
              <Text style={styles.footerText}>{t('home')}</Text>
            </Pressable>

            <Pressable style={styles.footerItem} onPress={openModal}>
              <Text style={styles.footerIcon}>🌐</Text>
              <Text style={styles.footerText}>{t('language')}</Text>
            </Pressable>
          </View>

          {/* LANGUAGE MODAL */}
          <Modal transparent visible={modalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <Animated.View
                style={[
                  styles.languageModal,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                <Text style={styles.modalTitle}>{t('select_language')}</Text>

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

                <Text style={styles.confirmText}>{t('change_language')}</Text>

                <View style={styles.modalButtonRow}>

                  {/* OK Button */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.confirmButton,
                      pressed && styles.modalButtonPressed,
                      !selectedLang && styles.disabledButton,
                    ]}
                    disabled={!selectedLang}
                    onPress={confirmLanguage}
                  >
                    <Text style={styles.confirmButtonText}>{t('ok')}</Text>
                  </Pressable>

                  {/* Cancel Button */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.cancelButton,
                      pressed && styles.modalButtonPressed,
                    ]}
                    onPress={closeModal}
                  >
                    <Text style={styles.cancelText}>{t('cancel')}</Text>
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