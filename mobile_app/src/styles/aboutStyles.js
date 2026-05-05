// Styles for AboutScreen UI layout and typography
// Defines spacing, logo layout, paragraph text, and back button appearance.

import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  // Main safe area to avoid notch/status bar overlap.
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  // Wrapper for full screen layout and Android status bar spacing.
  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

  // Background image should cover the full screen.
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Main scroll content container.
  container: {
    alignItems: 'center',
    paddingHorizontal: 35,
    paddingTop: 55,
    paddingBottom: 40,
  },

  // Main About screen heading.
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 12,
  },

  // SACA logo display style.
  logo: {
    width: 120,
    height: 120,
    borderRadius: 18,
    marginBottom: 18,
  },

  // App name subtitle text.
  subTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 15,
  },

  // English and Warlpiri description paragraph text.
  paragraph: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#111',
    textAlign: 'left',
    lineHeight: 22,
    marginBottom: 18,
    fontWeight: '500',
  },

  // Back button container.
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

  // Back button pressed state.
  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  // Back button label.
  backText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});
