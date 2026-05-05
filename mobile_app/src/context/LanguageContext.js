// Import React hooks for context and state management
import React, { createContext, useContext, useState } from 'react';

// Import translation object containing all language key-value pairs
import { translations } from '../constants/translations';


// ----------------------------------------------------
// Create Language Context
// ----------------------------------------------------
// Purpose:
// Provides global language state across the entire app.
//
// Why:
// Avoids passing language manually to every screen (prop drilling).
// Enables dynamic language switching anywhere in the app.
const LanguageContext = createContext();


// ----------------------------------------------------
// LanguageProvider Component
// ----------------------------------------------------
// Purpose:
// Wraps the app and provides language-related data/functions.
//
// Provides:
// lang     → current selected language ('en' or 'wp')
// setLang  → function to change language
// t        → translation function
// ----------------------------------------------------
export function LanguageProvider({ children }) {

  // Stores current language (default = English)
  const [lang, setLang] = useState('en');

  // ----------------------------------------------------
  // t(key) → Translation Function
  // ----------------------------------------------------
  // Purpose:
  // Returns translated text based on selected language.
  //
  // Logic:
  // 1. Check translation in selected language
  // 2. If not found → fallback to English
  // 3. If still not found → return key itself
  //
  // Example:
  // t('continue') → "Continue" or Warlpiri equivalent
  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  // Provide language data and functions to all child components
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}


// ----------------------------------------------------
// useLanguage Hook
// ----------------------------------------------------
// Purpose:
// Custom hook to easily access language context anywhere.
//
// Usage:
// const { lang, setLang, t } = useLanguage();
//
// Why:
// Simplifies accessing global language state in screens
// ----------------------------------------------------
export function useLanguage() {
  return useContext(LanguageContext);
}