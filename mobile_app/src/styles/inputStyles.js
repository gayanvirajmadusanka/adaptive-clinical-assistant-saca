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
  },

  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 30,
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

  cardIcon: {
    fontSize: 30,
    marginBottom: 10,
  },

  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  footer: {
    height: 70,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  footerItem: {
    alignItems: 'center',
  },

  footerIcon: {
    fontSize: 26,
    color: '#fff',
  },

  footerText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 3,
  },
});