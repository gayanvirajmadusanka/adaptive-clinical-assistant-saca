// Styles for LoadingScreen and LoadingSeverityScreen.
// Defines circular loading screen layout, percentage text, and status message styling.

// Import StyleSheet and StatusBar from React Native
import { StyleSheet, StatusBar } from 'react-native';

// Import custom font constants
import { FONTS } from '../constants/fonts';

// Export all styles for loading screens
export default StyleSheet.create({

  // Main safe area background
  // Prevents overlap with device notch/status bar
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  // Wrapper container with status bar spacing
  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

  // Background image/container style
  background: {
    flex: 1,
  },

  // Main centered container
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  // Main loading heading text
  topText: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 70,
  },

  // Circular loading animation wrapper
  circleWrapper: {
    width: 230,
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Inner content inside loading circle
  circleContent: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Percentage text inside circle
  percent: {
    fontSize: 42,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2B1B12',
  },

  // Small loading text below percentage
  loadingText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    letterSpacing: 3,
    color: '#8B5A2B',
    marginTop: 8,
  },

  // Bottom helper/status text
  bottomText: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: '#5C4A3A',
    textAlign: 'center',
    marginTop: 65,
    lineHeight: 26,
  },
});