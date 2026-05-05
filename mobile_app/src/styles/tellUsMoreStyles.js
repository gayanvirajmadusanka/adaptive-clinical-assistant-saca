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
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingHorizontal: 25,
  paddingTop: 80, // 
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
    width: '92%',
    height: 60,
    backgroundColor: '#C87936',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },

  backCircle: {
    position: 'absolute',
    left: 18,
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
    fontSize: 22,
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
    marginBottom: 28,
  },

  progressTrack: {
    width: '100%',
    height: 9,
    borderRadius: 10,
    backgroundColor: '#E8D5A8',
    overflow: 'hidden',
    marginBottom: 34,
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#C8661F',
  },

  questionBox: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#B8A37D',
    backgroundColor: 'rgba(246, 232, 203, 0.90)',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    minHeight: 205,
  },

  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  questionText: {
    flex: 1,
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    paddingRight: 12,
  },

  speakerButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#B8A37D',
    backgroundColor: '#F7E9C8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  speakerIcon: {
    width: 30,
    height: 30,
  },

  optionsWrapper: {
    gap: 10,
  },

  optionItem: {
    minHeight: 42,
    borderRadius: 10,
    paddingHorizontal: 16,
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
    fontSize: 16,
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
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 34,
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
