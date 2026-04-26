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
    width: '90%',
    height: 55,
    backgroundColor: '#209B8D',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },

  headerIcon: {
    position: 'absolute',
    right: 25,
    width: 30,
    height: 30,
  },

  inputBox: {
    width: '88%',
    height: 250,
    backgroundColor: '#E6D7BF',
    borderRadius: 25,
    padding: 20,
    marginBottom: 45,
  },

  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 18,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    textAlignVertical: 'top',
  },

  continueButton: {
    width: 230,
    height: 65,
    backgroundColor: '#E3AD35',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 25,
  },

  continuePressedGreen: {
    backgroundColor: '#27AE60',
    transform: [{ scale: 0.96 }],
  },

  continueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 12,
  },

  arrow: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000',
  },

  backButton: {
    width: 140,
    height: 55,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#F5EAD8',
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