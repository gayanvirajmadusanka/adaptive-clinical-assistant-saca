// Styles for WelcomeScreen.
// Defines logo, welcome text, start button, about link, and full-screen background layout.

import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
    // Main safe area background.
safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

    // Wrapper with status bar spacing.
wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

    // Full-screen background image.
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

    // Full app name text.
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

    // Start button.
startButton: {
    backgroundColor: '#E3AD35',
    width: 250,
    height: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    elevation: 4,
  },

    // Start button pressed state.
startPressedRed: {
  backgroundColor: '#8B3A1C', 
  borderColor: '#5C2E0A',     
  transform: [{ scale: 0.96 }],
},

    // Start button label.
startButtonText: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    lineHeight: 32,
  },

    // About link text.
aboutText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2E65B8',
    textDecorationLine: 'underline',
  },
});
