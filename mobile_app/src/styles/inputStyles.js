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

  /* 🔥 CARD BASE */
  card: {
    width: 160,
    height: 130,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,

    // Shadow
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  /* 🎨 COLORS */
  textCard: {
    backgroundColor: '#6F8F83',
    borderColor: '#2E3D36',
  },

  voiceCard: {
    backgroundColor: '#D9C27A',
    borderColor: '#7A6420',
  },

  bodyCard: {
    backgroundColor: '#C85B3A',
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

  /* 🔥 MODAL OVERLAY */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  /* 🔥 MODAL BOX */
  languageModal: {
    width: '90%',
    backgroundColor: '#F5E6C8',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#8B3A1C',
    padding: 22,
    alignItems: 'center',
    elevation: 8,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1A0E',
    marginBottom: 20,
  },

  languageOption: {
    width: '100%',
    height: 55,
    backgroundColor: '#E8D5A0',
    borderColor: '#D4A96A',
    borderWidth: 2,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  languageOptionSelected: {
    backgroundColor: '#8B3A1C',
    borderColor: '#5C2E0A',
    transform: [{ scale: 0.97 }],
  },

  languageOptionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C2E0A',
  },

  languageOptionTextSelected: {
    color: '#F5E6C8',
  },

  confirmText: {
    fontSize: 15,
    color: '#2C1A0E',
    marginTop: 8,
    marginBottom: 18,
    textAlign: 'center',
  },

  modalButtonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cancelButton: {
    width: '45%',
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#F5EAD8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },

  confirmButton: {
    width: '45%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3AD35',
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },

  disabledButton: {
    opacity: 0.45,
  },
});