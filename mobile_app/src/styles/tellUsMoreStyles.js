// tellUsMoreStyles.js
// Purpose: Screen-specific styles for TellUsMoreScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 80,
  },

  headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#C87936',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  headerText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  progressText: {
    fontSize: 19,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#7A1F00',
    marginBottom: 16,
  },

  progressBarBackground: {
    width: '92%',
    height: 12,
    borderRadius: 10,
    backgroundColor: '#DDD0A8',
    overflow: 'hidden',
    marginBottom: 18,
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#C87936',
    borderRadius: 10,
  },

  questionBox: {
    width: '92%',
    backgroundColor: '#E6D7BF',
    borderRadius: 25,
    padding: 18,
    marginBottom: 18,
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
    paddingRight: 55,
    lineHeight: 26,
  },

  speakerButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E3AD35',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
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
    minHeight: 48,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginBottom: 10,
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
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    borderWidth: 2,
  },

  selectedOptionText: {
    color: '#FFF',
  },

  optionText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  continueButton: {
    width: '92%',
    height: 64,
    backgroundColor: '#E3AD35',
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
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

  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrowImage: {
    width: 22,
    height: 22,
    marginRight: 8,
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
});