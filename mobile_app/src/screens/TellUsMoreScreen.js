import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
  Modal,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/tellUsMoreStyles';

export default function TellUsMoreScreen() {
  const router = useRouter();
  const { t, setLang } = useLanguage();

  const [painLevel, setPainLevel] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const options = [
    { label: t('none'), value: 'None', style: 'noneButton', textStyle: 'noneText' },
    { label: t('little'), value: 'A little', style: 'littleButton', textStyle: 'littleText' },
    { label: t('moderate'), value: 'Moderate', style: 'moderateButton', textStyle: 'lightText' },
    { label: t('very_bad'), value: 'Very bad', style: 'veryBadButton', textStyle: 'lightText' },
    { label: t('unbearable'), value: 'Unbearable', style: 'unbearableButton', textStyle: 'lightText' },
  ];

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
            <View style={styles.headerBar}>
              <Text style={styles.headerText}>{t('tell_us_more')}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{t('pain_level')}</Text>
              <Text style={styles.question}>{t('pain_question')}</Text>

              {options.map((item) => (
                <Pressable
                  key={item.value}
                  style={({ pressed }) => [
                    styles.answerButton,
                    styles[item.style],
                    painLevel === item.value && styles.selectedAnswer,
                    pressed && styles.pressedAnswer,
                  ]}
                  onPress={() => setPainLevel(item.value)}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      painLevel === item.value && styles.radioOuterSelected,
                    ]}
                  >
                    {painLevel === item.value && (
                      <View style={styles.radioInner} />
                    )}
                  </View>

                  <Text style={[styles.answerText, styles[item.textStyle]]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                !painLevel && styles.disabledButton,
                pressed && styles.continuePressed,
              ]}
              disabled={!painLevel}
              onPress={() => router.push('/tellusmore2')}
            >
              <Text style={styles.continueText}>{t('continue')}</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable style={styles.footerItem} onPress={() => router.replace('/input')}>
              <Text style={styles.footerIcon}>🏠</Text>
              <Text style={styles.footerText}>{t('home')}</Text>
            </Pressable>

            <Pressable style={styles.footerItem} onPress={openModal}>
              <Text style={styles.footerIcon}>🌐</Text>
              <Text style={styles.footerText}>{t('language')}</Text>
            </Pressable>
          </View>

          {/* Language Modal */}
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
                      selectedLang === 'en' && styles.languageOptionTextSelected,
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
                      selectedLang === 'wp' && styles.languageOptionTextSelected,
                    ]}
                  >
                    {t('warlpiri')}
                  </Text>
                </Pressable>

                <Text style={styles.confirmText}>{t('change_language')}</Text>

                <View style={styles.modalButtonRow}>
                  <Pressable style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.cancelText}>{t('no')}</Text>
                  </Pressable>

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