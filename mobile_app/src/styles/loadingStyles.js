// Styles for LoadingScreen and LoadingSeverityScreen.
// Defines circular loading screen layout, percentage text, and status message styling.

import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
    // Main safe area background.
safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

    // Wrapper with status bar spacing.
wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },

    // Background image area.
background: {
    flex: 1,
  },

    // Centered loading container.
container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

    // Top loading message.
topText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 60,
  },

    // Circular progress wrapper.
circleWrapper: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },

    // Text content inside progress circle.
circleContent: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },

    // Percentage number text.
percent: {
    fontSize: 34,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2B1B12',
  },

    // LOADING/DONE label.
loadingText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    letterSpacing: 3,
    color: '#8B5A2B',
    marginTop: 6,
  },

    // Bottom helper/status text.
bottomText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#5C4A3A',
    textAlign: 'center',
    marginTop: 55,
  },
});
