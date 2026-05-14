// bodySymptomsStyles.js
// Purpose: Styles for body symptoms selection screen.

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
    paddingHorizontal: 25,
    paddingTop: 80,
  },

  headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#B5523B',
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
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

  headerSpeaker: {
    position: 'absolute',
    right: 18,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerSpeakerIcon: {
    width: 30,
    height: 30,
  },

  hintText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#7A6A52',
    marginBottom: 18,
  },

  symptomsScroll: {
    flexGrow: 0,
    maxHeight: 330,
  },

  symptomsList: {
    paddingBottom: 4,
  },

  symptomButton: {
    width: '100%',
    minHeight: 58,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 250, 238, 0.85)',
    borderWidth: 1.5,
    borderColor: '#E0CDB0',
    justifyContent: 'center',
    paddingHorizontal: 22,
    marginBottom: 12,
    elevation: 1,
  },

  symptomButtonActive: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  symptomText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
  },

  symptomTextActive: {
    color: '#FFF',
  },

  confirmButton: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D99000',
    borderWidth: 2,
    borderColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 16,
  },

  confirmButtonPressed: {
    opacity: 0.85,
  },

  confirmText: {
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  languageModal: {
    width: '90%',
    backgroundColor: '#F5E6C8',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#8B3A1C',
    padding: 22,
    alignItems: 'center',
    elevation: 8,
  },

  modalTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2C1A0E',
    marginBottom: 20,
  },

  languageOption: {
    width: '100%',
    height: 55,
    backgroundColor: '#E8D5A0',
    borderColor: '#D4A96A',
    borderWidth: 2,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  languageOptionSelected: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.97 }],
  },

  languageOptionText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
  },

  languageOptionTextSelected: {
    color: '#F5E6C8',
  },

  confirmTextSmall: {
    textAlign: 'center',
    color: '#5C4A3A',
    marginVertical: 10,
  },

  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
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

  confirmModalButton: {
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