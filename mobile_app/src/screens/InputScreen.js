import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/inputStyles';

export default function InputScreen() {
  const router = useRouter();

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
            <Text style={styles.title}>
              Hi, Tell us how you feel
            </Text>

            <Text style={styles.subtitle}>
              You can speak, type or use the body map to describe your symptoms.
            </Text>

            <Pressable style={styles.card}>
              <Text style={styles.cardIcon}>✍️</Text>
              <Text style={styles.cardText}>TEXT</Text>
            </Pressable>

            <Pressable style={[styles.card, styles.voiceCard]}>
              <Text style={styles.cardIcon}>🎤</Text>
              <Text style={styles.cardText}>VOICE</Text>
            </Pressable>

            <Pressable style={[styles.card, styles.bodyCard]}>
              <Text style={styles.cardIcon}>🧍</Text>
              <Text style={styles.cardText}>BODY</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={styles.footerItem}
              onPress={() => router.replace('/input')}
            >
              <Text style={styles.footerIcon}>🏠</Text>
              <Text style={styles.footerText}>Home</Text>
            </Pressable>

            <Pressable
              style={styles.footerItem}
              onPress={() => router.replace('/language')}
            >
              <Text style={styles.footerIcon}>🌐</Text>
              <Text style={styles.footerText}>Language</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}