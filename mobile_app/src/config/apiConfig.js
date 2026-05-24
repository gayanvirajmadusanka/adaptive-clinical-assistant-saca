import { Platform } from 'react-native';

// Production Android APK uses the Chaquopy local server.
// Development builds (Expo Go / dev client) use the network dev server.
export const API_CONFIG = {
  BASE_URL: (Platform.OS === 'android' && !__DEV__)
    ? 'http://127.0.0.1:8000'
    : 'http://10.227.128.20:8000',
  TIMEOUT_MS: 30000,
};
