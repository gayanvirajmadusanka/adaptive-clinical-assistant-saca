// BodyInputScreen.js
// Lets user select body part using red dots or body list.

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import bodyMap from '../../assets/data/body_map.json';
import styles from '../styles/bodyInputStyles';

// Local audio helpers
import {
  playLocalAudio,
  getBodyPartAudio,
  stopLocalAudio,
} from '../utils/localAudio';

export default function BodyInputScreen() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  // Selected gender and body dot
  const [gender, setGender] = useState('male');
  const [selectedDot, setSelectedDot] = useState(null);

  // Convert body map object to array
  const bodyParts = useMemo(() => Object.values(bodyMap), []);

  // Stop audio when screen closes
  useEffect(() => {
    return () => {
      stopLocalAudio();
    };
  }, []);

  // Get translated body label
  const getLabel = (part) => {
    return lang === 'wp'
      ? part?.label_wp || part?.label_en
      : part?.label_en;
  };

  // Get tooltip label
  const getTooltipLabel = (partKey) => {
    const actualKey = partKey === 'general' ? 'whole_body' : partKey;

    const part = bodyMap[actualKey];

    if (!part) {
      return '';
    }

    return lang === 'wp'
      ? part?.label_wp || part?.label_en
      : part?.label_en;
  };

  // Play body part audio
  const playBodyPartAudio = async (partKey) => {
    const audioKey = partKey === 'general' ? 'whole_body' : partKey;

    const audioSource = getBodyPartAudio(audioKey, lang);

    await playLocalAudio(audioSource);
  };

  // Open symptom screen
  const openSymptoms = async (partKey) => {
    await stopLocalAudio();

    router.push({
      pathname: '/bodysymptoms',
      params: {
        part_key: partKey,
        gender,
      },
    });
  };

  // Handle red dot press
  const handleDotPress = (partKey) => {
    setSelectedDot(partKey);

    setTimeout(() => {
      openSymptoms(partKey);
    }, 700);
  };

  // Choose body image
  const bodyImage =
    gender === 'male'
      ? require('../../assets/images/male_image.png')
      : require('../../assets/images/female_image.png');

  return (
    <AppScreen
      onHomePress={async () => {
        await stopLocalAudio();
        router.replace('/input');
      }}
      beforeLanguageChange={async () => {
        await stopLocalAudio();
      }}
    >
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>{t('show')}</Text>
        </View>

        {/* Gender toggle */}
        <View style={styles.genderToggle}>
          <Pressable
            hitSlop={10}
            style={[
              styles.genderButton,
              gender === 'male' && styles.genderButtonActive,
            ]}
            onPress={() => setGender('male')}
          >
            <Text
              style={[
                styles.genderText,
                gender === 'male' && styles.genderTextActive,
              ]}
            >
              {t('male') || 'Male'}
            </Text>
          </Pressable>

          <Pressable
            hitSlop={10}
            style={[
              styles.genderButton,
              gender === 'female' && styles.genderButtonActive,
            ]}
            onPress={() => setGender('female')}
          >
            <Text
              style={[
                styles.genderText,
                gender === 'female' && styles.genderTextActive,
              ]}
            >
              {t('female') || 'Female'}
            </Text>
          </Pressable>
        </View>

        {/* Hint text */}
        <Text style={styles.hintText}>
          {t('tap_red_dot') || 'Tap a red dot or choose from the list'}
        </Text>

        <View style={styles.mainCard}>

          {/* Body image section */}
          <View style={styles.bodyPanel}>
            <Image
              key={gender}
              source={bodyImage}
              style={styles.bodyImage}
              resizeMode="contain"
            />

            {/* HEAD */}
            <Pressable
              style={[
                styles.bodyDot,
                styles.dotHead,
                selectedDot === 'head' && styles.dotPressed,
              ]}
              onPress={() => handleDotPress('head')}
            />

            {/* EYE */}
            <Pressable
              style={[
                styles.bodyDot,
                styles.dotEye,
                selectedDot === 'eye' && styles.dotPressed,
              ]}
              onPress={() => handleDotPress('eye')}
            />

            {/* EAR */}
            <Pressable
              style={[
                styles.bodyDot,
                styles.dotEar,
                selectedDot === 'ear' && styles.dotPressed,
              ]}
              onPress={() => handleDotPress('ear')}
            />

            {/* TOOLTIP */}
            {selectedDot && (
              <View
                pointerEvents="none"
                style={[
                  styles.tooltip,
                  selectedDot === 'head' && styles.tooltipHead,
                  selectedDot === 'eye' && styles.tooltipEye,
                  selectedDot === 'ear' && styles.tooltipEar,
                ]}
              >
                <Text style={styles.tooltipText}>
                  {getTooltipLabel(selectedDot)}
                </Text>
              </View>
            )}
          </View>

          {/* Body part list */}
          <View style={styles.partsPanel}>
            <Text style={styles.partsTitle}>
              {t('body_parts') || 'Body Parts'}
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.partsList}
            >
              {bodyParts.map((part) => {
                const partKey =
                  part.id === 'whole_body'
                    ? 'general'
                    : part.id;

                const audioKey =
                  part.id === 'whole_body'
                    ? 'whole_body'
                    : part.id;

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

                    {/* Speaker button */}
                    <Pressable
                      style={({ pressed }) => [
                        styles.speakerCircle,
                        pressed && styles.speakerPressed,
                      ]}
                      onPress={(event) => {
                        event.stopPropagation();
                        playBodyPartAudio(audioKey);
                      }}
                    >
                      <Image
                        source={require('../../assets/images/speaker.png')}
                        style={styles.speakerIcon}
                        resizeMode="contain"
                      />
                    </Pressable>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Back button */}
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backPressedGrey,
          ]}
          onPress={async () => {
            await stopLocalAudio();
            router.back();
          }}
        >
          <View style={styles.backButtonContent}>
            <Image
              source={require('../../assets/images/back-arrow.png')}
              style={styles.backArrowImage}
              resizeMode="contain"
            />

            <Text style={styles.backText}>
              {t('back')}
            </Text>
          </View>
        </Pressable>
      </View>
    </AppScreen>
  );
}