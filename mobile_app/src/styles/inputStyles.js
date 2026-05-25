// inputStyles.js
// Purpose: Screen-specific styles for InputScreen.
// Shared SafeArea, background, footer,
// and language modal styles are in commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({

  // Main centered container for all input cards
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 110,
    paddingHorizontal: 20,
  },

  // Main screen title text
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#111',
  },

  // Subtitle / instruction text
  subtitle: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 45,
    color: '#333',
    lineHeight: 26,
  },

  // ===============================
  // Input Method Cards
  // ===============================

  // Base reusable style for all cards
  card: {
    width: 210, // Increased button width
    height: 145, // Increased button height
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 38,

    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // Text input card color theme
  textCard: {
    backgroundColor: '#5F7D6E',
    borderColor: '#2E3D36',
  },

  // Voice input card color theme
  voiceCard: {
    backgroundColor: '#D9C27A',
    borderColor: '#7A6420',
  },

  // Body map input card color theme
  bodyCard: {
    backgroundColor: '#B5523B',
    borderColor: '#6E1F12',
  },

  // Card pressed animation/effect
  cardPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  // Card icon image
  cardImage: {
    width: 65,
    height: 65,
    marginBottom: 14,
  },

  // Card label text
  cardText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
});