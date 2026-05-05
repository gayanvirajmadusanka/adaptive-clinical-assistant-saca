// DetectedSymptomsScreen.js
// Purpose: Displays symptoms detected by the FastAPI backend.
// It supports English/Warlpiri display, audio playback, language switching, error handling, and navigation to TellUsMore.

// React and React Native imports used to build this screen component.
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

import { useRouter, useLocalSearchParams } from 'expo-router'; // Used for navigation and receiving route params
import { useFocusEffect } from '@react-navigation/native'; // Runs logic when screen comes into focus
import { Audio } from 'expo-av'; // Used to play audio files

import { useLanguage } from '../context/LanguageContext'; // Global language context
import styles from '../styles/detectedSymptomsStyles'; // Styles for this screen

// API and utility helper files
import { extractSymptomsFromText } from '../services/triageApi';
import { saveBase64AudioToCache } from '../utils/base64Audio';
import { parseJsonParam, toJsonParam } from '../utils/routeParams';

// Main screen component: DetectedSymptomsScreen
export default function DetectedSymptomsScreen() {
  const router = useRouter(); // Router for navigation
  const { t, lang, setLang } = useLanguage(); // Translation function, current language, and language setter
  const params = useLocalSearchParams(); // Receives params from LoadingScreen

  // Convert JSON string params back into arrays
  const symptomsEn = parseJsonParam(params.symptoms_en, []);
  const symptomsWp = parseJsonParam(params.symptoms_wp, []);

  // Audio file path received from previous screen
  const initialVoiceFileUri = params.voice_file_uri || null;

  // Stores current audio file URI
  const [voiceFileUri, setVoiceFileUri] = useState(initialVoiceFileUri);

  // Controls language modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // Controls error modal visibility
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  // Stores selected language before confirmation
  const [selectedLang, setSelectedLang] = useState(null);

  // Prevents double clicking on Yes button
  const [loading, setLoading] = useState(false);

  // Shows loading state while audio is being updated
  const [audioLoading, setAudioLoading] = useState(false);

  // Keeps reference to currently playing audio
  const soundRef = useRef(null);

  // Animation value for language modal popup
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Reset loading when returning to this screen
  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, [])
  );

  // If Warlpiri is selected but no Warlpiri symptoms exist, show error
  useEffect(() => {
    if (lang === 'wp' && symptomsWp.length === 0) {
      setErrorModalVisible(true);
    }
  }, [lang, symptomsWp]);

  // Decide which symptoms should be displayed based on selected language
  const symptomsToShow =
    lang === 'wp'
      ? symptomsWp
      : symptomsEn.map((item) => {
          const key = item.toLowerCase().replaceAll(' ', '_');
          return t(key);
        });

  // Convert symptoms array into bullet list text
  const symptomText =
    symptomsToShow.length > 0
      ? symptomsToShow.map((item) => `• ${item}`).join('\n')
      : 'No symptoms detected';

  // Stops current audio and removes it from memory
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

  // Fetch translated audio from backend when language changes
  async function fetchAudioForLanguage(languageCode) {
    try {
      setAudioLoading(true);

      // Choose text to send based on selected language
      const textToSend =
        languageCode === 'wp' ? symptomsWp.join(' ') : symptomsEn.join(' ');

      // Send symptoms to backend and receive audio response
      const data = await extractSymptomsFromText(textToSend, languageCode);

      // Save base64 audio as local file
      const newFile = await saveBase64AudioToCache(
        data?.voice_b64,
        `voice_${languageCode}.wav`
      );

      // Update audio file URI
      if (newFile) {
        setVoiceFileUri(newFile);
      }
    } catch (error) {
      console.log('Audio update error:', error);
      Alert.alert('Audio Error', 'Could not update audio.');
    } finally {
      setAudioLoading(false);
    }
  }

  // Plays detected symptoms audio
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

      // Allows playback even if iPhone is in silent mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      // Stop previous audio before playing new audio
      await stopCurrentAudio();

      // Load and play audio file
      const { sound } = await Audio.Sound.createAsync(
        { uri: voiceFileUri },
        {
          shouldPlay: true,
          volume: 1.0,
        }
      );

      soundRef.current = sound;

      // Unload audio when playback finishes
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

  // Cleanup audio when leaving screen
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

  // Opens language selection popup
  const openModal = () => {
    setSelectedLang(null);
    setModalVisible(true);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  // Closes language popup
  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 120,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  // Confirms selected language and refreshes audio
  const confirmLanguage = async () => {
    if (!selectedLang) return;

    await stopCurrentAudio();
    setLang(selectedLang);
    closeModal();

    await fetchAudioForLanguage(selectedLang);
  };

  // Handles YES button and navigates to TellUsMore screen
  const handleYesPress = async () => {
    if (loading) return;

    if (lang === 'wp' && symptomsWp.length === 0) {
      setErrorModalVisible(true);
      return;
    }

    setLoading(true);
    await stopCurrentAudio();

    router.push({
      pathname: '/tellusmore',
      params: {
        symptoms_en: toJsonParam(symptomsEn),
        symptoms_wp: toJsonParam(symptomsWp),
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
            {/* Header */}
            <View style={styles.headerBar}>
              <Text style={styles.headerText}>{t('detected_title')}</Text>
            </View>

            {/* Symptoms display box */}
            <View style={styles.symptomBox}>
              <Text style={styles.symptomText}>{symptomText}</Text>

              {/* Speaker button */}
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

            {/* Confirmation question */}
            <Text style={styles.questionText}>{t('detected_question')}</Text>

            {/* Yes / No buttons */}
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

            {/* Back button */}
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

          {/* Footer navigation */}
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

          {/* Language selection modal */}
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

          {/* Error modal when no symptoms are detected */}
          <Modal transparent visible={errorModalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <View
                style={{
                  width: '90%',
                  backgroundColor: '#F5E6C8',
                  borderRadius: 12,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#5C2E0A',
                }}
              >
                <View
                  style={{
                    backgroundColor: '#8B2E0A',
                    paddingVertical: 18,
                    paddingHorizontal: 18,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      color: '#FFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                      flex: 1,
                      paddingRight: 12,
                    }}
                  >
                    No Symptoms Detected
                  </Text>

                  <Pressable
                    onPress={() => {
                      setErrorModalVisible(false);
                      router.replace('/textinput');
                    }}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 8,
                      borderWidth: 3,
                      borderColor: '#FFF',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 28,
                        fontWeight: 'bold',
                        lineHeight: 30,
                      }}
                    >
                      ×
                    </Text>
                  </Pressable>
                </View>

                <View style={{ padding: 22 }}>
                  <Text
                    style={{
                      color: '#5C2E0A',
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginBottom: 18,
                      lineHeight: 22,
                    }}
                  >
                    We could not detect any symptoms from your description.
                  </Text>

                  <Text
                    style={{
                      color: '#5C2E0A',
                      fontSize: 15,
                      marginBottom: 20,
                      lineHeight: 22,
                    }}
                  >
                    Please try describing your symptoms in more detail.
                  </Text>

                  <Pressable
                    style={{
                      alignSelf: 'flex-end',
                      backgroundColor: '#8B2E0A',
                      paddingHorizontal: 28,
                      paddingVertical: 10,
                      borderRadius: 22,
                    }}
                    onPress={() => {
                      setErrorModalVisible(false);
                      router.replace('/textinput');
                    }}
                  >
                    <Text
                      style={{
                        color: '#FFF',
                        fontWeight: 'bold',
                        fontSize: 15,
                      }}
                    >
                      Ok
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}