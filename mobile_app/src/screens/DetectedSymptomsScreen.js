import React, { useEffect, useRef, useState } from 'react';
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
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/detectedSymptomsStyles';

export default function DetectedSymptomsScreen() {
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const params = useLocalSearchParams();

  const symptomsEn = params.symptoms_en
    ? JSON.parse(params.symptoms_en)
    : [];

  const symptomsWp = params.symptoms_wp
    ? JSON.parse(params.symptoms_wp)
    : [];

  const voiceFileUri = params.voice_file_uri || null;

  const symptomsToShow =
    lang === 'wp'
      ? symptomsWp
      : symptomsEn.map((item) => {
          const key = item.toLowerCase().replaceAll(' ', '_');
          return t(key);
        });

  const symptomText =
    symptomsToShow.length > 0
      ? symptomsToShow.map((item) => `• ${item}`).join('\n')
      : 'No symptoms detected';

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // 🔊 PLAY AUDIO
  const playVoiceAudio = async () => {
    try {
      if (!voiceFileUri) {
        Alert.alert('Audio Error', 'Audio file not found.');
        return;
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: voiceFileUri },
        {
          shouldPlay: true,
          volume: 1.0,
        }
      );

      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (error) {
      console.log('Audio play error:', error);
      Alert.alert('Audio Error', 'Unable to play the voice audio.');
    }
  };

  // 🛑 STOP AUDIO
  const stopCurrentAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
    } catch (error) {
      console.log('Stop audio error:', error);
    }
  };

  // 🔥 AUTO STOP when screen unmounts (back, swipe, etc.)
  useEffect(() => {
    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, [sound]);

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
              <Text style={styles.headerText}>{t('detected_title')}</Text>
            </View>

            <View style={styles.symptomBox}>
              <Text style={styles.symptomText}>{symptomText}</Text>

              <Pressable
                style={({ pressed }) => [
                  styles.speakerButton,
                  pressed && styles.speakerPressed,
                ]}
                onPress={playVoiceAudio}
              >
                <Image
                  source={require('../../assets/images/speaker.png')}
                  style={styles.speakerIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            <Text style={styles.questionText}>{t('detected_question')}</Text>

            <View style={styles.buttonRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.choiceButton,
                  pressed && styles.choicePressed,
                ]}
                onPress={async () => {
                  if (loading) return;
                  setLoading(true);

                  await stopCurrentAudio();

                  router.push({
                    pathname: '/tellusmore',
                    params: {
                      symptoms_en: JSON.stringify(symptomsEn),
                      symptoms_wp: JSON.stringify(symptomsWp),
                      language: lang,
                    },
                  });
                }}
              >
                <Text style={styles.choiceText}>{t('yes')}</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.choiceButton,
                  pressed && styles.choicePressed,
                ]}
                onPress={async () => {
                  await stopCurrentAudio();
                  router.replace('/textinput');
                }}
              >
                <Text style={styles.choiceText}>{t('no')}</Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backPressedGrey,
              ]}
              onPress={async () => {
                await stopCurrentAudio();
                router.back();
              }}
            >
              <Text style={styles.backText}>{t('back')}</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={styles.footerItem}
              onPress={async () => {
                await stopCurrentAudio();
                router.replace('/input');
              }}
            >
              <Text style={styles.footerIcon}>🏠</Text>
              <Text style={styles.footerText}>{t('home')}</Text>
            </Pressable>

            <Pressable style={styles.footerItem} onPress={openModal}>
              <Text style={styles.footerIcon}>🌐</Text>
              <Text style={styles.footerText}>{t('language')}</Text>
            </Pressable>
          </View>

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
                  <Text style={styles.languageOptionText}>
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
                  <Text style={styles.languageOptionText}>
                    {t('warlpiri')}
                  </Text>
                </Pressable>

                <Text style={styles.confirmText}>
                  {t('change_language')}
                </Text>

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