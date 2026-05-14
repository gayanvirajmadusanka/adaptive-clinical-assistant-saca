// BodyInputScreen.js
// Purpose: Lets user choose a body part by tapping body image or body part list.

import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';
import bodyMap from '../../assets/data/body_map.json';
import styles from '../styles/bodyInputStyles';

export default function BodyInputScreen() {
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();

  const [gender, setGender] = useState('male');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const bodyParts = useMemo(() => Object.values(bodyMap), []);

  const getLabel = (part) => {
    return lang === 'wp' ? part.label_wp : part.label_en;
  };

  const changeGender = (selectedGender) => {
    console.log('SELECTED GENDER:', selectedGender);
    setGender(selectedGender);
  };

  const openSymptoms = (partKey) => {
    router.push({
      pathname: '/bodysymptoms',
      params: {
        part_key: partKey,
      },
    });
  };

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

  const bodyImage =
    gender === 'male'
      ? require('../../assets/images/male_image.png')
      : require('../../assets/images/female_image.png');

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
              <Pressable onPress={() => router.back()} style={styles.backCircle}>
                <Text style={styles.backArrow}>←</Text>
              </Pressable>

              <Text style={styles.headerText}>SHOW</Text>
            </View>

            <View style={styles.genderToggle}>
              <Pressable
                hitSlop={10}
                style={[
                  styles.genderButton,
                  gender === 'male' && styles.genderButtonActive,
                ]}
                onPress={() => changeGender('male')}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === 'male' && styles.genderTextActive,
                  ]}
                >
                  Male
                </Text>
              </Pressable>

              <Pressable
                hitSlop={10}
                style={[
                  styles.genderButton,
                  gender === 'female' && styles.genderButtonActive,
                ]}
                onPress={() => changeGender('female')}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === 'female' && styles.genderTextActive,
                  ]}
                >
                  Female
                </Text>
              </Pressable>
            </View>

            <Text style={styles.hintText}>
              Tap on the body or choose from the list
            </Text>

            <View style={styles.mainCard}>
              <View style={styles.bodyPanel}>
                <Image
                  key={gender}
                  source={bodyImage}
                  style={styles.bodyImage}
                  resizeMode="contain"
                />

                <Pressable
                  style={[styles.bodyZone, styles.zoneHead]}
                  onPress={() => openSymptoms('head')}
                />

                <Pressable
                  style={[styles.bodyZone, styles.zoneChest]}
                  onPress={() => openSymptoms('chest')}
                />

                <Pressable
                  style={[styles.bodyZone, styles.zoneStomach]}
                  onPress={() => openSymptoms('stomach')}
                />

                <Pressable
                  style={[styles.bodyZone, styles.zoneLeftArm]}
                  onPress={() => openSymptoms('arm')}
                />

                <Pressable
                  style={[styles.bodyZone, styles.zoneRightArm]}
                  onPress={() => openSymptoms('arm')}
                />

                <Pressable
                  style={[styles.bodyZone, styles.zoneGeneral]}
                  onPress={() => openSymptoms('general')}
                />
              </View>

              <View style={styles.partsPanel}>
                <Text style={styles.partsTitle}>Body Parts</Text>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.partsList}
                >
                  {bodyParts.map((part) => {
                    const partKey = part.id === 'whole_body' ? 'general' : part.id;

                    return (
                      <Pressable
                        key={partKey}
                        style={({ pressed }) => [
                          styles.partCard,
                          pressed && styles.partCardPressed,
                        ]}
                        onPress={() => openSymptoms(partKey)}
                      >
                        <Text style={styles.partText} numberOfLines={1}>
                          {getLabel(part)}
                        </Text>

                        <View style={styles.speakerCircle}>
                          <Image
                            source={require('../../assets/images/speaker.png')}
                            style={styles.speakerIcon}
                            resizeMode="contain"
                          />
                        </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </View>

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