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
    paddingHorizontal: 25,
    paddingTop: 80,
  },

  headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#C87936',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },

  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },


  card: {
    width: '76%',
    backgroundColor: '#F5E6C8',
    padding: 18,
    borderRadius: 8,
    marginBottom: 60,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5C2E0A',
    marginBottom: 6,
  },

  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 14,
  },

  answerButton: {
    height: 42,
    borderRadius: 7,
    borderWidth: 1.5,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  radioOuter: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#5C2E0A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: 'transparent',
  },

  radioOuterSelected: {
    borderColor: '#27AE60',
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#27AE60',
  },

  answerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  noneButton: {
    backgroundColor: '#E8D5A0',
    borderColor: '#D4A96A',
  },

  littleButton: {
    backgroundColor: '#D4A96A',
    borderColor: '#C47A3A',
  },

  moderateButton: {
    backgroundColor: '#C47A3A',
    borderColor: '#8B3A1C',
  },

  veryBadButton: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
  },

  unbearableButton: {
    backgroundColor: '#4A0A04',
    borderColor: '#2C0400',
  },

  noneText: {
    color: '#5C2E0A',
  },

  littleText: {
    color: '#3A1A00',
  },

  lightText: {
    color: '#F5E6C8',
  },

  selectedAnswer: {
    transform: [{ scale: 0.98 }],
  },

  pressedAnswer: {
    opacity: 0.8,
  },

  continueButton: {
    width: 230,
    height: 60,
    backgroundColor: '#E3AD35',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    marginTop: 10,
  },

  continuePressed: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  continueText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },

  footer: {
    height: 55,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  footerItem: {
    alignItems: 'center',
  },

  footerIcon: {
    fontSize: 22,
    color: '#fff',
  },

  footerText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 2,
  },
});