// tellUsMoreStyles.js
// Purpose: Screen-specific styles for TellUsMoreScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

// Import StyleSheet from React Native
import { StyleSheet } from 'react-native';

// Import custom font constants
import { FONTS } from '../constants/fonts';

// Export all styles for TellUsMoreScreen
export default StyleSheet.create({

  // Main screen container
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 72,
  },

  // Header bar container
  headerBar: {
    width: '94%',
    height: 56,
    backgroundColor: '#C87936',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  // Header title text
  headerText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Progress text showing current question number
  progressText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#7A1F00',
    marginBottom: 12,
  },

  // Progress bar background
  progressBarBackground: {
    width: '94%',
    height: 10,
    borderRadius: 10,
    backgroundColor: '#DDD0A8',
    overflow: 'hidden',
    marginBottom: 16,
  },

  // Progress bar fill color
  progressBarFill: {
    height: '100%',
    backgroundColor: '#C87936',
    borderRadius: 10,
  },

  // Question container box
  questionBox: {
    width: '94%',
    backgroundColor: '#E6D7BF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#BCA67A',
  },

  // Main question text
  questionText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 14,
    paddingRight: 58,
    lineHeight: 26,
  },

  // Speaker button inside question box
  speakerButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E3AD35',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },

  // Speaker button pressed effect
  speakerPressed: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.95 }],
  },

  // Speaker icon image
  speakerIcon: {
    width: 24,
    height: 24,
  },

  // Base option button style
  optionButton: {
    width: '100%',
    minHeight: 54,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  // Shared style when there are only 2 options
  twoOptionStyle: {
    backgroundColor: '#E6C37D',
  },

  // Different option background colors
  optionColor1: {
    backgroundColor: '#F2EEE4',
  },

  optionColor2: {
    backgroundColor: '#E5C48A',
  },

  optionColor3: {
    backgroundColor: '#D8A95C',
  },

  optionColor4: {
    backgroundColor: '#BC7A3E',
  },

  optionColor5: {
    backgroundColor: '#8D360F',
  },

  // Selected option style
  selectedOption: {
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  // Selected option text style
  selectedOptionText: {
    color: '#000',
    fontFamily: FONTS.bold,
  },

  // Option text style
  optionText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Continue button style
  continueButton: {
    width: '94%',
    height: 62,
    backgroundColor: '#E3AD35',
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    marginBottom: 14,
  },

  // Continue button pressed effect
  continuePressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  // Continue button text
  continueText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Back button style
  backButton: {
    width: 170,
    height: 58,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#F5EAD8',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 12,
  },

  // Back button content row
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Back arrow image style
  backArrowImage: {
    width: 22,
    height: 22,
    marginRight: 10,
  },

  // Back button pressed effect
  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  // Back button text style
  backText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Dark overlay behind modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Error modal container
  errorModalBox: {
    width: '92%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5EAD8',
    borderWidth: 1,
    borderColor: '#8B3A1C',
    elevation: 8,
  },

  // Error modal header
  errorHeader: {
    backgroundColor: '#8B2E0A',
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Error modal title text
  errorTitle: {
    color: '#FFF',
    fontSize: 21,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 12,
  },

  // Error modal close button
  errorCloseButton: {
    width: 48,
    height: 48,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Error modal X icon
  errorCloseText: {
    color: '#FFF',
    fontSize: 34,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    lineHeight: 36,
  },

  // Error modal body section
  errorBody: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
    minHeight: 150,
  },

  // Bold error message
  errorMessageBold: {
    color: '#5C2E0A',
    fontSize: 19,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 22,
    lineHeight: 26,
  },

  // Normal error message
  errorMessage: {
    color: '#5C2E0A',
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 28,
    lineHeight: 24,
  },

  // OK button style
  errorOkButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 22,
  },

  // OK button pressed effect
  errorOkButtonPressed: {
    backgroundColor: '#8B1E0D',
    transform: [{ scale: 0.96 }],
  },

  // OK button text
  errorOkText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    fontSize: 18,
  },
});