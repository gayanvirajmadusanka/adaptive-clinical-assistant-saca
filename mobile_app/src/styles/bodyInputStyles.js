// bodyInputStyles.js
// Purpose: Styles for body map input screen.

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
    paddingHorizontal: 18,
    paddingTop: 55,
  },

  headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#B5523B',
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  genderToggle: {
    width: 220,
    height: 46,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#D4A96A',
    backgroundColor: '#F5E6C8',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 4,
    marginBottom: 12,

    zIndex: 20,
    elevation: 20,
  },

  genderButton: {
    flex: 1,
    height: 36,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 30,
    elevation: 30,
  },

  genderButtonActive: {
    backgroundColor: '#8B3A1C',
  },

  genderText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
  },

  genderTextActive: {
    color: '#F5E6C8',
  },

  hintText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#6E5C49',
    marginBottom: 2,
  },

  mainCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 8,

    zIndex: 1,
  },

  bodyPanel: {
    flex: 1.25,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    position: 'relative',
  },

  bodyImage: {
    width: '175%',
    height: '118%',
    marginBottom: -20,
  },

  bodyZone: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },

  zoneHead: {
    top: '12%',
    left: '39%',
    width: '22%',
    height: '10%',
    borderRadius: 50,
  },

  zoneChest: {
    top: '29%',
    left: '31%',
    width: '38%',
    height: '13%',
    borderRadius: 50,
  },

  zoneStomach: {
    top: '42%',
    left: '32%',
    width: '36%',
    height: '12%',
    borderRadius: 50,
  },

  zoneLeftArm: {
    top: '31%',
    left: '15%',
    width: '17%',
    height: '28%',
    borderRadius: 50,
  },

  zoneRightArm: {
    top: '31%',
    right: '15%',
    width: '17%',
    height: '28%',
    borderRadius: 50,
  },

  zoneGeneral: {
    bottom: '10%',
    left: '25%',
    width: '50%',
    height: '30%',
    borderRadius: 50,
  },

  partsPanel: {
    flex: 0.78,
    paddingLeft: 4,
    paddingRight: 0,
    paddingTop: 10,
  },

  partsTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2B1B12',
    marginBottom: 10,
  },

  partsList: {
    paddingBottom: 24,
    gap: 9,
  },

  partCard: {
    width: '100%',
    height: 52,
    borderRadius: 30,
    backgroundColor: '#FFFDF8',
    borderWidth: 1.5,
    borderColor: '#E0CDB0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 7,
    elevation: 2,
  },

  partCardPressed: {
    backgroundColor: '#EDE0CE',
    borderColor: '#B5523B',
  },

  partText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A1000',
    marginRight: 6,
  },

  speakerCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#D2A84B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  speakerIcon: {
    width: 22,
    height: 22,
  },

  footer: {
    height: 58,
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

  confirmText: {
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