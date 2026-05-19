// bodyTellUsMoreStyles.js
// Purpose: Screen-specific styles for BodyTellUsMoreScreen.
// Shared SafeArea, background, footer, and language modal styles are handled by AppScreen.

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
  },

  questionText: {
    fontSize: 21,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 28,
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
    minHeight: 112,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 250, 238, 0.95)',
    borderWidth: 1.8,
    borderColor: '#E0CDB0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    elevation: 3,
  },

  optionCardSelected: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  optionImage: {
    width: 92,
    height: 92,
    marginRight: 16,
  },

  optionImagePlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 18,
    backgroundColor: '#EADCC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  placeholderText: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#8B3A1C',
  },

  optionText: {
    flex: 1,
    fontSize: 19,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
  },

  optionTextSelected: {
    color: '#FFF',
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
});