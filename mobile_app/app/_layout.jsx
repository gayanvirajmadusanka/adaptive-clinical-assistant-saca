import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
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

  if (!fontsLoaded) return null;

  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LanguageProvider>
  );
}