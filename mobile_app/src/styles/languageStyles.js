// languageStyles.js
// Purpose: Styles for LanguageScreen.
// Controls language selection layout,
// selected button states, and bilingual typography.

import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({

  // Safe area background to avoid notch overlap
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  // Main wrapper with status bar spacing
  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

  // Background image area
  background: {
    flex: 1,
  },

  // Main centered container
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 120,
  },

  // Screen title text
  title: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 80,
  },

  // ===============================
  // Language Buttons
  // ===============================

  // Base reusable language button
  button: {
    width: '78%',
    height: 75,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  // Default button style (English style)
  defaultButton: {
    backgroundColor: '#E8D5A0',
    borderColor: '#D4A96A',
  },

  // Default text color
  defaultText: {
    color: '#5C2E0A',
  },

  // Selected button style (Warlpiri style)
  selectedButton: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  // Selected text color
  selectedText: {
    color: '#F5E6C8',
  },

  // Language button text
  text: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },
});