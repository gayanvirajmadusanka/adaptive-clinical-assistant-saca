// voiceInputStyles.js
// Purpose: Screen-specific styles for VoiceInputScreen.
// Balanced size similar to TextInputScreen.

// Import StyleSheet from React Native
import { StyleSheet } from 'react-native';

// Import custom font constants
import { FONTS } from '../constants/fonts';

// Export all styles for VoiceInputScreen
export default StyleSheet.create({

  // Main screen container
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 75,
  },

  // Header bar container
  headerBar: {
    width: '94%',
    height: 68,
    backgroundColor: '#D2B767',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    paddingHorizontal: 18,
  },

  // Header title text
  headerText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Right side header group
  // Contains speaker button and microphone icon
  headerRightGroup: {
    position: 'absolute',
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Header speaker button
  headerSpeakerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  // Speaker button pressed effect
  headerSpeakerPressed: {
    backgroundColor: '#8B3A1C',
    transform: [{ scale: 0.95 }],
  },

  // Disabled speaker button style
  headerSpeakerDisabled: {
    opacity: 0.45,
  },

  // Speaker icon image
  headerSpeakerIcon: {
    width: 22,
    height: 22,
  },

  // Header microphone icon
  headerIcon: {
    width: 36,
    height: 36,
  },

  // Main recording box container
  recordBox: {
    width: '92%',
    height: 360,
    borderWidth: 1.5,
    borderColor: '#C8B99A',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 234, 212, 0.92)',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 35,
  },

  // Outer animated pulse circle
  pulseCircle: {
    width: 145,
    height: 145,
    borderRadius: 72,
    borderWidth: 3,
    borderColor: '#C8B99A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  // Recording active border effect
  recordingBorder: {
    borderColor: '#C0392B',
    borderWidth: 4,
    backgroundColor: 'rgba(192,57,43,0.08)',
  },

  // Inner microphone circle
  micCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Microphone image style
  micImage: {
    width: 72,
    height: 72,
  },

  // Audio waveform animation container
  waveformContainer: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
  },

  // Individual waveform bar
  waveBar: {
    width: 8,
    borderRadius: 10,
    backgroundColor: '#8B3A1C',
  },

  // Instruction text below microphone
  recordText: {
    marginTop: 18,
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: '600',
    color: '#7A6A52',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 10,
  },

  // Bottom control box
  // Contains play, delete, timer, and continue button
  bottomBox: {
    width: '92%',
    minHeight: 96,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#C8B99A',
    backgroundColor: 'rgba(245, 234, 212, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  // Left side controls container
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Delete recording button
  deleteButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#C8A18C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Play recording button
  playButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#A8C89A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Disabled control style
  disabledControl: {
    opacity: 0.35,
  },

  // Audio duration timer text
  timeText: {
    minWidth: 48,
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#3A2A1A',
  },

  // Continue button style
  continueButton: {
    minWidth: 128,
    height: 58,
    borderRadius: 28,
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  // Continue button text
  continueText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Back button style
  backButton: {
    width: 160,
    height: 60,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#F5EAD8',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  // Back button content row
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Back arrow image style
  backArrowImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },

  // Back button pressed effect
  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  // Back button text style
  backText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },
});