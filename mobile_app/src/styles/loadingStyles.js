// Styles for LoadingScreen and LoadingSeverityScreen.
// Defines circular loading screen layout, percentage text, and status message styling.

import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  topText: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 70,
  },

  circleWrapper: {
    width: 230,
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleContent: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  percent: {
    fontSize: 42,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2B1B12',
  },

  loadingText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    letterSpacing: 3,
    color: '#8B5A2B',
    marginTop: 8,
  },

  bottomText: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: '#5C4A3A',
    textAlign: 'center',
    marginTop: 65,
    lineHeight: 26,
  },
});