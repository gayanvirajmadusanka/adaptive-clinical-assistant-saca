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

  symptomBox: {
    width: '92%',
    minHeight: 140,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: '#B9A98E',
    borderRadius: 8,
    padding: 25,
    marginBottom: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  symptomText: {
    fontSize: 18,
    color: '#000',
    lineHeight: 30,
    flex: 1,
  },

  speakerIcon: {
    width: 35,
    height: 35,
    marginLeft: 10,
    alignSelf: 'center',
  },

  questionText: {
    fontSize: 16,
    color: '#111',
    marginBottom: 12,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 25,
    marginBottom: 30,
  },

  choiceButton: {
    width: 100,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8D5A0',
    borderWidth: 1.5,
    borderColor: '#D4A96A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  choicePressed: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.96 }],
  },

  choiceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#5C2E0A',
  },

  backButton: {
    width: 150,
    height: 55,
    backgroundColor: '#F5EAD8',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  backText: {
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