import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

// Shared typography styles used when a screen needs quick reusable text styling.
export default StyleSheet.create({
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: '#111',
  },

  subtitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: '#111',
  },

  bodyText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: '#111',
  },

  buttonText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: '#000',
  },
});
