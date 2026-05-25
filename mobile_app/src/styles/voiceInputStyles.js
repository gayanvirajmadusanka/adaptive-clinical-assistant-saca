// voiceInputStyles.js
// Purpose: Styles for VoiceInputScreen.
// Controls voice recording UI, microphone button,
// audio playback controls, speaker button,
// and navigation layout.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({

  // Main screen container
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 78,
  },

  // ===============================
  // Header Section
  // ===============================

  // Header box container
  headerBar: {
    width: '94%',
    height: 64,
    backgroundColor: '#C87936',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    position: 'relative',
    paddingHorizontal: 56,
  },

  // Header title text
  headerText: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  // Header speaker button
  headerSpeakerButton: {
    position: 'absolute',
    right: 10,
    width: 46,
    height: 46,
    borderRadius: 23,
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

  // Instruction/helper text
  hintText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#3D2A1A',
    textAlign: 'center',
    marginBottom: 26,
    lineHeight: 26,
  },

  // ===============================
  // Microphone Recording Section
  // ===============================

  // Wrapper around microphone area
  micWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  // Main microphone button
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#C87936',
    borderWidth: 4,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },

  // Microphone button while recording
  micButtonRecording: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  // Microphone icon image
  micIcon: {
    width: 60,
    height: 60,
  },

  // Tap to record text
  tapToRecordText: {
    marginTop: 14,
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
    textAlign: 'center',
  },

  // ===============================
  // Recorded Audio Box
  // ===============================

  // Audio playback container
  recordedBox: {
    width: 220,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#EFE2CC',
    borderWidth: 2,
    borderColor: '#B9A57F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 28,
  },

  // Play audio button
  playButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3E8B3A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Audio duration text
  durationText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: '#000',
  },

  // Delete recording button
  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#A3361A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ===============================
  // Continue Button
  // ===============================

  // Continue button container
  continueButton: {
    width: '94%',
    height: 64,
    backgroundColor: '#E3AD35',
    borderRadius: 34,
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

  // ===============================
  // Error Modal Styling
  // ===============================

  // Dark overlay behind modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Main modal box
  errorModalBox: {
    width: '92%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5EAD8',
    borderWidth: 1,
    borderColor: '#8B3A1C',
    elevation: 8,
  },

  // Modal top header
  errorHeader: {
    backgroundColor: '#8B2E0A',
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Error title text
  errorTitle: {
    color: '#FFF',
    fontSize: 21,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 12,
  },

  // Close (X) button
  errorCloseButton: {
    width: 48,
    height: 48,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Close button text
  errorCloseText: {
    color: '#FFF',
    fontSize: 34,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    lineHeight: 36,
  },

  // Modal body content
  errorBody: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
    minHeight: 150,
  },

  // Main bold error message
  errorMessageBold: {
    color: '#5C2E0A',
    fontSize: 19,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 22,
    lineHeight: 26,
  },

  // Secondary error message
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

  // OK button text
  errorOkText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    fontSize: 18,
  },
});