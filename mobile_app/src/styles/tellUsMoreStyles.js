import { StyleSheet, StatusBar } from 'react-native';

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
    paddingHorizontal: 22,
    paddingTop: 45,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B1B12',
  },

  headerBar: {
    height: 88,
    borderRadius: 12,
    backgroundColor: '#C8661F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 32,
  },

  backCircle: {
    position: 'absolute',
    left: 22,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    fontSize: 28,
    color: '#1E160F',
    fontWeight: 'bold',
  },

  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111',
  },

  questionNumber: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7A180E',
    marginBottom: 32,
  },

  progressTrack: {
    width: '100%',
    height: 9,
    borderRadius: 8,
    backgroundColor: '#E8D5A8',
    overflow: 'hidden',
    marginBottom: 34,
  },

  progressFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#C8661F',
  },

  questionBox: {
    borderWidth: 1.5,
    borderColor: '#B8A37D',
    backgroundColor: 'rgba(246, 232, 203, 0.88)',
    borderRadius: 14,
    padding: 20,
    minHeight: 210,
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
    fontWeight: 'bold',
    color: '#111',
    paddingRight: 12,
  },

  speakerButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B8A37D',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7E9C8',
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
    backgroundColor: '#8F1E0C',
  },

  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },

  optionTextSelected: {
    color: '#FFF',
  },

  continueButton: {
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D99000',
    borderWidth: 2,
    borderColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 34,
  },

  continuePressed: {
    opacity: 0.8,
  },

  continueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },

  footer: {
    height: 75,
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
  },

  footerText: {
    color: '#777',
    fontSize: 13,
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