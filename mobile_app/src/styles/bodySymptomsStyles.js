// bodySymptomsStyles.js
// Purpose: Screen-specific styles for BodySymptomsScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
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
    marginBottom: 22,
  },

  headerText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
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
    maxHeight: 455,
    paddingRight: 6,
  },

  symptomsList: {
    paddingBottom: 10,
  },

  symptomCard: {
    width: '100%',
    minHeight: 112,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 250, 238, 0.92)',
    borderWidth: 1.8,
    borderColor: '#E0CDB0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    elevation: 3,
  },

  symptomCardActive: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  symptomImage: {
    width: 92,
    height: 92,
    marginRight: 16,
  },

  symptomImagePlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 18,
    backgroundColor: '#EADCC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  placeholderText: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#8B3A1C',
  },

  symptomText: {
    flex: 1,
    fontSize: 19,
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
});