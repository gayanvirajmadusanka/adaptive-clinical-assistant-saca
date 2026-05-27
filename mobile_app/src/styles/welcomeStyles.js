// welcomeStyles.js
// Styles for WelcomeScreen.
// Defines logo, welcome text, start button, about link, and full-screen background layout.

// Import StyleSheet and StatusBar from React Native
import { StyleSheet, StatusBar } from 'react-native';

// Import custom font constants
import { FONTS } from '../constants/fonts';

// Export all styles for WelcomeScreen
export default StyleSheet.create({
  
  // Main safe area background.
  // Prevents overlap with phone notch/status bar.
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  // Wrapper with status bar spacing.
  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

  // Full-screen background image container.
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Centered welcome screen content.
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  // SACA logo image.
  logo: {
    width: 220,
    height: 220,
    marginBottom: 15,
    borderRadius: 20,
  },

  // Full application name text.
  appName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 55,
    color: '#111',
  },

  // Welcome message text.
  welcomeText: {
    fontSize: 36,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60,
    color: '#111',
    lineHeight: 42,
  },

  // Main Start button style.
  startButton: {
    backgroundColor: '#E3AD35',
    width: 250,
    height: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 35,
    elevation: 4,
  },

  // Start button pressed effect.
  startPressedRed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.96 }],
  },

  // Start button label text.
  startButtonText: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    lineHeight: 32,
    marginHorizontal: 12,
  },

  // Sun icon shown beside Start text.
  sunIcon: {
    width: 46,
    height: 46,
  },

  // About link text below button.
  aboutText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#8B3A1C',
    textDecorationLine: 'underline',
  },
});