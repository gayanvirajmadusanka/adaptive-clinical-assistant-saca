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
    alignItems: 'center',
    paddingHorizontal: 35,
    paddingTop: 55,
    paddingBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 12,
  },

  logo: {
    width: 120,
    height: 120,
    borderRadius: 18,
    marginBottom: 18,
  },

  subTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 15,
  },

  paragraph: {
    fontSize: 16,
    color: '#111',
    textAlign: 'left',
    lineHeight: 22,
    marginBottom: 18,
    fontWeight: '500',
  },

  backButton: {
    backgroundColor: '#E3AD35',
    width: 220,
    height: 70,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    elevation: 4,
  },

  backPressedGreen: {
    backgroundColor: '#27AE60',
    transform: [{ scale: 0.96 }],
  },

  backText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    lineHeight: 26,
  },
});