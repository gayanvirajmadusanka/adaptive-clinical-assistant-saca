// bodyInputStyles.js
// Purpose: Styles for BodyInputScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 70,
  },

  headerBar: {
    width: '92%',
    height: 60,
    backgroundColor: '#B5523B',
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  headerText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  genderToggle: {
    width: 220,
    height: 46,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#D4A96A',
    backgroundColor: '#F5E6C8',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 4,
    marginBottom: 8,
    zIndex: 20,
    elevation: 20,
  },

  genderButton: {
    flex: 1,
    height: 36,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    elevation: 30,
  },

  genderButtonActive: {
    backgroundColor: '#8B3A1C',
  },

  genderText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
  },

  genderTextActive: {
    color: '#F5E6C8',
  },

  hintText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#6E5C49',
    marginBottom: 10,
    marginTop: 4,
    paddingHorizontal: 12,
    zIndex: 20,
  },

  mainCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 8,
    zIndex: 1,
  },

  bodyPanel: {
    flex: 1.25,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'visible',
  },

  bodyImage: {
    width: '175%',
    height: '118%',
    marginBottom: -20,
  },

  bodyDot: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#D6001C',
    borderWidth: 3,
    borderColor: '#FFF',
    zIndex: 50,
    elevation: 50,
  },

  dotPressed: {
    transform: [{ scale: 1.18 }],
    backgroundColor: '#FF304F',
    borderColor: '#FFF',
  },

  // Dot positions matched to the current large body image.
  dotHead: {
    top: '2%',
    left: '45%',
  },

  dotEye: {
    top: '6%',
    left: '52%',
  },

  dotEar: {
    top: '6%',
    left: '60%',
  },

  dotJaw: {
    top: '10%',
    left: '55%',
  },

  dotNose: {
    top: '7%',
    left: '45%',
  },


  dotNeck: {
    top: '15%',
    left: '55%',
  },

  dotThroat: {
    top: '14%',
    left: '45%',
  },

  dotChest: {
    top: '22%',
    left: '45%',
  },

  dotStomach: {
    top: '35%',
    left: '45%',
  },

  dotArm: {
    top: '48%',
    left: '75%',
  },

  dotBack: {
    top: '35%',
    left: '60%',
  },

  dotWholeBody: {
    top: '70%',
    left: '80%',
  },

  tooltip: {
    position: 'absolute',
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 100,
    elevation: 100,
  },

  tooltipText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },

  tooltipHead: {
    top: '0%',
    left: '75%',
  },

  tooltipEye: {
    top: '5%',
    left: '75%',
  },

  tooltipEar: {
    top: '6%',
    left: '75%',
  },

   tooltipNose: {
    top: '6%',
    left: '75%',
  },

  tooltipJaw: {
    top: '10%',
    left: '75%',
  },

  tooltipNeck: {
    top: '15%',
    left: '75%',
  },

  tooltipThroat: {  
    top: '15%',
    left: '75%',
  },

  tooltipChest: {
    top: '22%',
    left: '75%',
  },

  tooltipStomach: {
    top: '35%',
    left: '75%',
  },

  tooltipBack: {
    top: '35%',
    left: '75%',
  },

  tooltipArm: {
    top: '48%',
    left: '80%',
  },

  tooltipWholeBody: {
    top: '65%',
    left: '62%',
  },

  partsPanel: {
    flex: 0.78,
    paddingLeft: 4,
    paddingRight: 0,
    paddingTop: 10,
  },

  partsTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2B1B12',
    marginBottom: 10,
  },

  partsList: {
    paddingBottom: 24,
    gap: 9,
  },

  partCard: {
    width: '100%',
    height: 52,
    borderRadius: 30,
    backgroundColor: '#FFFDF8',
    borderWidth: 1.5,
    borderColor: '#E0CDB0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 7,
    elevation: 2,
  },

  partCardPressed: {
    backgroundColor: '#EDE0CE',
    borderColor: '#B5523B',
  },

  partText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A1000',
    marginRight: 6,
  },

  speakerCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#D2A84B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  speakerPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.95 }],
  },

  speakerIcon: {
    width: 22,
    height: 22,
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
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 12,
  },

  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrowImage: {
    width: 22,
    height: 22,
    marginRight: 8,
  },

  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  backText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },
});