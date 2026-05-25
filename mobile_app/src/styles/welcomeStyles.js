// welcomeStyles.js
// Purpose: Styles for WelcomeScreen.
// Controls welcome layout, logo/image,
// title text, subtitle text, and start button styling.

import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({

  // Safe area background
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  // Main wrapper with status bar spacing
  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

  // Full-screen background image area
  background: {
    flex: 1,
  },

  // Main centered screen container
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  // ===============================
  // Logo / Main Image
  // ===============================

  // Welcome screen logo/image
  logo: {
    width: 210,
    height: 210,
    resizeMode: 'contain',
    marginBottom: 28,
  },

  // ===============================
  // Text Section
  // ===============================

  // Main welcome title
  title: {
    fontSize: 34,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
  },

  // Subtitle / description text
  subtitle: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: '#3D2A1A',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 42,
    paddingHorizontal: 10,
  },

  // ===============================
  // Start Button
  // ===============================

  // Main start button container
  startButton: {
    width: 220,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E3AD35',
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  // Start button pressed effect
  startButtonPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  // Start button text
  startButtonText: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Pressed start button text color
  startButtonTextPressed: {
    color: '#FFF',
  },
});