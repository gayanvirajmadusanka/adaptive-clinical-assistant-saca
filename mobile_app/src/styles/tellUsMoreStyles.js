// tellUsMoreStyles.js
// Purpose: Screen-specific styles for TellUsMoreScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 72,
  },

  headerBar: {
    width: '94%',
    height: 56,
    backgroundColor: '#C87936',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  headerText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  progressText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#7A1F00',
    marginBottom: 12,
  },

  progressBarBackground: {
    width: '94%',
    height: 10,
    borderRadius: 10,
    backgroundColor: '#DDD0A8',
    overflow: 'hidden',
    marginBottom: 16,
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#C87936',
    borderRadius: 10,
  },

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

  questionText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 14,
    paddingRight: 58,
    lineHeight: 26,
  },

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

  speakerPressed: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.95 }],
  },

  speakerIcon: {
    width: 24,
    height: 24,
  },

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

  twoOptionStyle: {
    backgroundColor: '#E6C37D',
  },

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

  selectedOptionText: {
    color: '#000',
    fontFamily: FONTS.bold,
  },

  optionText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

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

  continuePressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  continueText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

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

  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrowImage: {
    width: 22,
    height: 22,
    marginRight: 10,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorModalBox: {
    width: '92%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5EAD8',
    borderWidth: 1,
    borderColor: '#8B3A1C',
    elevation: 8,
  },

  errorHeader: {
    backgroundColor: '#8B2E0A',
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  errorTitle: {
    color: '#FFF',
    fontSize: 21,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 12,
  },

  errorCloseButton: {
    width: 48,
    height: 48,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorCloseText: {
    color: '#FFF',
    fontSize: 34,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    lineHeight: 36,
  },

  errorBody: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
    minHeight: 150,
  },

  errorMessageBold: {
    color: '#5C2E0A',
    fontSize: 19,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 22,
    lineHeight: 26,
  },

  errorMessage: {
    color: '#5C2E0A',
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 28,
    lineHeight: 24,
  },

  errorOkButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 22,
  },

  errorOkButtonPressed: {
    backgroundColor: '#8B1E0D',
    transform: [{ scale: 0.96 }],
  },

  errorOkText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    fontSize: 18,
  },
});