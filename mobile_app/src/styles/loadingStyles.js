// loadingStyles.js
// Purpose: Styles for LoadingScreen and LoadingSeverityScreen.
// Controls circular loading UI, loading percentage,
// animated circle content, and loading status text.

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

  // Main centered loading container
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  // Top loading title text
  topText: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 70,
  },

  // Circular progress wrapper
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

  // Percentage number text
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

  // Bottom informational text
  bottomText: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: '#5C4A3A',
    textAlign: 'center',
    marginTop: 65,
    lineHeight: 26,
  },
});