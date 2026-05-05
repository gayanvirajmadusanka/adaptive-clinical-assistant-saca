import { StyleSheet, StatusBar } from 'react-native';
import { FONTS } from '../constants/fonts';

export const resultTheme = {
  severe: {
    cardBackground: '#8B3A1C',
    header: '#4A0A04',
    headerText: '#F5E6C8',

    severityFill: '#4A0A04',
    severityText: '#F5E6C8',

    startAgain: '#F5E6C8',

    boxBackground: '#F5E6C8',
    boxBorder: '#F5E6C8',
    boxText: '#2C1A0E',
  },

  moderate: {
    cardBackground: '#F5E6C8',
    header: '#8B3A1C',
    headerText: '#F5E6C8',

    severityFill: '#C47A3A',
    severityText: '#F5E6C8',

    startAgain: '#8B3A1C',

    boxBackground: '#F5E6C8',
    boxBorder: '#D4A96A',
    boxText: '#2C1A0E',
  },

  mild: {
    cardBackground: '#F5E6C8',
    header: '#C47A3A',
    headerText: '#2C1A0E',

    severityFill: '#5C8A3C',
    severityText: '#F5E6C8',

    startAgain: '#C47A3A',

    boxBackground: '#F5E6C8',
    boxBorder: '#D4A96A',
    boxText: '#2C1A0E',
  },
};

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

  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 95,
  },

  resultCard: {
    width: '95%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
  },

  headerBar: {
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },

  content: {
    padding: 22,
  },

  speakerButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },

  speakerIcon: {
    width: 28,
    height: 28,
  },

  severityBadge: {
    width: '100%',
    minHeight: 55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  severeBadge: {
    backgroundColor: '#5A0500',
    borderWidth: 1.5,
    borderColor: '#1E0000',
    shadowColor: '#5A0500',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 7,
  },

  severeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  warningIcon: {
    fontSize: 19,
    fontFamily: FONTS.bold,
    marginRight: 10,
    color: '#F5E6C8',
  },

  severityText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  callButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#F5E6C8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#4A0A04',
  },

  callButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  callIcon: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    marginRight: 10,
  },

  callButtonText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#4A0A04',
  },

  infoBox: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 18,
    marginBottom: 18,
    minHeight: 125,
  },

  infoTitle: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  infoText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 7,
    lineHeight: 20,
  },

  startAgainButton: {
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  startAgainText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
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
    fontFamily: FONTS.regular,
    color: '#fff',
  },

  footerText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },

  pressedButton: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

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
    fontFamily: FONTS.bold,
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
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
  },

  languageOptionTextSelected: {
    color: '#F5E6C8',
  },

  confirmText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
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
    fontFamily: FONTS.bold,
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
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  disabledButton: {
    opacity: 0.45,
  },
});
