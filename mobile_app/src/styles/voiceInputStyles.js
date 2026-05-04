import { StyleSheet, StatusBar } from 'react-native';

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
    transform: [{ translateY: -30 }],
  },

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

  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },

  headerIcon: {
    width: 28,
    height: 28,
  },

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

  pulseCircle: {
    width: 125,
    height: 125,
    borderRadius: 62,
    borderWidth: 2,
    borderColor: '#CDBB91',
    alignItems: 'center',
    justifyContent: 'center',
  },

  recordingBorder: {
    borderColor: 'red',
    borderWidth: 3,
  },

  micCircle: {
    width: 115,
    height: 115,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  waveformContainer: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 12,
  },

  waveBar: {
    width: 7,
    borderRadius: 8,
    backgroundColor: '#8B2E0A',
  },

  recordText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#3A2816',
    textAlign: 'center',
  },

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

  deleteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#A82312',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0A8F2D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

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
    fontWeight: 'bold',
    color: '#000',
  },
});