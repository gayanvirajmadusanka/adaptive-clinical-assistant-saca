// localAudio.js
// Purpose: Maps local audio files from assets/audio and plays them with expo-av.

import { Audio } from 'expo-av';

let currentSound = null;

export async function stopLocalAudio() {
  try {
    if (currentSound) {
      const sound = currentSound;
      currentSound = null;

      const status = await sound.getStatusAsync();

      if (status.isLoaded) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
    }
  } catch (error) {
    console.log('Stop local audio error:', error);
  }
}

export async function playLocalAudio(audioSource) {
  try {
    if (!audioSource) {
      console.log('No local audio source found.');
      return;
    }

    await stopLocalAudio();

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });

    const { sound } = await Audio.Sound.createAsync(audioSource, {
      shouldPlay: true,
      volume: 1.0,
    });

    currentSound = sound;

    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded && status.didJustFinish) {
        if (currentSound === sound) {
          currentSound = null;
        }

        await sound.unloadAsync();
      }
    });
  } catch (error) {
    console.log('Play local audio error:', error);
  }
}

export function getBodyPartAudio(partKey, lang = 'en') {
  const language = lang === 'wp' ? 'wp' : 'en';

  const audioMap = {
    arm: {
      en: require('../../assets/audio/body_parts/arm_en.wav'),
      wp: require('../../assets/audio/body_parts/arm_wp.wav'),
    },
    back: {
      en: require('../../assets/audio/body_parts/back_en.wav'),
      wp: require('../../assets/audio/body_parts/back_wp.wav'),
    },
    chest: {
      en: require('../../assets/audio/body_parts/chest_en.wav'),
      wp: require('../../assets/audio/body_parts/chest_wp.wav'),
    },
    ear: {
      en: require('../../assets/audio/body_parts/ear_en.wav'),
      wp: require('../../assets/audio/body_parts/ear_wp.wav'),
    },
    eye: {
      en: require('../../assets/audio/body_parts/eye_en.wav'),
      wp: require('../../assets/audio/body_parts/eye_wp.wav'),
    },
    head: {
      en: require('../../assets/audio/body_parts/head_en.wav'),
      wp: require('../../assets/audio/body_parts/head_wp.wav'),
    },
    jaw: {
      en: require('../../assets/audio/body_parts/jaw_en.wav'),
      wp: require('../../assets/audio/body_parts/jaw_wp.wav'),
    },
    neck: {
      en: require('../../assets/audio/body_parts/neck_en.wav'),
      wp: require('../../assets/audio/body_parts/neck_wp.wav'),
    },
    nose: {
      en: require('../../assets/audio/body_parts/nose_en.wav'),
      wp: require('../../assets/audio/body_parts/nose_wp.wav'),
    },
    stomach: {
      en: require('../../assets/audio/body_parts/stomach_en.wav'),
      wp: require('../../assets/audio/body_parts/stomach_wp.wav'),
    },
    throat: {
      en: require('../../assets/audio/body_parts/throat_en.wav'),
      wp: require('../../assets/audio/body_parts/throat_wp.wav'),
    },
    general: {
      en: require('../../assets/audio/body_parts/whole_body_en.wav'),
      wp: require('../../assets/audio/body_parts/whole_body_wp.wav'),
    },
    whole_body: {
      en: require('../../assets/audio/body_parts/whole_body_en.wav'),
      wp: require('../../assets/audio/body_parts/whole_body_wp.wav'),
    },
  };

  return audioMap[partKey]?.[language] || null;
}

export function getAnswerAudio(answerKey, lang = 'en') {
  const language = lang === 'wp' ? 'wp' : 'en';

  const audioMap = {
    yes: {
      en: require('../../assets/audio/answers/answer_yes_en.wav'),
      wp: require('../../assets/audio/answers/answer_yes_wp.wav'),
    },
    no: {
      en: require('../../assets/audio/answers/answer_no_en.wav'),
      wp: require('../../assets/audio/answers/answer_no_wp.wav'),
    },
    today: {
      en: require('../../assets/audio/answers/answer_today_en.wav'),
      wp: require('../../assets/audio/answers/answer_today_wp.wav'),
    },
    yesterday: {
      en: require('../../assets/audio/answers/answer_yesterday_en.wav'),
      wp: require('../../assets/audio/answers/answer_yesterday_wp.wav'),
    },
    adult: {
      en: require('../../assets/audio/answers/answer_adult_en.wav'),
      wp: require('../../assets/audio/answers/answer_adult_wp.wav'),
    },
    male: {
      en: require('../../assets/audio/answers/answer_male_en.wav'),
      wp: require('../../assets/audio/answers/answer_male_wp.wav'),
    },
    female: {
      en: require('../../assets/audio/answers/answer_female_en.wav'),
      wp: require('../../assets/audio/answers/answer_female_wp.wav'),
    },
  };

  return audioMap[answerKey]?.[language] || null;
}