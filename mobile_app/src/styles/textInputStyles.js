// textInputStyles.js
// Purpose: Screen-specific styles for TextInputScreen.
// Shared SafeArea, background, footer, and language modal styles were moved to commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 95, // moved slightly lower
  },

  headerBar: {
    width: '94%',
    height: 70, // increased size
    backgroundColor: '#5F7D6E',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 35,
  },

  headerText: {
    fontSize: 30, // increased font size
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  headerIcon: {
    position: 'absolute',
    right: 25,
    width: 38, // increased icon size
    height: 38,
  },

  inputBox: {
    width: '92%',
    height: 300, // increased description box size
    backgroundColor: '#E6D7BF',
    borderRadius: 25,
    padding: 24,
    marginBottom: 55,
  },

  questionText: {
    fontSize: 22, // increased question font
    fontFamily: FONTS.bold,
    fontWeight: '600',
    color: '#000',
    marginBottom: 22,
    lineHeight: 30,
  },

  textInput: {
    flex: 1,
    fontSize: 22, // increased typing text size
    fontFamily: FONTS.regular,
    color: '#222',
    textAlignVertical: 'top',
    lineHeight: 30,
  },

  continueButton: {
    width: 250, // increased button size
    height: 72,
    backgroundColor: '#E3AD35',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 30,
  },

  continuePressedGreen: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  continueText: {
    fontSize: 28, // increased button text
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  backButton: {
    width: 160, // increased size
    height: 60,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#F5EAD8',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrowImage: {
    width: 26, // increased arrow size
    height: 26,
    marginRight: 10,
  },

  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  backText: {
    fontSize: 24, // increased text size
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Modal overlay
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

// Top red header
errorHeader: {
  backgroundColor: '#8B2E0A',
  paddingVertical: 18,
  paddingHorizontal: 18,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

// Header title
errorTitle: {
  color: '#FFF',
  fontSize: 21,
  fontFamily: FONTS.bold,
  fontWeight: 'bold',
  flex: 1,
  paddingRight: 12,
},

// Close button
errorCloseButton: {
  width: 48,
  height: 48,
  borderRadius: 9,
  borderWidth: 3,
  borderColor: '#FFF',
  alignItems: 'center',
  justifyContent: 'center',
},

// X icon
errorCloseText: {
  color: '#FFF',
  fontSize: 34,
  fontFamily: FONTS.bold,
  fontWeight: 'bold',
  lineHeight: 36,
},

// Modal body
errorBody: {
  paddingHorizontal: 22,
  paddingTop: 28,
  paddingBottom: 20,
  minHeight: 150,
},

// Message text
errorMessageBold: {
  color: '#5C2E0A',
  fontSize: 19,
  fontFamily: FONTS.bold,
  fontWeight: 'bold',
  marginBottom: 28,
  lineHeight: 26,
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

// Button pressed effect
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