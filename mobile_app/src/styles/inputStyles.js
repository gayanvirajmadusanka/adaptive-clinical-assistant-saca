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
    paddingTop: 90,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#111',
  },

  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 30,
    color: '#333',
  },

  card: {
    width: 160,
    height: 130,
    backgroundColor: '#2E8B7E',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    elevation: 4,
  },

  voiceCard: {
    backgroundColor: '#8E6C9A',
  },

  bodyCard: {
    backgroundColor: '#D96C8C',
  },

  cardPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  cardImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },

  cardText: {
    fontSize: 18,
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