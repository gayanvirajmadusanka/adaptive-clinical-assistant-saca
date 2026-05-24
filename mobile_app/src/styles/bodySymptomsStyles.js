// bodySymptomsStyles.js
// Purpose: Screen-specific styles for BodySymptomsScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 76,
  },

  headerBar: {
    width: '94%',
    height: 64,
    backgroundColor: '#B5523B',
    borderRadius: 14,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    paddingHorizontal: 58,
    position: 'relative',
  },

  headerText: {
    fontSize: 25,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  headerSpeakerButton: {
    position: 'absolute',
    right: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3AD35',
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerSpeakerIcon: {
    width: 24,
    height: 24,
  },

  hintText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#3D2A1A',
    marginBottom: 14,
  },

  symptomsScroll: {
    flexGrow: 0,
    maxHeight: 500,
    paddingRight: 6,
  },

  symptomsList: {
    paddingBottom: 12,
  },

  symptomCard: {
    width: '100%',
    minHeight: 138,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 250, 238, 0.92)',
    borderWidth: 2,
    borderColor: '#E0CDB0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 14,
    marginBottom: 16,
    elevation: 3,
  },

  symptomCardActive: {
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  symptomImage: {
    width: 112,
    height: 112,
    marginRight: 14,
  },

  symptomImagePlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 20,
    backgroundColor: '#EADCC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  placeholderText: {
    fontSize: 34,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#8B3A1C',
  },

  symptomText: {
    flex: 1,
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    paddingRight: 8,
  },

  symptomTextActive: {
    color: '#000',
    fontFamily: FONTS.bold,
  },

  symptomSpeakerButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E3AD35',
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  symptomSpeakerIcon: {
    width: 24,
    height: 24,
  },

  speakerPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.95 }],
  },

  confirmButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#E3AD35',
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginTop: 12,
    marginBottom: 14,
  },

  confirmPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  confirmText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

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
    alignSelf: 'center',
    marginBottom: 12,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorModalBox: {
    width: '92%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5EAD8',
    borderWidth: 1,
    borderColor: '#8B3A1C',
    elevation: 8,
  },

  errorHeader: {
    backgroundColor: '#8B2E0A',
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  errorTitle: {
    color: '#FFF',
    fontSize: 21,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 12,
  },

  errorCloseButton: {
    width: 48,
    height: 48,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorCloseText: {
    color: '#FFF',
    fontSize: 34,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    lineHeight: 36,
  },

  errorBody: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
    minHeight: 150,
  },

  errorMessageBold: {
    color: '#5C2E0A',
    fontSize: 19,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 22,
    lineHeight: 26,
  },

  errorMessage: {
    color: '#5C2E0A',
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 28,
    lineHeight: 24,
  },

  errorOkButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 22,
  },

  errorOkButtonPressed: {
    backgroundColor: '#8B1E0D',
    transform: [{ scale: 0.96 }],
  },

  errorOkText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    fontSize: 18,
  },
});