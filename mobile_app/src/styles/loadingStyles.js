import { StyleSheet, StatusBar } from 'react-native';

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
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 60,
  },

  circle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 15,
    borderColor: '#D6A24B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  progressArc: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 15,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#B65A24',
    borderTopColor: '#B65A24',
    transform: [{ rotate: '35deg' }],
  },

  percent: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2B1B12',
  },

  loadingText: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#8B5A2B',
    marginTop: 5,
  },

  bottomText: {
    fontSize: 14,
    color: '#5C4A3A',
    textAlign: 'center',
    marginTop: 55,
  },
});