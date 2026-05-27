// bodySymptomsStyles.js
// Purpose: Screen-specific styles for BodySymptomsScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

// Import StyleSheet from React Native
import { StyleSheet } from 'react-native';

// Import custom font constants
import { FONTS } from '../constants/fonts';

// Export all styles for BodySymptomsScreen
export default StyleSheet.create({

  // Main screen container
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 76,
  },

  // Header bar container
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

  // Header title text
  headerText: {
    fontSize: 25,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  // Speaker button inside header
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

  // Hint text below header
  hintText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#3D2A1A',
    marginBottom: 14,
  },

  // ScrollView container for symptoms list
  symptomsScroll: {
    flexGrow: 0,
    maxHeight: 500,
    paddingRight: 6,
  },

  // Symptoms list spacing
  symptomsList: {
    paddingBottom: 12,
  },

  // Individual symptom card
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

  // Active selected symptom card
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

  // Symptom image style
  symptomImage: {
    width: 112,
    height: 112,
    marginRight: 14,
  },

  // Placeholder box when symptom image is missing
  symptomImagePlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 20,
    backgroundColor: '#EADCC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  // Placeholder text inside missing image box
  placeholderText: {
    fontSize: 34,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#8B3A1C',
  },

  // Symptom text style
  symptomText: {
    flex: 1,
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    paddingRight: 8,
  },

  // Active selected symptom text
  symptomTextActive: {
    color: '#000',
    fontFamily: FONTS.bold,
  },

  // Speaker button beside symptom card
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

  // Speaker icon image
  symptomSpeakerIcon: {
    width: 24,
    height: 24,
  },

  // Pressed state for speaker buttons
  speakerPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.95 }],
  },

  // Confirm button style
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

  // Confirm button pressed effect
  confirmPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  // Confirm button text
  confirmText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Back button style
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

  // Back button content layout
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Back arrow image style
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

  // Back button text style
  backText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Dark background overlay for modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Error modal main box
  errorModalBox: {
    width: '92%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5EAD8',
    borderWidth: 1,
    borderColor: '#8B3A1C',
    elevation: 8,
  },

  // Error modal header section
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

  // Close button for error modal
  errorCloseButton: {
    width: 48,
    height: 48,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // X close icon text
  errorCloseText: {
    color: '#FFF',
    fontSize: 34,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    lineHeight: 36,
  },

  // Error modal body section
  errorBody: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
    minHeight: 150,
  },

  // Bold error message text
  errorMessageBold: {
    color: '#5C2E0A',
    fontSize: 19,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 22,
    lineHeight: 26,
  },

  // Normal error message text
  errorMessage: {
    color: '#5C2E0A',
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 28,
    lineHeight: 24,
  },

  // OK button inside modal
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

  // OK button text style
  errorOkText: {
    color: '#FFF',
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    fontSize: 18,
  },
});