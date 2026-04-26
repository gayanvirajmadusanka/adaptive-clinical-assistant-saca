import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/welcomeStyles';

export default function WelcomeScreen() {
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

            {/* Logo */}
            <Image
              source={require('../../assets/images/SACA_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* App Name */}
            <Text style={styles.appName}>
              Smart Adaptive Clinical Assistant (SACA)
            </Text>

            {/* Welcome Text */}
            <Text style={styles.welcomeText}>
              Welcome{'\n'}Nyampu nyinami
            </Text>

            {/* Start Button with GREEN FLASH */}
            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.startPressedGreen,
              ]}
              onPress={() => router.push('/language')}
            >
              <Text style={styles.startButtonText}>
                Start{'\n'}Yangka
              </Text>
            </Pressable>

            {/* About */}
            <TouchableOpacity onPress={() => router.push('/about')}>
              <Text style={styles.aboutText}>
                About SACA (Kurlu)
              </Text>
            </TouchableOpacity>

          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}