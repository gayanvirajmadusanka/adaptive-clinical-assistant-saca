import { StyleSheet, StatusBar } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  wrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight, // ✅ keep this since it fixed your safe area
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

  /* 🔥 CARD BASE */
  card: {
    width: 160,
    height: 130,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,

    // Shadow for Android + iOS
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  /* 🎨 COLORS (MATCH IMAGE) */
  textCard: {
    backgroundColor: '#6F8F83',   // green
    borderColor: '#2E3D36',
  },

  voiceCard: {
    backgroundColor: '#D9C27A',   // yellow
    borderColor: '#7A6420',
  },

  bodyCard: {
    backgroundColor: '#C85B3A',   // orange/red
    borderColor: '#6E1F12',
  },

  /* 👆 PRESS EFFECT */
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
    letterSpacing: 1,
  },

  /* 🔻 FOOTER */
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