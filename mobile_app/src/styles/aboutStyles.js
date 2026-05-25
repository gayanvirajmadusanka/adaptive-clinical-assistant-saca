// aboutStyles.js
// Purpose: Screen-specific styles for AboutScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  // Main scroll container
  container: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 95,
    paddingBottom: 50,
  },

  // Main heading
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },

  // SACA logo
  logo: {
    width: 130,
    height: 130,
    borderRadius: 18,
    marginBottom: 22,
  },

  // Subtitle text
  subTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 22,
  },

  // Main about paragraph.
  paragraph: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#111',
    textAlign: 'justify',
    lineHeight: 30,
    marginBottom: 28,
    fontWeight: '500',
    width: '100%',
  },

  // Back button
  backButton: {
    width: 170,
    height: 58,
    backgroundColor: '#F5EAD8',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    elevation: 3,
  },

  // Back button pressed state
  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  // Back button content row
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Back arrow image
  backArrowImage: {
    width: 26,
    height: 26,
    marginRight: 8,
  },

  // Back button text
  backText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});