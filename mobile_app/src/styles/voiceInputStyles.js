// Styles for VoiceInputScreen.
// Defines microphone recording UI, pulse circle, waveform bars, playback controls, and continue button.

import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
    // Main safe area background.
safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

    // Background image area.
background: {
    flex: 1,
  },

    // Voice screen main container.
container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 20,
    paddingHorizontal: 18,
    justifyContent: 'center',
    transform: [{ translateY: -30 }],
  },

    // Header row with back icon, title, and voice icon.
header: {
    height: 70,
    backgroundColor: '#D4AF4A',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

    // SPEAK title text.
headerTitle: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  headerIcon: {
    width: 28,
    height: 28,
  },

    // Main recording box.
recordBox: {
    height: 260,
    borderWidth: 2,
    borderColor: '#CDBB91',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    backgroundColor: 'rgba(248, 232, 199, 0.75)',
  },

    // Animated circle around mic.
pulseCircle: {
    width: 125,
    height: 125,
    borderRadius: 62,
    borderWidth: 2,
    borderColor: '#CDBB91',
    alignItems: 'center',
    justifyContent: 'center',
  },

    // Red border shown while recording.
recordingBorder: {
    borderColor: 'red',
    borderWidth: 3,
  },

    // Touchable mic area.
micCircle: {
    width: 115,
    height: 115,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

    // Animated waveform container.
waveformContainer: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 12,
  },

    // Single waveform bar.
waveBar: {
    width: 7,
    borderRadius: 8,
    backgroundColor: '#8B2E0A',
  },

    // Instruction/status text.
recordText: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: '600',
    color: '#3A2816',
    textAlign: 'center',
  },

    // Bottom controls container.
bottomBox: {
    height: 90,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#D7C69D',
    backgroundColor: 'rgba(248, 232, 199, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

    // Delete recording button.
deleteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#A82312',
    alignItems: 'center',
    justifyContent: 'center',
  },

    // Play/stop recording button.
playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0A8F2D',
    alignItems: 'center',
    justifyContent: 'center',
  },

    // Recording timer text.
timeText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

    // Continue button after recording.
continueButton: {
    paddingHorizontal: 28,
    height: 55,
    borderRadius: 25,
    backgroundColor: '#E99B00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },
});
