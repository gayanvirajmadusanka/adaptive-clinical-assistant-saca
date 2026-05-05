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
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 60,
  },

  circleWrapper: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleContent: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },

  percent: {
    fontSize: 34,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2B1B12',
  },

  loadingText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    letterSpacing: 3,
    color: '#8B5A2B',
    marginTop: 6,
  },

  bottomText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#5C4A3A',
    textAlign: 'center',
    marginTop: 55,
  },
});
