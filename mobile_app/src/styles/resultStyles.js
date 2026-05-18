// resultStyles.js
// Purpose: Screen-specific styles for ResultScreen.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export const resultTheme = {
  severe: {
    header: '#6E0000',
    headerText: '#F5E6C8',

    screenBackground: '#9A3F18',
    severityFill: '#A41206',

    cardBackground: '#F3E4C3',
    boxBorder: '#D2B07B',
  },

  moderate: {
    header: '#6E0000',
    headerText: '#FFFFFF',

    screenBackground: '#F3E4C3',
    severityFill: 'rgb(252, 189, 0)',

    cardBackground: '#F3E4C3',
    boxBorder: '#D9B27C',
  },

  mild: {
    header: '#6E0000',
    headerText: '#FFFFFF',

    // Same background as recommendation/symptom card
    screenBackground: '#F3E4C3',
    severityFill: '#5C8A3C',

    cardBackground: '#F3E4C3',
    boxBorder: '#D9B27C',
  },
};

export default StyleSheet.create({
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 82,
  },

  resultCard: {
    width: '100%',
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 5,
  },

  headerBar: {
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },

  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 52,
    paddingBottom: 0,
    position: 'relative',
  },

  scrollContent: {
    paddingBottom: 32,
  },

  speakerButton: {
    position: 'absolute',
    right: 22,
    top: 2,
    width: 50,
    height: 50,
    borderRadius: 26,
    backgroundColor: '#ffdf3e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    elevation: 8,
    zIndex: 50,
  },

  speakerPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },

  speakerIcon: {
    width: 25,
    height: 25,
  },

  severityCard: {
    width: '100%',
    minHeight: 104,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 16,
    elevation: 5,
  },

  severityIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF8EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },

  severityImage: {
    width: 52,
    height: 52,
  },

  severityTextBox: {
    flex: 1,
  },

  severityTitle: {
    fontSize: 34,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 38,
  },

  severitySubtitle: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#FFFFFF',
    marginTop: 4,
  },

  callButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F5E6C8',
    borderWidth: 2,
    borderColor: '#6E0000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  callButtonText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#6E0000',
  },

  infoCard: {
    width: '100%',
    minHeight: 150,
    borderRadius: 24,
    borderWidth: 1.4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 18,
    elevation: 5,
  },

  symptomCard: {
    minHeight: 116,
  },

  infoIconLarge: {
    width: 78,
    height: 78,
    marginRight: 16,
    marginTop: 2,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 12,
  },

  infoText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: '#111111',
    marginBottom: 8,
    lineHeight: 22,
  },

  startAgainButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#C8911F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
    elevation: 4,
  },

  startAgainPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  startAgainText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2C1A0E',
  },

  pressedButton: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});