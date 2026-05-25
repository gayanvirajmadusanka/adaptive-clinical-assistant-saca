// globalStyles.js
// Purpose: Global reusable typography styles.
// These styles are shared across multiple screens
// for consistent text design throughout the app.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

// Shared typography styles used when screens need quick reusable text styling.
export default StyleSheet.create({

  // Main reusable title text
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: '#111',
  },

  // Reusable subtitle text
  subtitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: '#111',
  },

  // Reusable normal paragraph/body text
  bodyText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: '#111',
  },

  // Reusable button text style
  buttonText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: '#000',
  },
});