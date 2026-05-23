// AppFooter.js
// Purpose: Reusable footer used across SACA screens.
// It provides Home and Language actions so every screen does not repeat the same footer code.

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';
import commonStyles from '../styles/commonLayoutStyles';

export default function AppFooter({
  onHomePress,
  onLanguagePress,
  languageLabel,
}) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleHomePress = async () => {
    if (onHomePress) {
      await onHomePress();
      return;
    }

    router.replace('/input');
  };

  return (
    <View style={commonStyles.footer}>
      <Pressable style={commonStyles.footerItem} onPress={handleHomePress}>
        <Text style={commonStyles.footerIcon}>🏠</Text>
        <Text style={commonStyles.footerText}>{t('home')}</Text>
      </Pressable>

      <Pressable style={commonStyles.footerItem} onPress={onLanguagePress}>
        <Text style={commonStyles.footerIcon}>🌐</Text>
        <Text style={commonStyles.footerText}>
          {languageLabel || t('language')}
        </Text>
      </Pressable>
    </View>
  );
}
