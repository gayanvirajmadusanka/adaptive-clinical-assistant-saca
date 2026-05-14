import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },

  headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#B5523B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  backCircle: {
    position: 'absolute',
    left: 16,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  headerText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  questionNumber: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#7A180E',
    marginBottom: 16,
  },

  progressTrack: {
    width: '100%',
    height: 9,
    borderRadius: 10,
    backgroundColor: '#E8D5A8',
    overflow: 'hidden',
    marginBottom: 18,
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#C8661F',
  },

  questionBox: {
    width: '100%',
    maxHeight: 520,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#D9C4A1',
    backgroundColor: 'rgba(255, 250, 238, 0.9)',
    padding: 16,
  },

  questionText: {
    fontSize: 21,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 14,
  },

  optionsWrapper: {
    gap: 12,
    paddingBottom: 8,
  },

  optionCard: {
    minHeight: 94,
    borderRadius: 18,
    backgroundColor: '#FFFDF8',
    borderWidth: 1.5,
    borderColor: '#E0CDB0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 2,
  },

  optionCardSelected: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  optionImage: {
    width: 76,
    height: 76,
    marginRight: 16,
  },

  optionText: {
    flex: 1,
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
  },

  optionTextSelected: {
    color: '#FFF',
  },

  continueButton: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D99000',
    borderWidth: 2,
    borderColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  continueText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
  },

  footer: {
    height: 55,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  footerItem: {
    alignItems: 'center',
  },

  footerIcon: {
    fontSize: 22,
    fontFamily: FONTS.regular,
    color: '#fff',
  },

  footerText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
});