// bodyInputStyles.js
// Purpose: Styles for BodyInputScreen.
// Shared SafeArea, background, footer, and language modal styles are in commonLayoutStyles.js.

import { StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export default StyleSheet.create({

  // Main container for the screen
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 70,
  },

  // Top title/header box
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

  // Header title text
  headerText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },

  // Gender switch container
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

  // Male/Female button
  genderButton: {
    flex: 1,
    height: 36,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    elevation: 30,
  },

  // Active selected gender button
  genderButtonActive: {
    backgroundColor: '#8B3A1C',
  },

  // Gender text style
  genderText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#5C2E0A',
  },

  // Selected gender text color
  genderTextActive: {
    color: '#F5E6C8',
  },

  // Small instruction text below gender toggle
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

  // Main layout card containing body + parts list
  mainCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 8,
    zIndex: 1,
  },

  // Left section containing body image
  bodyPanel: {
    flex: 1.25,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'visible',
  },

  // Human body image
  bodyImage: {
    width: '175%',
    height: '118%',
    marginBottom: -20,
  },

  // Red clickable body dots
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

  // Dot animation when pressed
  dotPressed: {
    transform: [{ scale: 1.18 }],
    backgroundColor: '#FF304F',
    borderColor: '#FFF',
  },

  // ===============================
  // Dot Positions on Body Image
  // ===============================

  // Head dot position
  dotHead: {
    top: '2%',
    left: '45%',
  },

  // Eye dot position
  dotEye: {
    top: '6%',
    left: '52%',
  },

  // Ear dot position
  dotEar: {
    top: '6%',
    left: '60%',
  },

  // Jaw dot position
  dotJaw: {
    top: '10%',
    left: '55%',
  },

  // Nose dot position
  dotNose: {
    top: '7%',
    left: '45%',
  },

  // Neck dot position
  dotNeck: {
    top: '15%',
    left: '55%',
  },

  // Throat dot position
  dotThroat: {
    top: '14%',
    left: '45%',
  },

  // Chest dot position
  dotChest: {
    top: '22%',
    left: '45%',
  },

  // Stomach dot position
  dotStomach: {
    top: '35%',
    left: '45%',
  },

  // Arm dot position
  dotArm: {
    top: '48%',
    left: '75%',
  },

  // Back dot position
  dotBack: {
    top: '35%',
    left: '60%',
  },

  // Whole body dot position
  dotWholeBody: {
    top: '70%',
    left: '80%',
  },

  // ===============================
  // Tooltip Styling
  // ===============================

  // Tooltip box
  tooltip: {
    position: 'absolute',
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 100,
    elevation: 100,
  },

  // Tooltip text
  tooltipText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },

  // Tooltip positions
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

  // ===============================
  // Right Side Parts List
  // ===============================

  // Right panel containing body part cards
  partsPanel: {
    flex: 0.78,
    paddingLeft: 4,
    paddingRight: 0,
    paddingTop: 10,
  },

  // Title above body parts list
  partsTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#2B1B12',
    marginBottom: 10,
  },

  // Scrollable list spacing
  partsList: {
    paddingBottom: 24,
    gap: 9,
  },

  // Individual body part card
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

  // Pressed body part card style
  partCardPressed: {
    backgroundColor: '#EDE0CE',
    borderColor: '#B5523B',
  },

  // Body part text
  partText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#1A1000',
    marginRight: 6,
  },

  // Speaker button circle
  speakerCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#D2A84B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Speaker button pressed effect
  speakerPressed: {
    backgroundColor: '#8B1E0D',
    borderColor: '#5F1207',
    transform: [{ scale: 0.95 }],
  },

  // Speaker icon image
  speakerIcon: {
    width: 22,
    height: 22,
  },

  // ===============================
  // Back Button Styling
  // ===============================

  // Back button container
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

  // Row layout inside back button
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Back arrow image
  backArrowImage: {
    width: 22,
    height: 22,
    marginRight: 8,
  },

  // Back button pressed effect
  backPressedGrey: {
    backgroundColor: '#A9A9A9',
    transform: [{ scale: 0.96 }],
  },

  // Back button text
  backText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: '#000',
  },
});