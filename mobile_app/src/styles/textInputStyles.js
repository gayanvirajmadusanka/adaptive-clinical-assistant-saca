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
    paddingTop: 80,
  },

  headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#6F8F83',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  headerText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  headerIcon: {
    position: 'absolute',
    right: 25,
    width: 30,
    height: 30,
  },

  inputBox: {
    width: '88%',
    height: 250,
    backgroundColor: '#E6D7BF',
    borderRadius: 25,
    padding: 20,
    marginBottom: 45,
  },

  questionText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: '600',
    color: '#555',
    marginBottom: 18,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#222',
    textAlignVertical: 'top',
  },

  continueButton: {
    width: 230,
    height: 65,
    backgroundColor: '#E3AD35',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 25,
  },

  continuePressedGreen: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.96 }],
  },

  continueText: {
    fontSize: 24,
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
