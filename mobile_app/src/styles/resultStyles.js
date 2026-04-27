import { StyleSheet, StatusBar } from 'react-native';

export const resultTheme = {
  moderate: {
    cardBackground: '#F5E6C8',
    header: '#8B3A1C',
    headerText: '#F5E6C8',
    severityFill: '#C47A3A',
    severityText: '#F5E6C8',
    severityLabel: 'Severity: Moderate',
    line: '#C47A3A',
    startAgain: '#8B3A1C',
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
    paddingTop: 120,
  },

  resultCard: {
    width: '95%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
  },

  /* 🔥 CENTER HEADER */
  headerBar: {
    height: 75,
    justifyContent: 'center',
    alignItems: 'center', // ✅ THIS CENTERS TEXT
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  content: {
    padding: 22,
  },

  severityBadge: {
    width: '100%',
    minHeight: 55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  severityText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  /* 🔥 BIGGER BOXES */
  infoBox: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4A96A',
    padding: 18,
    marginBottom: 18,
    minHeight: 110, // 🔥 ADDED HEIGHT
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  fakeLine: {
    width: '80%',
    height: 7,
    borderRadius: 3,
    opacity: 0.35,
    marginBottom: 10,
  },

  fakeLineSmall: {
    width: '65%',
    height: 7,
    borderRadius: 3,
    opacity: 0.35,
    marginBottom: 10,
  },

  fakeLineTiny: {
    width: '50%',
    height: 7,
    borderRadius: 3,
    opacity: 0.35,
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
    color: '#fff',
  },

  footerText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 2,
  },

  pressedButton: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
});