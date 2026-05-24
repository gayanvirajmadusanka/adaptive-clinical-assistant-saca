// voiceInputStyles.js
// Purpose: Screen-specific styles for VoiceInputScreen.
// Balanced size similar to TextInputScreen.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 75,
  },

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

  headerText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  headerRightGroup: {
    position: 'absolute',
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

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

  headerSpeakerPressed: {
    backgroundColor: '#8B3A1C',
    transform: [{ scale: 0.95 }],
  },

  headerSpeakerDisabled: {
    opacity: 0.45,
  },

  headerSpeakerIcon: {
    width: 22,
    height: 22,
  },

  headerIcon: {
    width: 36,
    height: 36,
  },

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

  recordingBorder: {
    borderColor: '#C0392B',
    borderWidth: 4,
    backgroundColor: 'rgba(192,57,43,0.08)',
  },

  micCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  micImage: {
    width: 72,
    height: 72,
  },

  waveformContainer: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
  },

  waveBar: {
    width: 8,
    borderRadius: 10,
    backgroundColor: '#8B3A1C',
  },

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

  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  deleteButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#C8A18C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#A8C89A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledControl: {
    opacity: 0.35,
  },

  timeText: {
    minWidth: 48,
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#3A2A1A',
  },

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

  continueText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

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

  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrowImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },

  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  backText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },
});