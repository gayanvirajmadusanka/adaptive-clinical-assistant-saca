import React, { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/loadingStyles';

export default function LoadingSeverityScreen() {
  const router = useRouter();
  const { painLevel, duration } = useLocalSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace({
        pathname: '/result',
        params: {
          painLevel,
          duration,
        },
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [painLevel, duration]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />

      <View style={styles.wrapper}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.container}>
            <Text style={styles.topText}>{t('loading_severity')}</Text>

            <View style={styles.circle}>
              <View style={styles.progressArc} />
              <Text style={styles.percent}>75%</Text>
              <Text style={styles.loadingText}>{t('loading')}</Text>
            </View>

            <Text style={styles.bottomText}>{t('loading_wait')}</Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}