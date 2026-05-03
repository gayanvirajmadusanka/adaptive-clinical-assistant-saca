import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/detectedSymptomsStyles';

const API_URL = 'http://192.168.1.106:8000';

export default function DetectedSymptomsScreen() {
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const params = useLocalSearchParams();

  const symptomsEn = params.symptoms_en ? JSON.parse(params.symptoms_en) : [];
  const symptomsWp = params.symptoms_wp ? JSON.parse(params.symptoms_wp) : [];

  const initialVoiceFileUri = params.voice_file_uri || null;

  const [voiceFileUri, setVoiceFileUri] = useState(initialVoiceFileUri);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const soundRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, [])
  );

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

  const stopCurrentAudio = async () => {
    try {
      if (soundRef.current) {
        const currentSound = soundRef.current;
        soundRef.current = null;

        const status = await currentSound.getStatusAsync();

        if (status.isLoaded) {
          await currentSound.stopAsync();
          await currentSound.unloadAsync();
        }
      }
    } catch (error) {
      console.log('Stop audio error:', error);
    }
  };

  const saveBase64Audio = async (voiceB64, langCode) => {
    if (!voiceB64) return null;

    const cleaned = voiceB64.replace(/^data:audio\/\w+;base64,/, '');
    const fileUri = FileSystem.cacheDirectory + `voice_${langCode}.wav`;

    await FileSystem.writeAsStringAsync(fileUri, cleaned, {
      encoding: 'base64',
    });

    return fileUri;
  };

  const fetchAudioForLanguage = async (languageCode) => {
    try {
      setAudioLoading(true);

      const textToSend =
        languageCode === 'wp' ? symptomsWp.join(' ') : symptomsEn.join(' ');

      const response = await fetch(`${API_URL}/extract/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          language: languageCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update audio');
      }

      const data = await response.json();
      const newFile = await saveBase64Audio(data.voice_b64, languageCode);

      if (newFile) {
        setVoiceFileUri(newFile);
      }
    } catch (error) {
      console.log('Audio update error:', error);
      Alert.alert('Audio Error', 'Could not update audio.');
    } finally {
      setAudioLoading(false);
    }
  };

  const playVoiceAudio = async () => {
    try {
      if (!voiceFileUri) {
        Alert.alert('Audio Error', 'No audio file found.');
        return;
      }

      if (audioLoading) {
        Alert.alert('Please wait', 'Updating audio...');
        return;
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      await stopCurrentAudio();

      const { sound } = await Audio.Sound.createAsync(
        { uri: voiceFileUri },
        {
          shouldPlay: true,
          volume: 1.0,
        }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          try {
            if (soundRef.current === sound) {
              soundRef.current = null;
            }

            await sound.unloadAsync();
          } catch (error) {
            console.log('Finished audio unload error:', error);
          }
        }
      });
    } catch (error) {
      console.log('Play error:', error);
      Alert.alert('Audio Error', 'Unable to play audio.');
    }
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        const currentSound = soundRef.current;
        soundRef.current = null;

        currentSound
          .getStatusAsync()
          .then((status) => {
            if (status.isLoaded) {
              currentSound.stopAsync();
              currentSound.unloadAsync();
            }
          })
          .catch((error) => {
            console.log('Cleanup audio error:', error);
          });
      }
    };
  }, []);

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

  const confirmLanguage = async () => {
    if (!selectedLang) return;

    await stopCurrentAudio();
    setLang(selectedLang);
    closeModal();

    await fetchAudioForLanguage(selectedLang);
  };

  const handleYesPress = async () => {
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
                onPress={handleYesPress}
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
              <Text style={styles.footerText}>
                {audioLoading ? 'Updating...' : t('language')}
              </Text>
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
                  <Pressable style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.cancelText}>{t('no')}</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.confirmButton,
                      !selectedLang && styles.disabledButton,
                    ]}
                    disabled={!selectedLang || audioLoading}
                    onPress={confirmLanguage}
                  >
                    <Text style={styles.confirmButtonText}>
                      {audioLoading ? '...' : t('yes')}
                    </Text>
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