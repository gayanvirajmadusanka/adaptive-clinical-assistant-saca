// tellUsMoreVoiceStyles.js
// Purpose: Styles for TellUsMoreVoiceScreen.
// Controls voice question cards, option buttons,
// microphone recording UI, speaker buttons,
// progress bar, and navigation buttons.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({

  // Main screen container
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 72,
  },

  // ===============================
  // Header Section
  // ===============================

  // Top header box
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

  // Progress question number text
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

  // Progress bar fill animation
  progressBarFill: {
    height: '100%',
    backgroundColor: '#C87936',
    borderRadius: 10,
  },

  // ===============================
  // Question Box
  // ===============================

  // Question container
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

  // Question text
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

  // ===============================
  // Voice Recording Section
  // ===============================

  // Voice answer area
  voiceAnswerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },

  // Microphone button
  micButton: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#C87936',
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  // Microphone button while recording
  micButtonRecording: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  // Microphone icon image
  micIcon: {
    width: 42,
    height: 42,
  },

  // Instruction text below microphone
  tapToAnswerText: {
    marginTop: 10,
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: '#5C2E0A',
    textAlign: 'center',
  },

  // Recorded voice playback container
  recordedBox: {
    marginTop: 14,
    width: 180,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EFE2CC',
    borderWidth: 2,
    borderColor: '#B9A57F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  // Play recorded audio button
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3E8B3A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Audio duration text
  durationText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: '#000',
  },

  // Delete recorded audio button
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A3361A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ===============================
  // Continue Button
  // ===============================

  // Continue/submit button
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

  // ===============================
  // Back Button
  // ===============================

  // Back button container
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
    marginRight: 10,
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