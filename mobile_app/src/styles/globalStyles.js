// Global reusable text styles.
// These styles are shared when screens need common typography.

// Import StyleSheet from React Native
import { StyleSheet } from 'react-native';

// Import custom font constants
import { FONTS } from '../constants/fonts';

// Shared typography styles used when a screen needs quick reusable text styling.
export default StyleSheet.create({

  // Reusable main title text.
  // Used for large screen headings.
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: '#111',
  },

  // Reusable subtitle text.
  // Used for smaller headings or section titles.
  subtitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: '#111',
  },

  // Reusable normal body text.
  // Used for paragraphs and regular content.
  bodyText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: '#111',
  },

  // Reusable button label text.
  // Used for button titles across screens.
  buttonText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: '#000',
  },
});