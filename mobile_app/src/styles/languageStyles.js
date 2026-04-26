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
    paddingHorizontal: 25,
    paddingTop: 90,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 70,
  },

  languageButton: {
    width: '78%',
    height: 75,
    backgroundColor: '#D2B1B1',
    borderWidth: 1.5,
    borderColor: '#C94B4B',
    borderRadius: 28,
    marginBottom: 45,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },

  languageText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },

  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EEE',
  },

  radioSelected: {
    backgroundColor: '#2ECC71', // green selected
    borderWidth: 4,
    borderColor: '#EEE',
  },

  continueButton: {
    width: 250,
    height: 75,
    backgroundColor: '#E3AD35',
    borderRadius: 30,
    marginTop: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  continuePressedGreen: {
    backgroundColor: '#27AE60', // green flash on press
    transform: [{ scale: 0.96 }],
  },

  continueText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    lineHeight: 27,
    marginRight: 20,
  },

  arrow: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#000',
  },
});