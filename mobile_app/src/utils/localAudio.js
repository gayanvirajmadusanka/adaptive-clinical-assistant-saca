// localAudio.js
// Purpose: Maps local audio files from assets/audio and plays them with expo-av.

// Import Audio module from expo-av
import { Audio } from 'expo-av';


// Stores currently playing sound instance
let currentSound = null;


// ----------------------------------------------------
// stopLocalAudio()
// ----------------------------------------------------
// Purpose:
// Stops and unloads currently playing local audio.
//
// Why:
// Prevents multiple audio files from playing together.
// Frees memory after playback.
// ----------------------------------------------------
export async function stopLocalAudio() {
  try {

    // Check if audio is currently playing
    if (currentSound) {

      // Save current sound reference
      const sound = currentSound;

      // Clear global sound variable
      currentSound = null;

      // Get playback status
      const status = await sound.getStatusAsync();

      // Stop and unload sound if loaded
      if (status.isLoaded) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
    }

  } catch (error) {

    // Debug error log
    console.log('Stop local audio error:', error);
  }
}


// ----------------------------------------------------
// playLocalAudio(audioSource)
// ----------------------------------------------------
// Purpose:
// Plays local audio from assets/audio.
//
// Parameters:
// audioSource → require(...) audio file
//
// Flow:
// 1. Stop previous audio
// 2. Configure audio mode
// 3. Create and play sound
// 4. Auto unload after playback finishes
// ----------------------------------------------------
export async function playLocalAudio(audioSource) {
  try {

    // Check if audio source exists
    if (!audioSource) {
      console.log('No local audio source found.');
      return;
    }

    // Stop any currently playing audio
    await stopLocalAudio();

    // Allow playback even when iPhone is silent
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });

    // Create and automatically play sound
    const { sound } = await Audio.Sound.createAsync(audioSource, {
      shouldPlay: true,
      volume: 1.0,
    });

    // Save current sound globally
    currentSound = sound;

    // Listen for playback completion
    sound.setOnPlaybackStatusUpdate(async (status) => {

      // If audio finished playing
      if (status.isLoaded && status.didJustFinish) {

        // Clear current sound reference
        if (currentSound === sound) {
          currentSound = null;
        }

        // Free memory
        await sound.unloadAsync();
      }
    });

  } catch (error) {

    // Debug error log
    console.log('Play local audio error:', error);
  }
}


// ----------------------------------------------------
// getBodyPartAudio(partKey, lang)
// ----------------------------------------------------
// Purpose:
// Returns correct body part audio file
// based on body part + selected language.
//
// Parameters:
// partKey → body part key
// lang    → 'en' or 'wp'
//
// Returns:
// Local audio require(...) path
// ----------------------------------------------------
export function getBodyPartAudio(partKey, lang = 'en') {

  // Default to English if invalid language
  const language = lang === 'wp' ? 'wp' : 'en';

  // Body part audio mapping
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

  // Return matching audio file
  return audioMap[partKey]?.[language] || null;
}


// ----------------------------------------------------
// getAnswerAudio(answerKey, lang)
// ----------------------------------------------------
// Purpose:
// Returns local audio for answer options.
//
// Example:
// yes/no/today/yesterday/adult/male/female
//
// Parameters:
// answerKey → answer identifier
// lang      → 'en' or 'wp'
//
// Returns:
// Local audio require(...) path
// ----------------------------------------------------
export function getAnswerAudio(answerKey, lang = 'en') {

  // Default to English if invalid language
  const language = lang === 'wp' ? 'wp' : 'en';

  // Answer audio mapping
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

  // Return matching answer audio
  return audioMap[answerKey]?.[language] || null;
}