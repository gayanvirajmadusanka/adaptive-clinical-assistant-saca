// tellUsMoreVoiceStyles.js
// Purpose: Screen-specific styles for TellUsMoreVoiceScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

// Import StyleSheet and Dimensions from React Native
import { StyleSheet, Dimensions } from 'react-native';

// Import custom font constants
import { FONTS } from '../constants/fonts';

// Get device screen width
const { width } = Dimensions.get('window');

// Detect smaller phone screens
const isSmallPhone = width < 390;

// Export all styles for TellUsMoreVoiceScreen
export default StyleSheet.create({

  // Main screen container
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 80,
  },

  // Loading screen container
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Loading text style
  loadingText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2B1B12',
  },

  // Header bar container
  headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#C87936',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  // Header title text
  headerText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Question number text
  questionNumber: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#7A180E',
    marginBottom: 14,
  },

  // Progress bar background track
  progressTrack: {
    width: '92%',
    height: 10,
    borderRadius: 10,
    backgroundColor: '#E8D5A8',
    overflow: 'hidden',
    marginBottom: 18,
  },

  // Progress bar fill
  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#C8661F',
  },

  // Main content row containing question and voice sections
  contentRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },

  // Question container box
  questionBox: {
    flex: 1.25,
    borderWidth: 1.5,
    borderColor: '#B8A37D',
    backgroundColor: 'rgba(246, 232, 203, 0.92)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 14,
    minHeight: 260,
  },

  // Question header layout
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  // Main question text
  questionText: {
    flex: 1,
    fontSize: isSmallPhone ? 16 : 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    paddingRight: 8,
  },

  // Speaker button style
  speakerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E3AD35',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
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

  // Wrapper around all options
  optionsWrapper: {
    gap: 10,
  },

  // Base option button style
  optionButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  // Shared color for two-option questions
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
    fontSize: isSmallPhone ? 14 : 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
  },

  // Recorded voice result box
  voiceRecordedBox: {
    minHeight: 42,
    borderRadius: 9,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(218, 219, 187, 0.85)',
  },

  // Recorded voice text
  voiceRecordedText: {
    fontSize: isSmallPhone ? 13 : 15,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A7A2B',
  },

  // Voice input section box
  voiceBox: {
    flex: 0.95,
    borderWidth: 1.5,
    borderColor: '#B8A37D',
    backgroundColor: 'rgba(246, 232, 203, 0.92)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 18,
    minHeight: 260,
    alignItems: 'center',
  },

  // Voice section title text
  voiceTitle: {
    fontSize: isSmallPhone ? 16 : 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A1000',
    textAlign: 'center',
    marginBottom: 18,
  },

  // Outer pulse circle around mic
  pulseCircle: {
    width: isSmallPhone ? 92 : 104,
    height: isSmallPhone ? 92 : 104,
    borderRadius: isSmallPhone ? 46 : 52,
    borderWidth: 2,
    borderColor: '#C8B99A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // Active recording border effect
  recordingBorder: {
    borderColor: '#C0392B',
    borderWidth: 3,
    backgroundColor: 'rgba(192,57,43,0.08)',
  },

  // Inner microphone circle
  micCircle: {
    width: isSmallPhone ? 82 : 94,
    height: isSmallPhone ? 82 : 94,
    borderRadius: isSmallPhone ? 41 : 47,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Microphone image style
  micImage: {
    width: isSmallPhone ? 48 : 56,
    height: isSmallPhone ? 48 : 56,
  },

  // Audio waveform animation container
  waveformContainer: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 8,
  },

  // Individual waveform bar
  waveBar: {
    width: 5,
    borderRadius: 8,
    backgroundColor: '#8B3A1C',
  },

  // Voice instruction text
  voiceHint: {
    marginTop: 14,
    fontSize: isSmallPhone ? 12 : 14,
    fontFamily: FONTS.regular,
    color: '#7A4A2A',
    textAlign: 'center',
  },

  // Voice playback controls container
  voicePlaybackBar: {
    marginTop: 16,
    width: '100%',
    minHeight: 54,
    borderRadius: 28,
    backgroundColor: '#EDE0CE',
    borderWidth: 1.5,
    borderColor: '#C8B99A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isSmallPhone ? 12 : 16,
    paddingHorizontal: 8,
  },

  // Play recording button
  voicePlayButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3A7A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Voice duration text
  voiceDurationText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A1000',
    minWidth: 42,
    textAlign: 'center',
  },

  // Delete recording button
  voiceDeleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B3A1C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Continue button style
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
    marginTop: 22,
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

  // Back button text
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

  // Disabled continue button style
  continueDisabled: {
    opacity: 0.45,
  },

});