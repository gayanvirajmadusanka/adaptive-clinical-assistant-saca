// commonLayoutStyles.js
// Shared layout styles used by AppScreen, AppFooter, and LanguageModal.

// Import StyleSheet and StatusBar from React Native
import { StyleSheet, StatusBar } from 'react-native';

// Import custom font constants
import { FONTS } from '../constants/fonts';

// Export shared layout styles
export default StyleSheet.create({

  // Main safe area wrapper
  // Prevents content from overlapping phone notch/status bar
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  // Main screen wrapper
  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },

  // Background image/container style
  background: {
    flex: 1,
  },

  // Footer container
  footer: {
    height: 55,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  // Individual footer item
  footerItem: {
    alignItems: 'center',
  },

  // Footer icon text/icon style
  footerIcon: {
    fontSize: 22,
    fontFamily: FONTS.regular,
    color: '#fff',
  },

  // Footer label text
  footerText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },

  // Dark overlay background for modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  // Language selection modal container
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

  // Modal title text
  modalTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2C1A0E',
    marginBottom: 20,
  },

  // Language option button
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

  // Selected language option style
  languageOptionSelected: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.97 }],
  },

  // Language option text
  languageOptionText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
  },

  // Selected language option text color
  languageOptionTextSelected: {
    color: '#F5E6C8',
  },

  // Confirmation/helper text inside modal
  confirmText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#2C1A0E',
    marginTop: 8,
    marginBottom: 18,
    textAlign: 'center',
  },

  // Row containing modal buttons
  modalButtonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Confirm button style
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

  // Confirm button text
  confirmButtonText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Cancel button style
  cancelButton: {
    width: '45%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Cancel button text
  cancelText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Shared pressed effect for modal buttons
  modalButtonPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  // Disabled button opacity style
  disabledButton: {
    opacity: 0.45,
  },
});