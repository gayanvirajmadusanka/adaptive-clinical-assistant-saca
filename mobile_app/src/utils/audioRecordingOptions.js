// audioRecordingOptions.js

// Import Audio module from expo-av
// Used for configuring voice recording settings
import { Audio } from 'expo-av';


// WAV recording configuration options
// Used by VoiceInputScreen and other voice recording flows
export const WAV_RECORDING_OPTIONS = {

  // Android recording settings
  android: {

    // Output audio file extension
    extension: '.mp4',

    // Audio output container format
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,

    // Audio encoder type
    audioEncoder: Audio.AndroidAudioEncoder.AAC,

    // Audio sample rate (higher = better quality)
    sampleRate: 44100,

    // Mono audio recording
    numberOfChannels: 1,

    // Audio bitrate quality
    bitRate: 128000,
  },


  // iOS recording settings
  ios: {

    // Output audio file extension
    extension: '.wav',

    // Linear PCM format for WAV audio
    outputFormat: Audio.IOSOutputFormat.LINEARPCM,

    // Maximum audio quality
    audioQuality: Audio.IOSAudioQuality.MAX,

    // Audio sample rate
    sampleRate: 44100,

    // Mono audio recording
    numberOfChannels: 1,

    // Audio bitrate
    bitRate: 128000,

    // PCM bit depth
    linearPCMBitDepth: 16,

    // Little-endian byte order
    linearPCMIsBigEndian: false,

    // Store PCM as integer instead of float
    linearPCMIsFloat: false,
  },


  // Web recording settings
  // Empty because web recording uses browser defaults
  web: {},
};