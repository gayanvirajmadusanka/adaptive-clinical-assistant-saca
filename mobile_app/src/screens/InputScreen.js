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
import { useRouter } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/inputStyles';

export default function InputScreen() {
  const router = useRouter();
  const { t, setLang } = useLanguage();

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
    }).start(() => {
      setModalVisible(false);
    });
  };

  const confirmLanguage = () => {
    if (selectedLang) {
      setLang(selectedLang);
      closeLanguageModal();
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
            <Text style={styles.title}>{t('input_title')}</Text>

            <Text style={styles.subtitle}>{t('input_subtitle')}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.textCard,
                pressed && styles.cardPressedGrey,
              ]}
              onPress={() => router.push('/textinput')}
            >
              <Image
                source={require('../../assets/images/text.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>{t('text')}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.voiceCard,
                pressed && styles.cardPressedGrey,
              ]}
            >
              <Image
                source={require('../../assets/images/voice.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>{t('voice')}</Text>
            </Pressable>

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

          <View style={styles.footer}>
            <Pressable
              style={styles.footerItem}
              onPress={() => router.replace('/input')}
            >
              <Text style={styles.footerIcon}>🏠</Text>
              <Text style={styles.footerText}>{t('home')}</Text>
            </Pressable>

            <Pressable
              style={styles.footerItem}
              onPress={openLanguageModal}
            >
              <Text style={styles.footerIcon}>🌐</Text>
              <Text style={styles.footerText}>{t('language')}</Text>
            </Pressable>
          </View>

          <Modal
            transparent
            visible={modalVisible}
            animationType="fade"
            onRequestClose={closeLanguageModal}
          >
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
                  <Pressable
                    style={styles.cancelButton}
                    onPress={closeLanguageModal}
                  >
                    <Text style={styles.cancelText}>{t('no')}</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.confirmButton,
                      !selectedLang && styles.disabledButton,
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