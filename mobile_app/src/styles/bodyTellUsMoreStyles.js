// bodyTellUsMoreStyles.js
// Purpose: Screen-specific styles for BodyTellUsMoreScreen.
// Pain question now uses same button/card size as Question 3,
// but keeps image above text.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 80,
    alignItems: 'center',
  },

  headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#B5523B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  headerText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  questionNumber: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#7A180E',
    marginBottom: 14,
  },

  progressTrack: {
    width: '92%',
    height: 12,
    borderRadius: 10,
    backgroundColor: '#E8D5A8',
    overflow: 'hidden',
    marginBottom: 16,
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#C8661F',
  },

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

  speakerPressed: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.95 }],
  },

  speakerIcon: {
    width: 24,
    height: 24,
  },

  optionsScroll: {
    maxHeight: 365,
    paddingRight: 6,
  },

  optionsWrapper: {
    paddingBottom: 8,
  },

  optionCard: {
    width: '100%',
    minHeight: 120,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 250, 238, 0.95)',
    borderWidth: 1.8,
    borderColor: '#E0CDB0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    elevation: 3,
  },

  painOptionCard: {
    width: '100%',
    minHeight: 120,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 250, 238, 0.95)',
    borderWidth: 1.8,
    borderColor: '#E0CDB0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 14,
    elevation: 3,
  },

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

  optionImage: {
    width: 105,
    height: 105,
    marginRight: 16,
  },

  painOptionImage: {
    width: 165,
    height: 72,
    marginBottom: 6,
  },

  optionImagePlaceholder: {
    width: 105,
    height: 105,
    borderRadius: 18,
    backgroundColor: '#EADCC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  painOptionImagePlaceholder: {
    width: 165,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#EADCC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  placeholderText: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#8B3A1C',
  },

  optionText: {
    flex: 1,
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    lineHeight: 28,
  },

  painOptionText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    lineHeight: 24,
  },

  optionTextSelected: {
    color: '#000',
    fontFamily: FONTS.bold,
  },

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

  continuePressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  continueText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
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