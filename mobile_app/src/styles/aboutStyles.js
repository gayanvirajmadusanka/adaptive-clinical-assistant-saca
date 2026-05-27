// aboutStyles.js
// Purpose: Screen-specific styles for AboutScreen.

// Import StyleSheet to create React Native styles
import { StyleSheet } from 'react-native';

// Import custom font constants
import { FONTS } from '../constants/fonts';

// Export all styles for AboutScreen
export default StyleSheet.create({

  // Main scroll container
  // Controls spacing and alignment of screen content
  container: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 95,
    paddingBottom: 50,
  },

  // Main heading
  // Used for the About screen title
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },

  // SACA logo
  // Displays the app logo image
  logo: {
    width: 130,
    height: 130,
    borderRadius: 18,
    marginBottom: 22,
  },

  // Subtitle text
  // Small heading shown below logo
  subTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 22,
  },

  // Main about paragraph
  // Justified and aligned evenly on both sides.
  paragraph: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#111',
    textAlign: 'justify',
    lineHeight: 30,
    marginBottom: 28,
    fontWeight: '500',
    width: '100%',
  },

  // Back button
  // Same style as TextInputScreen.
  backButton: {
    width: 170,
    height: 58,
    backgroundColor: '#F5EAD8',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    elevation: 3,
  },

  // Back button pressed state
  // Slightly shrinks and darkens button when pressed
  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  // Back button content row
  // Aligns icon and text horizontally
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Back arrow image
  // Styling for arrow icon inside back button
  backArrowImage: {
    width: 26,
    height: 26,
    marginRight: 8,
  },

  // Back button text
  // Text styling for the back button label
  backText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});