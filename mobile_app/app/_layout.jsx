import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { NativeModules, Platform, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import {
  Kreon_400Regular,
  Kreon_700Bold,
} from '@expo-google-fonts/kreon';

import { LanguageProvider } from '../src/context/LanguageContext';

const IS_ANDROID_RELEASE = Platform.OS === 'android' && !__DEV__;
const HEALTH_URL = 'http://127.0.0.1:8000/health';
const POLL_INTERVAL_MS = 600;
const POLL_TIMEOUT_MS  = 300000;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    KreonRegular: Kreon_400Regular,
    KreonBold: Kreon_700Bold,
  });

  // On Android release builds, wait for the Chaquopy Python server to be ready
  // before rendering the app. First launch can take 20–30s while Chaquopy unpacks.
  const [serverReady, setServerReady] = useState(!IS_ANDROID_RELEASE);

  useEffect(() => {
    if (!IS_ANDROID_RELEASE) return;

    try {
      const { PythonServer } = NativeModules;
      if (PythonServer) PythonServer.start();
    } catch (e) {
      console.warn('PythonServer NativeModule not available:', e);
    }

    const startTime = Date.now();
    const poll = setInterval(async () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > POLL_TIMEOUT_MS) {
        clearInterval(poll);
        setServerReady(true);
        return;
      }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      try {
        const res = await fetch(HEALTH_URL, { method: 'GET', signal: controller.signal });
        clearTimeout(timer);
        if (res.ok) {
          clearInterval(poll);
          setServerReady(true);
        }
      } catch (_) {
        clearTimeout(timer);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(poll);
  }, []);

  if (!fontsLoaded) return null;

  if (!serverReady) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#8B2E0A" />
        <Text style={styles.splashText}>Starting SACA…</Text>
        <Text style={styles.splashSub}>First launch may take 1–3 minutes</Text>
      </View>
    );
  }

  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#F5EAD8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  splashText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3B1A08',
  },
  splashSub: {
    fontSize: 13,
    color: '#7A5C3A',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});