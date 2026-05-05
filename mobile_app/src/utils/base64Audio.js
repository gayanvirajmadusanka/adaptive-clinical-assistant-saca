import * as FileSystem from 'expo-file-system/legacy';

// Removes the data URL prefix from base64 audio if FastAPI sends one.
export function cleanBase64Audio(audioBase64 = '') {
  return String(audioBase64).replace(/^data:audio\/\w+;base64,/, '');
}

// Reads a local audio file and returns clean base64 text.
export async function readAudioFileAsBase64(audioUri) {
  const rawBase64 = await FileSystem.readAsStringAsync(audioUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return cleanBase64Audio(rawBase64);
}

// Saves base64 audio to the cache folder and returns the new file URI.
export async function saveBase64AudioToCache(audioBase64, fileName) {
  if (!audioBase64) return '';

  const cleanedBase64 = cleanBase64Audio(audioBase64);
  const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(fileUri, cleanedBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
}
