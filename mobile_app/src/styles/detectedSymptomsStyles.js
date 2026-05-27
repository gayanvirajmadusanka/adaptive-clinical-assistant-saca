// detectedSymptomsStyles.js

// Import StyleSheet from React Native
import { StyleSheet } from 'react-native';

// Import custom font constants
import { FONTS } from '../constants/fonts';

// Export all styles for DetectedSymptomsScreen
export default StyleSheet.create({

  // Main screen container
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 85,
  },

  // Header bar container
  headerBar: {
    width: '94%',
    height: 64,
    backgroundColor: '#C87936',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  // Header title text
  headerText: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Main detected symptom box
  symptomBox: {
    width: '94%',
    minHeight: 300,
    backgroundColor: '#E6DCC5',
    borderRadius: 26,
    padding: 24,
    marginBottom: 30,
    position: 'relative',
  },

  // Detected symptom text
  symptomText: {
    fontSize: 24,
    lineHeight: 38,
    fontFamily: FONTS.bold,
    color: '#4B3A2A',
    paddingRight: 70,
  },

  // Speaker button for symptom audio
  speakerButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
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
  },

  // Speaker icon image
  speakerIcon: {
    width: 30,
    height: 30,
  },

  // Question text below symptom box
  questionText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#3D2A1A',
    marginBottom: 28,
    textAlign: 'center',
  },

  // Row containing Yes and No buttons
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '84%',
    marginBottom: 34,
  },

  // Yes/No button style
  choiceButton: {
    width: 145,
    height: 64,
    borderRadius: 34,
    backgroundColor: '#E3AD35',
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  // Yes/No button pressed effect
  choicePressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  // Yes/No button text
  choiceText: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Voice answer section row
  voiceAnswerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 30,
  },

  // Voice Yes/No button style
  voiceYesNoButton: {
    width: 112,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#D4A64D',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    elevation: 4,
  },

  // Voice Yes/No text style
  voiceYesNoText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Selected voice answer style
  voiceAnswerSelected: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  // Selected voice answer text color
  voiceAnswerSelectedText: {
    color: '#FFF',
  },

  // Wrapper around microphone section
  voiceMicWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 8,
    width: 110,
  },

  // Microphone button style
  detectedMicButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#C87936',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Recording microphone style
  detectedMicRecording: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  // Microphone icon image
  detectedMicIcon: {
    width: 34,
    height: 34,
  },

  // Instruction text below microphone
  tapToAnswerText: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#5C2E0A',
    textAlign: 'center',
    minHeight: 24,
  },

  // Recorded voice playback box
  detectedRecordedBox: {
    marginTop: 8,
    width: 108,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFE2CC',
    borderWidth: 1,
    borderColor: '#B9A57F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },

  // Play button inside recorded box
  detectedPlayButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3E8B3A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Voice recording duration text
  detectedDurationText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#000',
  },

  // Delete recording button
  detectedDeleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#A3361A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Row containing icon-based Yes/No options
  iconButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '82%',
    marginBottom: 30,
  },

  // Icon choice button style
  iconChoiceButton: {
    width: 140,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#F5EAD8',
    borderWidth: 2,
    borderColor: '#CDBE9D',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  // Selected icon choice style
  iconChoiceSelected: {
    borderWidth: 3,
    borderColor: '#C94B32',
    backgroundColor: 'rgba(245, 234, 216, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  // Pressed icon button effect
  iconChoicePressed: {
    transform: [{ scale: 0.96 }],
  },

  // Yes/No image icon style
  yesNoIcon: {
    width: 98,
    height: 98,
  },

  // Selected Yes/No icon effect
  yesNoIconSelected: {
    transform: [{ scale: 1.08 }],
  },

  // Back button style
  backButton: {
    width: 190,
    height: 70,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#F5EAD8',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  // Back button content layout
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Back arrow image style
  backArrowImage: {
    width: 26,
    height: 26,
    marginRight: 10,
  },

  // Back button pressed effect
  backPressedGrey: {
    backgroundColor: '#A9A9A9',
  },

  // Back button text
  backText: {
    fontSize: 28,
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
    minHeight: 155,
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
});