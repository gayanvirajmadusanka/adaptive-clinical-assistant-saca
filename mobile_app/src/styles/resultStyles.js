// resultStyles.js
// Purpose: Styles for ResultScreen.
// Controls severity cards, recommendation cards,
// emergency call button, speaker button,
// and navigation buttons.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

// Theme colors used based on severity level
export const resultTheme = {

  // Severe result colors
  severe: {
    severityFill: '#8B070C',
    cardBackground: '#F5EAD8',
    boxBorder: '#C9B78F',
  },

  // Moderate result colors
  moderate: {
    severityFill: '#D7AE43',
    cardBackground: '#F5EAD8',
    boxBorder: '#C9B78F',
  },

  // Mild result colors
  mild: {
    severityFill: '#5A8F3A',
    cardBackground: '#F5EAD8',
    boxBorder: '#C9B78F',
  },
};

export default StyleSheet.create({

  // Main content wrapper
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 62,
  },

  // ===============================
  // Header Section
  // ===============================

  // Top header box
  headerBar: {
    width: '100%',
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#C87936',
  },

  // Header title text
  headerText: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // ScrollView bottom spacing
  scrollContent: {
    paddingBottom: 16,
  },

  // ===============================
  // Severity Card
  // ===============================

  // Main severity card container
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

  // Large severity icon image
  severityIconLarge: {
    width: 70,
    height: 70,
    marginRight: 14,
  },

  // Text section inside severity card
  severityTextBox: {
    flex: 1,
    paddingRight: 8,
  },

  // Severity title text
  severityTitle: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 34,
  },

  // Severity subtitle/description
  severitySubtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#FFFFFF',
    marginTop: 4,
    lineHeight: 21,
  },

  // ===============================
  // Speaker Button
  // ===============================

  // Speaker button container
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

  // Speaker button pressed effect
  speakerPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },

  // Speaker icon image
  speakerIcon: {
    width: 30,
    height: 30,
  },

  // ===============================
  // Emergency Call Button
  // ===============================

  // Base emergency call button
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

  // Severe emergency button border
  callButtonSevere: {
    borderColor: '#5F1207',
    borderWidth: 3,
  },

  // Moderate emergency button border
  callButtonModerate: {
    borderColor: '#5F1207',
    borderWidth: 3,
  },

  // Call icon image
  callIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },

  // Call button text
  callButtonText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#4B0900',
  },

  // ===============================
  // Information Cards
  // ===============================

  // General info card container
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

  // Smaller symptom card variant
  symptomCard: {
    minHeight: 98,
  },

  // Large info icon image
  infoIconLarge: {
    width: 58,
    height: 58,
    marginRight: 16,
    marginTop: 4,
  },

  // Right-side content section
  infoContent: {
    flex: 1,
  },

  // Main info title
  infoTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 10,
  },

  // Small section heading
  infoHeading: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
    marginBottom: 8,
  },

  // Information paragraph text
  infoText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#4A2108',
    lineHeight: 22,
  },

  // ===============================
  // Start Again Button
  // ===============================

  // Start again button container
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

  // Start again pressed effect
  startAgainPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  // Start again text
  startAgainText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
  },

  // Pressed text color
  startAgainTextPressed: {
    color: '#FFFFFF',
  },

  // ===============================
  // Back Button
  // ===============================

  // Back button container
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

  // Content inside back button
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Back arrow image
  backArrowImage: {
    width: 22,
    height: 22,
    marginRight: 10,
  },

  // Back button pressed effect
  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  // Back button text
  backText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // General reusable pressed effect
  pressedButton: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});