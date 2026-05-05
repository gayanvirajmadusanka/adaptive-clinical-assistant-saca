// Styles for TextInputScreen.
// Defines text input form, header, continue/back buttons, footer, and language modal.

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

    // Text input screen container.
container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 80,
  },

    // Header bar containing title and icon.
headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#6F8F83',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

    // Header title text.
headerText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

    // Header icon image.
headerIcon: {
    position: 'absolute',
    right: 25,
    width: 30,
    height: 30,
  },

    // Text input outer box.
inputBox: {
    width: '88%',
    height: 250,
    backgroundColor: '#E6D7BF',
    borderRadius: 25,
    padding: 20,
    marginBottom: 45,
  },

    // Prompt above text input.
questionText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: '600',
    color: '#555',
    marginBottom: 18,
  },

    // Multiline input field.
textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#222',
    textAlignVertical: 'top',
  },

    // Continue button.
continueButton: {
    width: 230,
    height: 65,
    backgroundColor: '#E3AD35',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 25,
  },

  continuePressedGreen: {
    backgroundColor: '#8B3A1C', 
    borderColor: '#5C2E0A',     
    transform: [{ scale: 0.96 }],
  }, 

  continueText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 12,
  },

  arrow: {
    fontSize: 42,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

    // Back button.
backButton: {
    width: 140,
    height: 55,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#F5EAD8',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  backText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

    // Bottom footer navigation.
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

    // Language modal overlay.
modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

    // Language modal box.
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
