// WelcomeScreen.js
// Purpose: First screen of the app.
// Displays logo, app name, welcome text, start button, and About navigation.

// React and React Native imports used to build this screen component.
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
import { useRouter } from 'expo-router'; // Used for navigation between screens
import styles from '../styles/welcomeStyles'; // Import styles for this screen

// Main Welcome Screen Component
// Main screen component: WelcomeScreen
export default function WelcomeScreen() {
  const router = useRouter(); // Initialize router for navigation

  return (
    // Safe area to avoid notch issues on mobile devices
    <SafeAreaView style={styles.safeArea}>
      
      {/* Status bar styling */}
      <StatusBar barStyle="dark-content" backgroundColor="#F5EAD8" />

      <View style={styles.wrapper}>
        
        {/* Background image for full screen */}
        <ImageBackground
          source={require('../../assets/images/background.png')} // Background image
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.container}>

            {/* App Logo */}
            <Image
              source={require('../../assets/images/SACA_logo.png')} // Logo image
              style={styles.logo}
              resizeMode="contain"
            />

            {/* App Name */}
            <Text style={styles.appName}>
              Smart Adaptive Clinical Assistant (SACA)
            </Text>

            {/* Welcome Text (English + Warlpiri) */}
            <Text style={styles.welcomeText}>
              Welcome{'\n'}Nyampu nyinami
            </Text>

            {/* Start Button */}
            {/* Pressable allows dynamic styling when pressed */}
            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.startPressedRed, // Change style when pressed
              ]}
              onPress={() => router.push('/language')} // Navigate to Language Selection Screen
            >
              <Text style={styles.startButtonText}>
                Start{'\n'}Yangka
              </Text>
            </Pressable>

            {/* About Section */}
            {/* TouchableOpacity used for simple clickable text */}
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