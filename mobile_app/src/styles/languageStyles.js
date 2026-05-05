// Styles for LanguageScreen.
// Defines language selection layout, selected button state, and bilingual screen typography.

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

    // Background image area.
background: {
    flex: 1,
  },

    // Centered language selection container.
container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 120,
  },

    // Language screen title.
title: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 80,
  },

    // Base language button.
button: {
    width: '78%',
    height: 75,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  /* DEFAULT (ENGLISH STYLE FOR BOTH) */
    // Default unselected button state.
defaultButton: {
    backgroundColor: '#E8D5A0',
    borderColor: '#D4A96A',
  },

    // Default unselected text color.
defaultText: {
    color: '#5C2E0A',
  },

  /* SELECTED → WARLPIRI STYLE */
    // Selected language button state.
selectedButton: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.96 }],
  },

    // Selected language text color.
selectedText: {
    color: '#F5E6C8',
  },

    // Language option text.
text: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },
});
