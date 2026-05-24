// resultStyles.js

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export const resultTheme = {
  severe: {
    severityFill: '#8B070C',
    cardBackground: '#F5EAD8',
    boxBorder: '#C9B78F',
  },

  moderate: {
    severityFill: '#D7AE43',
    cardBackground: '#F5EAD8',
    boxBorder: '#C9B78F',
  },

  mild: {
    severityFill: '#5A8F3A',
    cardBackground: '#F5EAD8',
    boxBorder: '#C9B78F',
  },
};

export default StyleSheet.create({
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 62,
  },

  headerBar: {
    width: '100%',
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#C87936',
  },

  headerText: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  scrollContent: {
    paddingBottom: 16,
  },

  severityCard: {
    width: '100%',
    minHeight: 114,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 14,
    elevation: 5,
  },

  severityIconLarge: {
    width: 70,
    height: 70,
    marginRight: 14,
  },

  severityTextBox: {
    flex: 1,
    paddingRight: 8,
  },

  severityTitle: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 34,
  },

  severitySubtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#FFFFFF',
    marginTop: 4,
    lineHeight: 21,
  },

  speakerButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#D7AE43',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000',
    elevation: 6,
  },

  speakerPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },

  speakerIcon: {
    width: 30,
    height: 30,
  },

  callButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    backgroundColor: '#F5EAD8',
  },

  callButtonSevere: {
    borderColor: '#5F1207',
    borderWidth: 3,
  },

  callButtonModerate: {
    borderColor: '#5F1207',
    borderWidth: 3,
  },

  callIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },

  callButtonText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#4B0900',
  },

  infoCard: {
    width: '100%',
    minHeight: 132,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 14,
    elevation: 3,
  },

  symptomCard: {
    minHeight: 98,
  },

  infoIconLarge: {
    width: 58,
    height: 58,
    marginRight: 16,
    marginTop: 4,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 10,
  },

  infoHeading: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
    marginBottom: 8,
  },

  infoText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#4A2108',
    lineHeight: 22,
  },

  startAgainButton: {
    width: '100%',
    height: 58,
    borderRadius: 30,
    backgroundColor: '#D19A24',
    borderWidth: 2,
    borderColor: '#5C2E0A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 4,
  },

  startAgainPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  startAgainText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
  },

  startAgainTextPressed: {
    color: '#FFFFFF',
  },

  backButton: {
    width: 170,
    height: 58,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#F5EAD8',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 4,
    marginTop: 4,
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
    marginRight: 10,
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

  pressedButton: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});