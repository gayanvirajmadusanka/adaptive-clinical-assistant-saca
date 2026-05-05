// Styles for InputScreen.
// Defines input option cards, footer navigation, language modal, and press effects.

import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
    // Main safe area background.
safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

    // Screen wrapper with status bar spacing.
wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

    // Background image area.
background: {
    flex: 1,
  },

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

  /* 🔥 CARD BASE */
    // Base style for all input method cards.
card: {
    width: 160,
    height: 130,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,

    // Shadow
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  /* 🎨 COLORS */
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

  /* 👆 PRESS EFFECT */
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

  /* 🔻 FOOTER */
    // Bottom footer navigation bar.
footer: {
    height: 55,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  footerItem: {
    alignItems: 'center',
  },

  footerIcon: {
    fontSize: 22,
    fontFamily: FONTS.regular,
    color: '#fff',
  },

  footerText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },

  /* 🔥 MODAL OVERLAY */
    // Overlay behind language modal.
modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  /* 🔥 MODAL BOX */
    // Language selection modal box.
languageModal: {
    width: '90%',
    backgroundColor: '#F5E6C8',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#8B3A1C',
    padding: 22,
    alignItems: 'center',
    elevation: 8,
  },

  modalTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2C1A0E',
    marginBottom: 20,
  },

  languageOption: {
    width: '100%',
    height: 55,
    backgroundColor: '#E8D5A0',
    borderColor: '#D4A96A',
    borderWidth: 2,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  languageOptionSelected: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.97 }],
  },

  languageOptionText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
  },

  languageOptionTextSelected: {
    color: '#F5E6C8',
  },

  confirmText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#2C1A0E',
    marginTop: 8,
    marginBottom: 18,
    textAlign: 'center',
  },

  modalButtonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cancelButton: {
    width: '45%',
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#F5EAD8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  confirmButton: {
    width: '45%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmButtonText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  disabledButton: {
    opacity: 0.45,
  },
});
