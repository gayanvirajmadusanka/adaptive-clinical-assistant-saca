import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';
import {
  Kreon_400Regular,
  Kreon_700Bold,
} from '@expo-google-fonts/kreon';

import { LanguageProvider } from '../src/context/LanguageContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    KreonRegular: Kreon_400Regular,
    KreonBold: Kreon_700Bold,
  });

  // Start the Chaquopy Python server on Android production builds
  useEffect(() => {
    if (Platform.OS === 'android' && !__DEV__) {
      try {
        const { PythonServer } = NativeModules;
        if (PythonServer) {
          PythonServer.start();
        }
      } catch (e) {
        console.warn('PythonServer NativeModule not available:', e);
      }
    }
  }, []);

  if (!fontsLoaded) return null;

  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LanguageProvider>
  );
}