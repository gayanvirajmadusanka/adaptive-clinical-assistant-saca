// resultStyles.js
// Purpose: Screen-specific styles for ResultScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export const resultTheme = {
  severe: {
    cardBackground: '#8B3A1C',
    header: '#4A0A04',
    headerText: '#F5E6C8',
    severityFill: '#4A0A04',
    severityText: '#F5E6C8',
    startAgain: '#F5E6C8',
    boxBackground: '#F5E6C8',
    boxBorder: '#F5E6C8',
    boxText: '#2C1A0E',
  },

  moderate: {
    cardBackground: '#F5E6C8',
    header: '#8B3A1C',
    headerText: '#F5E6C8',
    severityFill: '#C47A3A',
    severityText: '#F5E6C8',
    startAgain: '#8B3A1C',
    boxBackground: '#F5E6C8',
    boxBorder: '#D4A96A',
    boxText: '#2C1A0E',
  },

  mild: {
    cardBackground: '#F5E6C8',
    header: '#C47A3A',
    headerText: '#2C1A0E',
    severityFill: '#5C8A3C',
    severityText: '#F5E6C8',
    startAgain: '#C47A3A',
    boxBackground: '#F5E6C8',
    boxBorder: '#D4A96A',
    boxText: '#2C1A0E',
  },
};

export default StyleSheet.create({
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 95,
  },

  resultCard: {
    width: '95%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
  },

  headerBar: {
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },

  // Main card content area
  // Extra top padding added so speaker button has clean spacing.
  content: {
    padding: 22,
    paddingTop: 42,
    position: 'relative',
  },

  // Speaker button
  // Same style as DetectedSymptomsScreen.
  speakerButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E3AD35',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    zIndex: 10,
  },

  // Speaker pressed effect
  speakerPressed: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.95 }],
  },

  speakerIcon: {
    width: 24,
    height: 24,
  },

  // Severity result badge
  severityBadge: {
    width: '100%',
    minHeight: 55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  severeBadge: {
    backgroundColor: '#5A0500',
    borderWidth: 1.5,
    borderColor: '#1E0000',
    shadowColor: '#5A0500',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 7,
  },

  severeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  warningIcon: {
    fontSize: 19,
    fontFamily: FONTS.bold,
    marginRight: 10,
    color: '#F5E6C8',
  },

  severityText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Emergency call button
  callButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#F5E6C8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#4A0A04',
  },

  callButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  callIcon: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    marginRight: 10,
  },

  callButtonText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#4A0A04',
  },

  // Information boxes
  infoBox: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 18,
    marginBottom: 18,
    minHeight: 125,
  },

  infoTitle: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  infoText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 7,
    lineHeight: 20,
  },

  // Start again button
  startAgainButton: {
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  startAgainText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },

  // General pressed effect
  pressedButton: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
});