// Global reusable text styles.
// These styles are shared when screens need common typography.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

// Shared typography styles used when a screen needs quick reusable text styling.
export default StyleSheet.create({
  // Reusable main title text.
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: '#111',
  },

  // Reusable subtitle text.
  subtitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: '#111',
  },

  // Reusable normal body text.
  bodyText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: '#111',
  },

  // Reusable button label text.
  buttonText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: '#000',
  },
});
