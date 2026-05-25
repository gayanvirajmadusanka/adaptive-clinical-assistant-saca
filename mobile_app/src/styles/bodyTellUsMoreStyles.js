// bodyTellUsMoreStyles.js
// Purpose: Styles for BodyTellUsMoreScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({

  // Main screen container
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
  },

  // Header/title section
  headerBar: {
    width: '94%',
    height: 62,
    backgroundColor: '#B5523B',
    borderRadius: 14,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    paddingHorizontal: 56,
    position: 'relative',
  },

  // Header title text
  headerText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  // Speaker button in header
  headerSpeakerButton: {
    position: 'absolute',
    right: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3AD35',
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Header speaker icon image
  headerSpeakerIcon: {
    width: 24,
    height: 24,
  },

  // Progress/question count text
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
    marginBottom: 10,
  },

  // Question card container
  questionCard: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 250, 238, 0.95)',
    borderWidth: 2,
    borderColor: '#E0CDB0',
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 18,
    elevation: 3,
  },

  // Question text
  questionText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A1000',
    textAlign: 'center',
    lineHeight: 30,
  },

  // Scroll view for answer options
  optionsScroll: {
    flexGrow: 0,
    paddingBottom: 8,
  },

  // Options list spacing
  optionsList: {
    paddingBottom: 12,
  },

  // Individual option card/button
  optionCard: {
    width: '100%',
    minHeight: 110,
    borderRadius: 24,
    backgroundColor: '#FFFDF8',
    borderWidth: 2,
    borderColor: '#E0CDB0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 2,
  },

  // Selected option card style
  optionCardSelected: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    borderWidth: 3,
  },

  // Option image style
  optionImage: {
    width: 92,
    height: 92,
    marginRight: 14,
  },

  // Placeholder if image is missing
  optionImagePlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 18,
    backgroundColor: '#EADCC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  // Placeholder text/icon
  placeholderText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#8B3A1C',
  },

  // Option answer text
  optionText: {
    flex: 1,
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A1000',
    paddingRight: 10,
  },

  // Selected option text color
  optionTextSelected: {
    color: '#FFF',
  },

  // Speaker button beside option
  optionSpeakerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3AD35',
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Option speaker icon
  optionSpeakerIcon: {
    width: 24,
    height: 24,
  },

  // Speaker pressed animation
  speakerPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.95 }],
  },

  // Continue/submit button
  continueButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#E3AD35',
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginTop: 10,
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

  // Back button container
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
    alignSelf: 'center',
    marginBottom: 12,
  },

  // Content inside back button
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Back arrow image
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

  // Back button text
  backText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },
});