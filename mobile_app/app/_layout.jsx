import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Kreon_400Regular,
  Kreon_700Bold,
} from '@expo-google-fonts/kreon';

import { LanguageProvider } from '../src/context/LanguageContext';

const IS_ANDROID_RELEASE = Platform.OS === 'android' && !__DEV__;

function LoadingSplash() {
  const pulse = useRef(new Animated.Value(1)).current;
  const dot1  = useRef(new Animated.Value(0.3)).current;
  const dot2  = useRef(new Animated.Value(0.3)).current;
  const dot3  = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Gentle logo breathing
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.00, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    // Staggered dots
    const dotAnim = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1,   duration: 350, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 350, useNativeDriver: true }),
          Animated.delay(700 - delay),
        ])
      );
    dotAnim(dot1,   0).start();
    dotAnim(dot2, 233).start();
    dotAnim(dot3, 466).start();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={splash.bg}
      resizeMode="cover"
    >
      <View style={splash.overlay} />

      <View style={splash.content}>
        <Animated.Image
          source={require('../assets/images/SACA_logo.png')}
          style={[splash.logo, { transform: [{ scale: pulse }] }]}
          resizeMode="contain"
        />

        <Text style={splash.title}>SACA</Text>
        <Text style={splash.subtitle}>Smart Adaptive Clinical Assistant</Text>
        <Text style={splash.warlpiri}>Nyampu nyinami</Text>

        <View style={splash.dotsRow}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View key={i} style={[splash.dot, { opacity: dot }]} />
          ))}
        </View>

        <Text style={splash.hint}>First launch may take 1–3 minutes</Text>
      </View>
    </ImageBackground>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    KreonRegular: Kreon_400Regular,
    KreonBold: Kreon_700Bold,
  });

  const [serverReady, setServerReady] = useState(!IS_ANDROID_RELEASE);

  useEffect(() => {
    if (!IS_ANDROID_RELEASE) return;

    const { PythonServer } = NativeModules;
    if (!PythonServer) {
      setServerReady(true);
      return;
    }

    PythonServer.start()
      .then(() => setServerReady(true))
      .catch(() => setServerReady(true));
  }, []);

  if (!fontsLoaded) return null;

  if (!serverReady) return <LoadingSplash />;

  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LanguageProvider>
  );
}

const splash = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(245, 234, 216, 0.55)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'KreonBold',
    fontSize: 36,
    color: '#3B1A08',
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: 'KreonRegular',
    fontSize: 15,
    color: '#5C2E0A',
    textAlign: 'center',
  },
  warlpiri: {
    fontFamily: 'KreonRegular',
    fontSize: 14,
    color: '#7A5C3A',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B2E0A',
  },
  hint: {
    fontFamily: 'KreonRegular',
    fontSize: 12,
    color: '#7A5C3A',
    textAlign: 'center',
    marginTop: 4,
  },
});
