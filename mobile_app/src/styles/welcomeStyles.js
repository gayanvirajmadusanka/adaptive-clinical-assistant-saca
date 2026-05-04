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
    width: '100%',
    height: '100%',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  logo: {
    width: 220,
    height: 220,
    marginBottom: 15,
    borderRadius: 20,
  },

  appName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 55,
    color: '#111',
  },

  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60,
    color: '#111',
    lineHeight: 42,
  },

  startButton: {
    backgroundColor: '#E3AD35',
    width: 250,
    height: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    elevation: 4,
  },

  startPressedGreen: {
  backgroundColor: '#8B3A1C', 
  borderColor: '#5C2E0A',     
  transform: [{ scale: 0.96 }],
},

  startButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    lineHeight: 32,
  },

  aboutText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E65B8',
    textDecorationLine: 'underline',
  },
});