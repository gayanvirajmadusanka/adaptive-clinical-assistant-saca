// detectedSymptomsStyles.js
// Purpose: Screen-specific styles for DetectedSymptomsScreen and DetectedSymptomsVoiceScreen.
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  headerText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  symptomBox: {
    width: '92%',
    minHeight: 270,
    backgroundColor: '#E6D7BF',
    borderRadius: 25,
    padding: 22,
    marginBottom: 30,
    position: 'relative',
  },

  symptomText: {
    fontSize: 22,
    lineHeight: 34,
    fontFamily: FONTS.bold,
    color: '#4B3A2A',
    paddingRight: 55,
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

  questionText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#3D2A1A',
    marginBottom: 26,
    textAlign: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },

  choiceButton: {
    width: 130,
    height: 50,
    borderRadius: 34,
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  choicePressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  choiceText: {
    fontSize: 21,
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
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorModalBox: {
    width: '90%',
    backgroundColor: '#F5E6C8',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#5C2E0A',
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
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 12,
  },

  errorCloseButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorCloseText: {
    color: '#FFF',
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    lineHeight: 30,
  },

  errorBody: {
    padding: 22,
  },

  errorMessageBold: {
    color: '#5C2E0A',
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 18,
    lineHeight: 22,
  },

  errorMessage: {
    color: '#5C2E0A',
    fontSize: 15,
    fontFamily: FONTS.regular,
    marginBottom: 20,
    lineHeight: 22,
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
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.96 }],
  },

  errorOkText: {
    color: '#000',
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    fontSize: 15,
  },

  voiceAnswerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },

  voiceQuestionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#3D2A1A',
    textAlign: 'center',
    marginBottom: 12,
  },

  voiceAnswerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  voiceYesNoButton: {
    width: 120,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D4A64D',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 7,
    elevation: 4,
  },

  voiceYesNoText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  voiceAnswerSelected: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  voiceAnswerSelectedText: {
    color: '#FFF',
  },

  voiceMicWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  detectedMicButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#C87936',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  detectedMicRecording: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  detectedMicIcon: {
    width: 30,
    height: 30,
  },

  tapToAnswerText: {
    marginTop: 4,
    fontSize: 9,
    fontFamily: FONTS.regular,
    color: '#5C2E0A',
    textAlign: 'center',
  },

    iconButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '82%',
    marginBottom: 30,
  },

  iconChoiceButton: {
    width: 125,
    height: 125,
    borderRadius: 65,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconChoicePressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.75,
  },

  yesNoIcon: {
    width: 120,
    height: 120,
  },

});