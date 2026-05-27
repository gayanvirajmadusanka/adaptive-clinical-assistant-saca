// base64Audio.js

// Import Expo FileSystem module
// Used for reading and saving audio files
import * as FileSystem from 'expo-file-system/legacy';


// ----------------------------------------------------
// readAudioFileAsBase64(audioUri)
// ----------------------------------------------------
// Purpose:
// Reads a local audio file and converts it into base64.
//
// Why:
// Backend API expects audio data as a base64 string.
//
// Parameters:
// audioUri → Local file path of recorded audio
//
// Returns:
// Base64 encoded audio string
// ----------------------------------------------------
export async function readAudioFileAsBase64(audioUri) {

  // Check if audio path exists
  if (!audioUri) {
    throw new Error('Audio URI is missing');
  }

  // Get file information from device storage
  const fileInfo = await FileSystem.getInfoAsync(audioUri);

  // Debug log for checking file details
  console.log('AUDIO FILE INFO:', fileInfo);

  // If file does not exist → throw error
  if (!fileInfo.exists) {
    throw new Error(`Audio file does not exist: ${audioUri}`);
  }

  // Read file and convert to base64 string
  const base64 = await FileSystem.readAsStringAsync(audioUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Return encoded audio
  return base64;
}


// ----------------------------------------------------
// cleanBase64Audio(audioBase64)
// ----------------------------------------------------
// Purpose:
// Removes unwanted base64 audio prefix.
//
// Example:
// data:audio/wav;base64,AAAA...
//
// becomes:
//
// AAAA...
//
// Why:
// Some APIs or audio players fail if prefix exists.
// ----------------------------------------------------
export function cleanBase64Audio(audioBase64 = '') {

  // Remove data URL prefix if present
  return String(audioBase64).replace(/^data:audio\/\w+;base64,/, '');
}


// ----------------------------------------------------
// saveBase64AudioToCache(audioBase64, filename)
// ----------------------------------------------------
// Purpose:
// Saves base64 audio into device cache as a playable file.
//
// Why:
// Expo Audio.Sound needs a real file URI to play audio.
//
// Parameters:
// audioBase64 → Base64 encoded audio
// filename    → Output file name
//
// Returns:
// Local cached file URI
// ----------------------------------------------------
export async function saveBase64AudioToCache(
  audioBase64,
  filename = 'voice_result.wav'
) {

  // If no audio exists → return null
  if (!audioBase64) return null;

  // Clean audio before saving
  const cleanAudio = cleanBase64Audio(audioBase64);

  // Create file path inside cache directory
  const fileUri = `${FileSystem.cacheDirectory}${filename}`;

  // Save base64 audio into cache file
  await FileSystem.writeAsStringAsync(fileUri, cleanAudio, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Return playable local file path
  return fileUri;
}