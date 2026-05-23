// detectedSymptomsStyles.js

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 85,
  },

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

  headerText: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  symptomBox: {
    width: '94%',
    minHeight: 300,
    backgroundColor: '#E6DCC5',
    borderRadius: 26,
    padding: 24,
    marginBottom: 30,
    position: 'relative',
  },

  symptomText: {
    fontSize: 24,
    lineHeight: 38,
    fontFamily: FONTS.bold,
    color: '#4B3A2A',
    paddingRight: 70,
  },

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

  speakerPressed: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
  },

  speakerIcon: {
    width: 30,
    height: 30,
  },

  questionText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#3D2A1A',
    marginBottom: 28,
    textAlign: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '84%',
    marginBottom: 34,
  },

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

  choicePressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  choiceText: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  voiceAnswerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 30,
  },

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

  voiceYesNoText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  voiceAnswerSelected: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  voiceAnswerSelectedText: {
    color: '#FFF',
  },

  voiceMicWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 8,
    width: 110,
  },

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

  detectedMicRecording: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  detectedMicIcon: {
    width: 34,
    height: 34,
  },

  tapToAnswerText: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#5C2E0A',
    textAlign: 'center',
    minHeight: 24,
  },

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

  detectedPlayButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3E8B3A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  detectedDurationText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#000',
  },

  detectedDeleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#A3361A',
    alignItems: 'center',
    justifyContent: 'center',
  },

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

  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrowImage: {
    width: 26,
    height: 26,
    marginRight: 10,
  },

  backPressedGrey: {
    backgroundColor: '#A9A9A9',
  },

  backText: {
    fontSize: 28,
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
    minHeight: 155,
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

  iconButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '82%',
    marginBottom: 30,
  },

  iconChoiceButton: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconChoicePressed: {
    opacity: 0.75,
  },

  yesNoIcon: {
    width: 125,
    height: 125,
  },
});