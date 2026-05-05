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
    paddingHorizontal: 25,
    paddingTop: 120,
  },

  title: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 80,
  },

  button: {
    width: '78%',
    height: 75,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  /* DEFAULT (ENGLISH STYLE FOR BOTH) */
  defaultButton: {
    backgroundColor: '#E8D5A0',
    borderColor: '#D4A96A',
  },

  defaultText: {
    color: '#5C2E0A',
  },

  /* SELECTED → WARLPIRI STYLE */
  selectedButton: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.96 }],
  },

  selectedText: {
    color: '#F5E6C8',
  },

  text: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },
});
