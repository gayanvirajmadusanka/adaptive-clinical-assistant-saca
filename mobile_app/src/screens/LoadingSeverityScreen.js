import React, { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/loadingStyles';

export default function LoadingSeverityScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/result');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
            <Text style={styles.topText}>Checking your Severity...</Text>

            <View style={styles.circle}>
              <View style={styles.progressArc} />
              <Text style={styles.percent}>75%</Text>
              <Text style={styles.loadingText}>LOADING</Text>
            </View>

            <Text style={styles.bottomText}>
              This may take a few minutes please wait...
            </Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}