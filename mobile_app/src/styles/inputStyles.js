// inputStyles.js
// Purpose: Screen-specific styles for InputScreen.
// Shared SafeArea, background, footer, and language modal styles are now in commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  // Main centered container for input cards.
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 90,
  },

  // Main screen title.
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#111',
  },

  // Subtitle/instruction text.
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 30,
    color: '#333',
  },

  // Base style for all input method cards.
  card: {
    width: 160,
    height: 130,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,

    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // Text input card color.
  textCard: {
    backgroundColor: '#6F8F83',
    borderColor: '#2E3D36',
  },

  // Voice input card color.
  voiceCard: {
    backgroundColor: '#D9C27A',
    borderColor: '#7A6420',
  },

  // Body map card color.
  bodyCard: {
    backgroundColor: '#C85B3A',
    borderColor: '#6E1F12',
  },

  // Card press feedback effect.
  cardPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  // Input card icon.
  cardImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },

  // Input card label.
  cardText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
});