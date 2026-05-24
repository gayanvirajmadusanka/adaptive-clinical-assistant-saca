import * as FileSystem from 'expo-file-system/legacy';

export async function readAudioFileAsBase64(audioUri) {
  if (!audioUri) {
    throw new Error('Audio URI is missing');
  }

  const fileInfo = await FileSystem.getInfoAsync(audioUri);

  console.log('AUDIO FILE INFO:', fileInfo);

  if (!fileInfo.exists) {
    throw new Error(`Audio file does not exist: ${audioUri}`);
  }

  const base64 = await FileSystem.readAsStringAsync(audioUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return base64;
}

export function cleanBase64Audio(audioBase64 = '') {
  return String(audioBase64).replace(/^data:audio\/\w+;base64,/, '');
}

export async function saveBase64AudioToCache(audioBase64, filename = 'voice_result.wav') {
  if (!audioBase64) return null;

  const cleanAudio = cleanBase64Audio(audioBase64);
  const fileUri = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(fileUri, cleanAudio, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
}