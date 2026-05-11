import * as FileSystem from 'expo-file-system/legacy';

// Reads local recorded audio file and converts it to base64
export async function readAudioFileAsBase64(audioUri) {
  const base64 = await FileSystem.readAsStringAsync(audioUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return base64;
}

// Removes data URL prefix if backend sends audio like data:audio/wav;base64,...
export function cleanBase64Audio(audioBase64 = '') {
  return String(audioBase64).replace(/^data:audio\/\w+;base64,/, '');
}

// Saves backend base64 voice response into cache so it can be played later
export async function saveBase64AudioToCache(audioBase64, filename = 'voice_result.wav') {
  if (!audioBase64) return null;

  const cleanAudio = cleanBase64Audio(audioBase64);
  const fileUri = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(fileUri, cleanAudio, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
}