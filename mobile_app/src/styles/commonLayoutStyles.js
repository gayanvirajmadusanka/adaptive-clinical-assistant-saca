// commonLayoutStyles.js
// Purpose: Shared reusable layout styles used across multiple screens.
// Includes SafeArea handling, background image styling,
// footer navigation, language modal, and common UI elements.

import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({

  // SafeArea wrapper to avoid notch/status bar overlap
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  // Main screen wrapper
  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

  // Full-screen background image
  background: {
    flex: 1,
    resizeMode: 'cover',
  },

  // Dark overlay sometimes used above background image
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  // Main content area
  content: {
    flex: 1,
  },

  // ===============================
  // Footer Navigation
  // ===============================

  // Footer container
  footer: {
    height: 78,
    backgroundColor: '#E8D7BE',
    borderTopWidth: 2,
    borderTopColor: '#B89B72',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },

  // Individual footer button
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
  },

  // Footer button pressed effect
  footerButtonPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.8,
  },

  // Footer icon image
  footerIcon: {
    width: 28,
    height: 28,
    marginBottom: 4,
  },

  // Footer text label
  footerText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2B1B12',
  },

  // Active footer text color
  footerTextActive: {
    color: '#8B1E0D',
  },

  // ===============================
  // Language Modal
  // ===============================

  // Dark overlay behind modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  // Main modal container
  languageModal: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: '#F5EAD8',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#B5523B',
    elevation: 8,
  },

  // Modal title text
  languageTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2B1B12',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Language option button
  languageButton: {
    width: '100%',
    height: 58,
    borderRadius: 28,
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  // Selected language button style
  languageButtonActive: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  // Language button pressed effect
  languageButtonPressed: {
    transform: [{ scale: 0.96 }],
  },

  // Language button text
  languageButtonText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Selected language text color
  languageButtonTextActive: {
    color: '#FFF',
  },

  // Close modal button
  closeButton: {
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#F5EAD8',
  },

  // Close button pressed effect
  closeButtonPressed: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  // Close button text
  closeButtonText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },
});