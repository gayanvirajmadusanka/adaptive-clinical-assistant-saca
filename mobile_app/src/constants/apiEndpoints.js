// apiEndpoints.js


// ----------------------------------------------------
// API_ENDPOINTS
// ----------------------------------------------------
// Purpose:
// Stores all backend API endpoint paths in one place.
//
// Why:
// 1. Avoids hardcoding endpoint strings everywhere
// 2. Makes backend URL management easier
// 3. Keeps API calls clean and reusable
//
// Usage Example:
// API_ENDPOINTS.EXTRACT_TEXT
// → '/extract/text'
//
// Combined with BASE_URL inside httpClient.js:
// http://192.168.x.x:8000/extract/text
// ----------------------------------------------------
export const API_ENDPOINTS = {

  // Extract symptoms from typed text input
  EXTRACT_TEXT: '/extract/text',

  // Extract symptoms from recorded audio input
  EXTRACT_AUDIO: '/extract/audio',

  // Extract symptoms from body-map/body input flow
  EXTRACT_IMAGE: '/extract/image',

  // Get dynamic follow-up questions
  QUESTIONS: '/questions',

  // Classify severity using symptoms + answers
  CLASSIFY: '/classify',
};