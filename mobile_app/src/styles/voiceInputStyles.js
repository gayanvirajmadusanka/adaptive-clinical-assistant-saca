// voiceInputStyles.js
// Purpose: Screen-specific styles for VoiceInputScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  // Same main layout position as TextInputScreen.
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 80,
  },

  // Header copied/aligned with TextInputScreen style.
  headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#D2B767',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  headerText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  headerIcon: {
    position: 'absolute',
    right: 25,
    width: 30,
    height: 30,
  },

  recordBox: {
    width: '92%',
    minHeight: 270,
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
    width: '92%',
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
    marginBottom: 26,
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
    backgroundColor: '#C8A18C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#A8C89A',
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
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  continueText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Back button same as TextInputScreen.
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
});