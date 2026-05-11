// voiceInputStyles.js
// Purpose: Styles the mobile voice input screen to match the Windows voice flow:
// header bar, microphone card, playback bar, record/play/delete/continue controls.

import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 20,
    paddingHorizontal: 18,
    justifyContent: 'center',
    transform: [{ translateY: -24 }],
  },

  header: {
    height: 76,
    backgroundColor: '#D2B767',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 22,
  },

  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerButtonIcon: {
    width: 24,
    height: 24,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A0E00',
  },

  recordBox: {
    minHeight: 245,
    borderWidth: 1.5,
    borderColor: '#C8B99A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
    backgroundColor: 'rgba(245, 234, 212, 0.88)',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },

  pulseCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 2,
    borderColor: '#C8B99A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  recordingBorder: {
    borderColor: '#C0392B',
    borderWidth: 3,
    backgroundColor: 'rgba(192,57,43,0.08)',
  },

  micCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },

  micImage: {
    width: 58,
    height: 58,
  },

  waveformContainer: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 14,
  },

  waveBar: {
    width: 7,
    borderRadius: 8,
    backgroundColor: '#8B3A1C',
  },

  recordText: {
    marginTop: 8,
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: '600',
    color: '#7A6A52',
    textAlign: 'center',
  },

  bottomBox: {
    minHeight: 94,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#C8B99A',
    backgroundColor: 'rgba(245, 234, 212, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B3A1C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3A7A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledControl: {
    opacity: 0.35,
  },

  timeText: {
    minWidth: 44,
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#3A2A1A',
  },

  continueButton: {
    minWidth: 118,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#C8902A',
    borderWidth: 1.5,
    borderColor: '#1A1000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  continueText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A1000',
  },
});
