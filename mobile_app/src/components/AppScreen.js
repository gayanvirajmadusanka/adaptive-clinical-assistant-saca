// AppScreen.js
// Shared screen wrapper for SafeArea, StatusBar, background image, footer, and language modal.

import React, { useRef, useState } from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useLanguage } from '../context/LanguageContext';
import AppFooter from './AppFooter';
import LanguageModal from './LanguageModal';
import commonStyles from '../styles/commonLayoutStyles';

export default function AppScreen({
  children,
  onHomePress,
  languageLabel,
  languageModalDisabled = false,
  beforeLanguageChange,
  afterLanguageChange,
}) {
  const router = useRouter();
  const { setLang } = useLanguage();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const openLanguageModal = () => {
    setSelectedLang(null);
    setModalVisible(true);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const closeLanguageModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 120,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const confirmLanguage = async () => {
    if (!selectedLang) return;

    if (beforeLanguageChange) {
      await beforeLanguageChange(selectedLang);
    }

    setLang(selectedLang);
    closeLanguageModal();

    if (afterLanguageChange) {
      await afterLanguageChange(selectedLang);
    }
  };

  const handleHomePress = async () => {
    if (onHomePress) {
      await onHomePress();
      return;
    }

    router.replace('/input');
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />

      <View style={commonStyles.wrapper}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={commonStyles.background}
          resizeMode="cover"
        >
          {children}

          <AppFooter
            onHomePress={handleHomePress}
            onLanguagePress={openLanguageModal}
            languageLabel={languageLabel}
          />

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