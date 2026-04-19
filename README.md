# SACA - Swin Smart Adaptive Clinical Assistant
 
An AI-powered medical triage system for remote Indigenous Australian communities. SACA accepts patient-described symptoms in English or Warlpiri, extracts clinical features using NLP, and classifies triage urgency using an ensemble ML pipeline.

**Unit:** COS70008 Technology Innovation Project - Semester 1, 2026  
**Community:** Yuendumu, Warlpiri, Northern Territory
 
---
 
## Team
 
| Name | Student ID | Component |
|---|---|---|
| Yoshani Malinka Ranaweera | 105323854 | ML Pipeline / Backend API |
| Gayan Viraj Madusanka | 105699018 | Desktop Application (JavaFX) |
| Fathima Hamra Imam | 105708480 | NLP / Speech Recognition |
| Ishant Upadhyay | 105559688 | Mobile Application (React Native) |
 
---
 
## Project Structure
 
```
adaptive-clinical-assistant-saca/
├── backend/                        # Python / FastAPI backend
│   ├── api/                        # FastAPI app and routes
│   ├── ml/                         # ML inference pipeline
│   ├── nlp/                        # NLP and speech recognition modules
│   ├── notebooks/                  # Preprocessing and training notebooks
│   ├── tests/                      # Unit tests
│   ├── results/                    # Training charts and evaluation results
│   ├── data/                       # Raw dataset and Warlpiri phrase map
│   └── requirements.txt
├── mobile/                         # React Native mobile app (Android)
│   ├── android/                    # Android native configuration
│   ├── assets/                     # Images, icons, and other static files
│   ├── src/                        # Source files of mobile app
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Button.js           # Custom button component
│   │   │   ├── InputField.js       # Text input component
│   │   │   ├── VoiceInput.js       # Voice input component
│   │   │   ├── BodyMap.js          # Body map component
│   │   │   └── LanguageSelector.js # Language selection component
│   │   ├── screens/                # Application screens
│   │   │   ├── WelcomeScreen.js
│   │   │   ├── LanguageScreen.js
│   │   │   ├── InputScreen.js
│   │   │   ├── VoiceScreen.js
│   │   │   ├── BodyMapScreen.js
│   │   │   └── ResultScreen.js
│   │   ├── navigation/             # Navigation configuration
│   │   │   └── AppNavigator.js
│   │   ├── services/               # API and backend communication
│   │   │   └── apiService.js
│   │   ├── styles/                 # Styling files
│   │   │   └── globalStyles.js
│   │   ├── utils/                  # Helper functions
│   │   │   └── helpers.js
│   │   └── App.js                  # Main entry point of mobile app
│   ├── package.json                # Dependencies and scripts
│   └── README.md                   # Mobile app documentation
├── windows_app/                    # JavaFX desktop app (Windows)
│   ├── src/                        # Source files of Windows app
│   │   ├── main/  
│   │   │   ├── java/
│   │   │   │   ├── controller/     # Java Controller files 
│   │   │   │   ├── model/          # Java Models
│   │   │   │   ├── MainApp.java    # Main class of windows app
│   │   │   │   ├── resources/      # Includes all resources
│   │   │   │   │   ├── icons       # Supportive icons
│   │   │   │   │   ├── images      # Supportive images/ backgrounds 
│   │   │   │   │   ├── styles      # Contains CSS styles
│   │   │   │   │   ├── view        # FXML files
│   ├── pom.xml                     # Core configurations for Windows app
└── README.md
```
