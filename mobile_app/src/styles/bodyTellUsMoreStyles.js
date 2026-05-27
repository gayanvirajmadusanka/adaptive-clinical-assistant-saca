// bodyTellUsMoreStyles.js
// Purpose: Screen-specific styles for BodyTellUsMoreScreen.
// Option colors now match TellUsMoreScreen:
// 2 options = same color, more options = different colors.

// Import StyleSheet from React Native
import { StyleSheet } from 'react-native';

// Import custom font constants
import { FONTS } from '../constants/fonts';

// Export all styles for BodyTellUsMoreScreen
export default StyleSheet.create({

  // Main screen container
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 80,
    alignItems: 'center',
  },

  // Header bar container
  headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#B5523B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  // Header title text
  headerText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Question number text
  questionNumber: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#7A180E',
    marginBottom: 14,
  },

  // Progress bar background track
  progressTrack: {
    width: '92%',
    height: 12,
    borderRadius: 10,
    backgroundColor: '#E8D5A8',
    overflow: 'hidden',
    marginBottom: 16,
  },

  // Progress bar fill
  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#C8661F',
  },

  // Question container box
  questionBox: {
    width: '92%',
    maxHeight: 500,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#BCA67A',
    backgroundColor: 'rgba(255, 250, 238, 0.92)',
    padding: 16,
    marginBottom: 14,
    position: 'relative',
  },

  // Main question text
  questionText: {
    fontSize: 21,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 14,
    paddingRight: 54,
    lineHeight: 28,
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
    zIndex: 10,
    elevation: 10,
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

  // ScrollView for options list
  optionsScroll: {
    maxHeight: 365,
    paddingRight: 6,
  },

  // Wrapper around all options
  optionsWrapper: {
    paddingBottom: 8,
  },

  // Default option card style
  optionCard: {
    width: '100%',
    minHeight: 120,
    borderRadius: 22,
    borderWidth: 1.8,
    borderColor: '#E0CDB0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    elevation: 3,
  },

  // Special option style for pain scale options
  painOptionCard: {
    width: '100%',
    minHeight: 120,
    borderRadius: 22,
    borderWidth: 1.8,
    borderColor: '#E0CDB0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 14,
    elevation: 3,
  },

  // Shared color style when only 2 options exist
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

  // Selected option card style
  optionCardSelected: {
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

  // Option image style
  optionImage: {
    width: 105,
    height: 105,
    marginRight: 16,
  },

  // Pain option image style
  painOptionImage: {
    width: 165,
    height: 72,
    marginBottom: 6,
  },

  // Placeholder box when option image is missing
  optionImagePlaceholder: {
    width: 105,
    height: 105,
    borderRadius: 18,
    backgroundColor: '#EADCC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  // Placeholder box for pain option image
  painOptionImagePlaceholder: {
    width: 165,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#EADCC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  // Placeholder text style
  placeholderText: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#8B3A1C',
  },

  // Option text style
  optionText: {
    flex: 1,
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    lineHeight: 28,
  },

  // Pain option text style
  painOptionText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Selected option text style
  optionTextSelected: {
    color: '#000',
    fontFamily: FONTS.bold,
  },

  // Continue button style
  continueButton: {
    width: '92%',
    height: 64,
    borderRadius: 34,
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
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
    color: '#111',
  },

  // Back button style
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
    marginBottom: 12,
  },

  // Back button content layout
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Back arrow image style
  backArrowImage: {
    width: 22,
    height: 22,
    marginRight: 8,
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

  // Close button for modal
  errorCloseButton: {
    width: 48,
    height: 48,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // X close icon text
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

  // OK button inside modal
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

  // OK button text style
  errorOkText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    fontSize: 18,
  },
});