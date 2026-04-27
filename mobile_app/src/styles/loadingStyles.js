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
  },

  circle: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 18,
    borderColor: '#D6A24B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressArc: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 18,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#B65A24',
    borderTopColor: '#B65A24',
    transform: [{ rotate: '35deg' }],
  },

  percent: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2B1B12',
  },

  loadingText: {
    fontSize: 18,
    letterSpacing: 3,
    color: '#8B5A2B',
    marginTop: 8,
  },
});