// Styles for DetectedSymptomsScreen.
// Defines the detected symptoms card, audio speaker button, YES/NO buttons, footer, and language/error modals.

import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  // Main safe area background.
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  // Full screen wrapper with status bar spacing.
  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

  // Background image container.
  background: {
    flex: 1,
  },

  // Main content area.
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 80,
  },

  // Header bar behind the screen title.
  headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#C87936',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },

  // Header text style.
  headerText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Box that displays detected symptoms and the speaker button.
  symptomBox: {
    width: '92%',
    minHeight: 140,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: '#B9A98E',
    borderRadius: 8,
    padding: 25,
    marginBottom: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Detected symptom bullet list text.
  symptomText: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: '#000',
    lineHeight: 30,
    flex: 1,
  },

  // Circular speaker button container.
  speakerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  // Speaker button pressed effect.
  speakerPressed: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.9 }],
  },

  // Speaker icon size.
  speakerIcon: {
    width: 35,
    height: 35,
  },

  // Confirmation question text.
  questionText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#111',
    marginBottom: 12,
  },

  // Row for YES and NO buttons.
  buttonRow: {
    flexDirection: 'row',
    gap: 25,
    marginBottom: 30,
  },

  // YES/NO button style.
  choiceButton: {
    width: 100,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8D5A0',
    borderWidth: 1.5,
    borderColor: '#D4A96A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // YES/NO button pressed state.
  choicePressed: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.96 }],
  },

  // YES/NO button label.
  choiceText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
  },

  // Back button style.
  backButton: {
    width: 150,
    height: 55,
    backgroundColor: '#F5EAD8',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  // Back button pressed state.
  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  // Back button text.
  backText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Bottom footer navigation bar.
  footer: {
    height: 55,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  // Individual footer item.
  footerItem: {
    alignItems: 'center',
  },

  // Footer icon style.
  footerIcon: {
    fontSize: 22,
    fontFamily: FONTS.regular,
    color: '#fff',
  },

  // Footer label style.
  footerText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },

  // Dark transparent background behind modal.
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

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

  // Modal title text.
  modalTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2C1A0E',
    marginBottom: 20,
  },

  // Language option button.
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

  // Selected language option.
  languageOptionSelected: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.97 }],
  },

  // Language option text.
  languageOptionText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
  },

  // Selected language option text.
  languageOptionTextSelected: {
    color: '#F5E6C8',
  },

  // Modal confirmation message.
  confirmText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#2C1A0E',
    marginTop: 8,
    marginBottom: 18,
    textAlign: 'center',
  },

  // Row for modal buttons.
  modalButtonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Cancel button in modal.
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

  // Cancel button text.
  cancelText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Confirm button in modal.
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

  // Confirm button text.
  confirmButtonText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Disabled button opacity.
  disabledButton: {
    opacity: 0.45,
  },
});
