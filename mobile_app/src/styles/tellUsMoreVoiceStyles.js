// tellUsMoreVoiceStyles.js
// Purpose: Styles for voice version of Tell Us More screen.

import { StyleSheet, StatusBar, Dimensions } from 'react-native';
import { FONTS } from '../constants/fonts';

const { width } = Dimensions.get('window');
const isSmallPhone = width < 390;

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },

  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: isSmallPhone ? 18 : 24,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2B1B12',
  },

  headerBar: {
    width: '100%',
    height: 66,
    backgroundColor: '#C87936',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
  },

  backCircle: {
    position: 'absolute',
    left: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backArrow: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1E160F',
  },

  headerText: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  questionNumber: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#7A180E',
    marginBottom: 24,
  },

  progressTrack: {
    width: '100%',
    height: 10,
    borderRadius: 10,
    backgroundColor: '#E8D5A8',
    overflow: 'hidden',
    marginBottom: 28,
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#C8661F',
  },

  contentRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },

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

  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  questionText: {
    flex: 1,
    fontSize: isSmallPhone ? 16 : 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    paddingRight: 8,
  },

  speakerButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#B8A37D',
    backgroundColor: '#F7E9C8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  speakerIcon: {
    width: 28,
    height: 28,
  },

  optionsWrapper: {
    gap: 10,
  },

  optionItem: {
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 250, 238, 0.75)',
  },

  optionLight: {
    backgroundColor: '#F2C483',
  },

  optionMedium: {
    backgroundColor: '#E59A3D',
  },

  optionDark: {
    backgroundColor: '#C8661F',
  },

  optionSelected: {
    backgroundColor: '#8B1E0D',
    borderWidth: 1.5,
    borderColor: '#5F1207',
  },

  optionText: {
    fontSize: isSmallPhone ? 14 : 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
  },

  optionTextSelected: {
    color: '#FFF',
  },

  voiceRecordedBox: {
    minHeight: 42,
    borderRadius: 9,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(218, 219, 187, 0.85)',
  },

  voiceRecordedText: {
    fontSize: isSmallPhone ? 13 : 15,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A7A2B',
  },

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

  voiceTitle: {
    fontSize: isSmallPhone ? 16 : 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A1000',
    textAlign: 'center',
    marginBottom: 18,
  },

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

  recordingBorder: {
    borderColor: '#C0392B',
    borderWidth: 3,
    backgroundColor: 'rgba(192,57,43,0.08)',
  },

  micCircle: {
    width: isSmallPhone ? 82 : 94,
    height: isSmallPhone ? 82 : 94,
    borderRadius: isSmallPhone ? 41 : 47,
    alignItems: 'center',
    justifyContent: 'center',
  },

  micImage: {
    width: isSmallPhone ? 48 : 56,
    height: isSmallPhone ? 48 : 56,
  },

  waveformContainer: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 8,
  },

  waveBar: {
    width: 5,
    borderRadius: 8,
    backgroundColor: '#8B3A1C',
  },

  voiceHint: {
    marginTop: 14,
    fontSize: isSmallPhone ? 12 : 14,
    fontFamily: FONTS.regular,
    color: '#7A4A2A',
    textAlign: 'center',
  },

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

  voicePlayButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3A7A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  voiceDurationText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A1000',
    minWidth: 42,
    textAlign: 'center',
  },

  voiceDeleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B3A1C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueButton: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D99000',
    borderWidth: 2,
    borderColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },

  continuePressed: {
    opacity: 0.85,
  },

  continueText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
  },

  footer: {
    height: 72,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerIcon: {
    fontSize: 24,
    fontFamily: FONTS.regular,
  },

  footerText: {
    color: '#777',
    fontSize: 13,
    fontFamily: FONTS.regular,
    marginTop: 3,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  languageModal: {
    width: '82%',
    backgroundColor: '#FFF7E8',
    borderRadius: 18,
    padding: 22,
  },

  modalTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    color: '#2B1B12',
  },

  languageOption: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3E0BF',
    marginBottom: 12,
    alignItems: 'center',
  },

  languageOptionSelected: {
    backgroundColor: '#C8661F',
  },

  languageOptionText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
  },

  languageOptionTextSelected: {
    color: '#FFF',
  },

  confirmText: {
    textAlign: 'center',
    color: '#5C4A3A',
    marginVertical: 10,
  },

  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#DDD',
    alignItems: 'center',
  },

  cancelText: {
    fontWeight: 'bold',
    color: '#111',
  },

  confirmButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#C8661F',
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.5,
  },

  confirmButtonText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
});