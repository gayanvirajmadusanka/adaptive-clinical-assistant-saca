// detectedSymptomsStyles.js
// Purpose: Styles for DetectedSymptomsScreen.
// Controls symptom cards, yes/no buttons, audio speaker buttons,
// modal styling, and navigation buttons.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({

  // Main screen container
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
  },

  // ===============================
  // Header Section
  // ===============================

  // Header box
  headerBar: {
    width: '94%',
    height: 62,
    backgroundColor: '#B5523B',
    borderRadius: 14,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    paddingHorizontal: 56,
    position: 'relative',
  },

  // Header title text
  headerText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  // Header speaker button
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

  // Header speaker icon image
  headerSpeakerIcon: {
    width: 24,
    height: 24,
  },

  // Instruction text below header
  hintText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#3D2A1A',
    marginBottom: 14,
  },

  // ===============================
  // Symptom Cards
  // ===============================

  // Scroll area for symptoms
  symptomsScroll: {
    flexGrow: 0,
    paddingBottom: 10,
  },

  // Extra spacing for symptom list
  symptomsList: {
    paddingBottom: 14,
  },

  // Symptom card container
  symptomCard: {
    width: '100%',
    minHeight: 126,
    borderRadius: 24,
    backgroundColor: '#FFFDF8',
    borderWidth: 2,
    borderColor: '#E0CDB0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 2,
  },

  // Selected symptom card style
  symptomCardActive: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    borderWidth: 3,
  },

  // Symptom image
  symptomImage: {
    width: 96,
    height: 96,
    marginRight: 14,
  },

  // Placeholder if image missing
  symptomImagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: '#EADCC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  // Placeholder text/icon
  placeholderText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#8B3A1C',
  },

  // Symptom text label
  symptomText: {
    flex: 1,
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    paddingRight: 10,
  },

  // Selected symptom text style
  symptomTextActive: {
    color: '#FFF',
  },

  // Speaker button beside symptom
  symptomSpeakerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3AD35',
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Speaker icon image
  symptomSpeakerIcon: {
    width: 24,
    height: 24,
  },

  // Speaker pressed effect
  speakerPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.95 }],
  },

  // ===============================
  // Yes / No Buttons
  // ===============================

  // Yes/No buttons container
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 18,
    gap: 14,
  },

  // Yes/No button style
  yesNoButton: {
    flex: 1,
    height: 64,
    borderRadius: 34,
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  // Selected Yes/No button
  yesNoButtonActive: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
  },

  // Yes/No button pressed effect
  yesNoPressed: {
    transform: [{ scale: 0.96 }],
  },

  // Yes/No button text
  yesNoText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Selected Yes/No text color
  yesNoTextActive: {
    color: '#FFF',
  },

  // ===============================
  // Continue Button
  // ===============================

  // Continue button container
  continueButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#E3AD35',
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 14,
  },

  // Continue button pressed effect
  continuePressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  // Continue button text
  continueText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // ===============================
  // Back Button
  // ===============================

  // Back button container
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
    marginRight: 8,
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

  // ===============================
  // Error Modal Styling
  // ===============================

  // Dark overlay behind modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Main modal box
  errorModalBox: {
    width: '92%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5EAD8',
    borderWidth: 1,
    borderColor: '#8B3A1C',
    elevation: 8,
  },

  // Modal top header
  errorHeader: {
    backgroundColor: '#8B2E0A',
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Error title text
  errorTitle: {
    color: '#FFF',
    fontSize: 21,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 12,
  },

  // Close button (X)
  errorCloseButton: {
    width: 48,
    height: 48,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Close button text
  errorCloseText: {
    color: '#FFF',
    fontSize: 34,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    lineHeight: 36,
  },

  // Modal body content
  errorBody: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
    minHeight: 150,
  },

  // Main bold error message
  errorMessageBold: {
    color: '#5C2E0A',
    fontSize: 19,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 22,
    lineHeight: 26,
  },

  // Secondary error message
  errorMessage: {
    color: '#5C2E0A',
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 28,
    lineHeight: 24,
  },

  // OK button
  errorOkButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 22,
  },

  // OK button pressed effect
  errorOkButtonPressed: {
    backgroundColor: '#8B1E0D',
    transform: [{ scale: 0.96 }],
  },

  // OK button text
  errorOkText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    fontSize: 18,
  },
});