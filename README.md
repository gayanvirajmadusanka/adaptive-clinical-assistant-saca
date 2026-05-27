# SACA - Swin Smart Adaptive Clinical Assistant
 
An AI-powered medical triage system for remote Indigenous Australian communities. SACA accepts patient-described symptoms in English or Warlpiri, extracts clinical features using NLP, and classifies triage urgency using an ensemble ML pipeline.

**Unit:** COS70008 Technology Innovation Project - Semester 1, 2026  
**Community:** Yuendumu, Warlpiri, Northern Territory
 
---

## How It Works

```
User input (text / voice / body map)
        |
        v
  Symptom Extraction (NLP)
  - Stage 1: token + bigram matching against 33-symptom vocabulary
             via synonym map and fuzzy token-sort (spaCy, threshold 0.75+)
  - Stage 2: TF-IDF + Random Forest fallback (200 estimators, 20k features)
             when Stage 1 finds no confident matches
        |
        v
  Follow-up Questions
  - Dynamic mandatory questions (age, duration, severity, gender)
  - Symptom-specific questions loaded from questions.json
        |
        v
  Triage Classification (MLP)
  - Input: TF-IDF symptom features + demographics (age, gender, duration) + severity signal
  - Model: 3-layer MLP (256 -> 128 -> 64), trained on ~176k samples
  - Output: Doctor Consultation or OTC Drug, mapped to Mild / Moderate / Severe
```

**English audio** is transcribed using Whisper (base model) with a medical symptom prompt, then passed through the same NLP pipeline above.

**Warlpiri audio** bypasses ASR entirely. Instead, MFCC features are extracted per voice segment and matched against pre-computed keyword references using Dynamic Time Warping (DTW). Matched Warlpiri keywords are translated to English symptoms via `keyword_symptom_map.json` before entering the NLP pipeline.

For more detail see the training notebooks in `backend/notebooks/` and the evaluation results in `backend/results/`.

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
├── mobile_app/                         # React Native mobile app (Android)
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

---

## Installation - Windows Desktop App

### Step 1: Install SACA

1. Locate the **SACA-1.0.exe** installer (distributed as `SACA-Windows-Installer.zip`)
2. Double-click `SACA-1.0.exe` to launch the installer
3. If Windows SmartScreen appears, click **More info** → **Run anyway**
4. Follow the installation wizard: **Next → Install → Finish**

| Issue | Solution |
|---|---|
| SmartScreen warning | Click More info → Run anyway |
| Antivirus blocking | Add SACA to antivirus exceptions |
| Installation fails | Right-click installer → Run as Administrator |

### Step 2: Install Fonts

SACA requires specific fonts to display correctly. These are bundled inside the SACA installation folder automatically.

> **Note:** Complete Step 1 before running the font installer.

1. Locate **Install-Fonts.bat** inside the installation folder
2. Double-click `Install-Fonts.bat`
3. When the UAC prompt appears, click **Yes** to allow administrator access
4. Wait for the message: `All fonts installed successfully!`
5. Press any key to close the window

### Step 3: Launch SACA

1. Find the **SACA** icon on your Desktop or in the Start Menu
2. Double-click the SACA icon to open the application
3. Wait **30–60 seconds** for the backend to start on first launch
4. The app will open automatically when ready

### Troubleshooting - Windows

**Backend did not respond within 60 seconds**

Step 1 - Kill any existing backend process:
1. Search for **PowerShell** in the Start Menu
2. Right-click PowerShell → **Run as Administrator**
3. Run: `taskkill /F /IM saca_server.exe`

Step 2 - Start the backend manually:
1. Press **Win + R**, type `cmd`, press Enter
2. Run the following commands in order:
   ```
   cd "C:\Program Files\SACA\app"
   saca_server.exe
   ```
3. Wait until the server starting message appears, then leave this window open

Step 3 - Launch SACA from the Desktop or Start Menu shortcut.

**Other common issues**

| Problem | Fix |
|---|---|
| App does not open | Right-click SACA → Run as Administrator |
| Loading screen stuck | Wait up to 60 seconds on first launch |
| Fonts not displaying | Run Install-Fonts.bat as Administrator |
| Antivirus blocking app | Add SACA to antivirus exceptions |
| Port 8000 already in use | Run: `taskkill /F /IM saca_server.exe` |

---

## Installation - Android Mobile App

### Requirements

- Android device running **Android 8.0 (Oreo) or higher**
- At least **500 MB free storage**
- Microphone permission (required for voice input)

### Step 1: Enable Installation from Unknown Sources

SACA is distributed as a standalone APK and is not on the Play Store. You must allow your device to install apps from unknown sources.

**Android 8.0+:**
1. Open **Settings** → **Apps** (or **Application Manager**)
2. Tap the menu → **Special app access** → **Install unknown apps**
3. Find your file manager or browser and toggle **Allow from this source** on

> On some devices this prompt appears automatically when you open the APK - just tap **Settings** in the prompt, enable it, then press Back and tap **Install**.

### Step 2: Install the APK

1. Transfer `SACA.apk` to your Android device (via USB, Google Drive, or email)
2. Open your device's **Files** app and locate `SACA.apk`
3. Tap the file and select **Install**
4. Tap **Install** again on the confirmation screen
5. Tap **Open** once installation completes

### Step 3: Grant Permissions

On first launch SACA will request:

- **Microphone** - required for voice symptom input and spoken answers
- **Audio/Storage** (Android 12 and below) - for recording audio files

Tap **Allow** for each. If you accidentally deny a permission, go to **Settings → Apps → SACA → Permissions** to re-enable it.

### Step 4: First Launch

1. Open the SACA app from your home screen or app drawer
2. The loading screen will appear - **first launch takes 1–3 minutes** while the on-device AI models initialise
3. Subsequent launches are faster (typically under 10 seconds)

> Do not close the app during first launch. The splash screen will show a progress indicator while the backend starts.

### Troubleshooting - Android

| Problem | Fix |
|---|---|
| "App not installed" error | Ensure you have enough storage and that unknown sources is enabled |
| Microphone not working | Go to Settings → Apps → SACA → Permissions → enable Microphone |
| App stuck on loading screen | Wait at least 3 minutes on first launch; force-close and reopen if still stuck |
| Voice not recognised | Speak clearly and close to the microphone; tap your answer manually if needed |
| English offline speech not available | Go to Settings → General Management → Language → Speech Recognition and download the English offline model |
