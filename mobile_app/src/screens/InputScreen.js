import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StatusBar,
  SafeAreaView,
  Image,
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

            {/* Title */}
            <Text style={styles.title}>
              Hi, Tell us how you feel
            </Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              You can speak, type or use the body map to describe your symptoms.
            </Text>

            {/* TEXT BUTTON ✅ FIXED */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.textCard, // ✅ IMPORTANT
                pressed && styles.cardPressedGrey,
              ]}
              onPress={() => router.push('/textinput')}
            >
              <Image
                source={require('../../assets/images/text.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>TEXT</Text>
            </Pressable>

            {/* VOICE BUTTON */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.voiceCard,
                pressed && styles.cardPressedGrey,
              ]}
            >
              <Image
                source={require('../../assets/images/voice.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>VOICE</Text>
            </Pressable>

            {/* BODY BUTTON */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.bodyCard,
                pressed && styles.cardPressedGrey,
              ]}
            >
              <Image
                source={require('../../assets/images/body.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>BODY</Text>
            </Pressable>

          </View>

          {/* FOOTER */}
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