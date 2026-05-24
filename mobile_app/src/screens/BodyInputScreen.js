// BodyInputScreen.js
// Purpose: Lets user choose a body part using visible red dots or the body part list.
// AppScreen handles SafeArea, background, footer, and language modal.
// Speaker icon plays local body part audio from assets/audio/body_parts.
// Tooltip text now changes based on selected language.

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import AppScreen from '../components/AppScreen';
import { useLanguage } from '../context/LanguageContext';
import bodyMap from '../../assets/data/body_map.json';
import styles from '../styles/bodyInputStyles';

import {
  playLocalAudio,
  getBodyPartAudio,
  stopLocalAudio,
} from '../utils/localAudio';

export default function BodyInputScreen() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const [gender, setGender] = useState('male');
  const [selectedDot, setSelectedDot] = useState(null);

  const bodyParts = useMemo(() => Object.values(bodyMap), []);

  useEffect(() => {
    return () => {
      stopLocalAudio();
    };
  }, []);

  const getLabel = (part) => {
    return lang === 'wp'
      ? part?.label_wp || part?.label_en
      : part?.label_en;
  };

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

  const playBodyPartAudio = async (partKey) => {
    const audioKey = partKey === 'general' ? 'whole_body' : partKey;
    const audioSource = getBodyPartAudio(audioKey, lang);
    await playLocalAudio(audioSource);
  };

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

  const handleDotPress = (partKey) => {
    setSelectedDot(partKey);

    setTimeout(() => {
      openSymptoms(partKey);
    }, 700);
  };

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
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>{t('show')}</Text>
        </View>

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

        <Text style={styles.hintText}>
          {t('tap_red_dot') || 'Tap a red dot or choose from the list'}
        </Text>

        <View style={styles.mainCard}>
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

            {/* JAW */}
            <Pressable
              style={[
                styles.bodyDot,
                styles.dotJaw,
                selectedDot === 'jaw' && styles.dotPressed,
              ]}
              onPress={() => handleDotPress('jaw')}
            />

            {/* NOSE */}
            <Pressable
              style={[
                styles.bodyDot,
                styles.dotNose,
                selectedDot === 'nose' && styles.dotPressed,
              ]}
              onPress={() => handleDotPress('nose')}
            />

            {/* NECK */}
            <Pressable
              style={[
                styles.bodyDot,
                styles.dotNeck,
                selectedDot === 'neck' && styles.dotPressed,
              ]}
              onPress={() => handleDotPress('neck')}
            />

            {/* THROAT */}
            <Pressable
              style={[
                styles.bodyDot,
                styles.dotThroat,
                selectedDot === 'throat' && styles.dotPressed,
              ]}
              onPress={() => handleDotPress('throat')}
            />

            {/* CHEST */}
            <Pressable
              style={[
                styles.bodyDot,
                styles.dotChest,
                selectedDot === 'chest' && styles.dotPressed,
              ]}
              onPress={() => handleDotPress('chest')}
            />

            {/* STOMACH */}
            <Pressable
              style={[
                styles.bodyDot,
                styles.dotStomach,
                selectedDot === 'stomach' && styles.dotPressed,
              ]}
              onPress={() => handleDotPress('stomach')}
            />

            {/* ARM */}
            <Pressable
              style={[
                styles.bodyDot,
                styles.dotArm,
                selectedDot === 'arm' && styles.dotPressed,
              ]}
              onPress={() => handleDotPress('arm')}
            />

            {/* BACK */}
            <Pressable
              style={[
                styles.bodyDot,
                styles.dotBack,
                selectedDot === 'back' && styles.dotPressed,
              ]}
              onPress={() => handleDotPress('back')}
            />

            {/* WHOLE BODY */}
            <Pressable
              style={[
                styles.bodyDot,
                styles.dotWholeBody,
                selectedDot === 'general' && styles.dotPressed,
              ]}
              onPress={() => handleDotPress('general')}
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
                  selectedDot === 'nose' && styles.tooltipNose,
                  selectedDot === 'jaw' && styles.tooltipJaw,
                  selectedDot === 'neck' && styles.tooltipNeck,
                  selectedDot === 'throat' && styles.tooltipThroat,
                  selectedDot === 'chest' && styles.tooltipChest,
                  selectedDot === 'stomach' && styles.tooltipStomach,
                  selectedDot === 'back' && styles.tooltipBack,
                  selectedDot === 'arm' && styles.tooltipArm,
                  selectedDot === 'general' && styles.tooltipWholeBody,
                ]}
              >
                <Text style={styles.tooltipText}>
                  {getTooltipLabel(selectedDot)}
                </Text>
              </View>
            )}
          </View>

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