// Import API endpoint paths (e.g., /extract/text, /questions, etc.)
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// Import reusable HTTP POST function
import { postJson } from './httpClient';


// ----------------------------------------------------
// extractSymptomsFromText(text, language)
// ----------------------------------------------------
// Purpose:
// Sends user-typed symptom text to FastAPI for processing.
//
// Why:
// The backend performs NLP to:
// - Extract symptoms
// - Translate (if needed)
// - Generate voice response
//
// Parameters:
// text     → User symptom description (string)
// language → Selected language (default = 'en')
//
// Returns:
// JSON response containing detected symptoms and metadata
// ----------------------------------------------------
export function extractSymptomsFromText(text, language = 'en') {
  return postJson(API_ENDPOINTS.EXTRACT_TEXT, {
    text,       // User input text
    language,   // Language for processing
  });
}


// ----------------------------------------------------
// extractSymptomsFromAudio(audioBase64, language)
// ----------------------------------------------------
// Purpose:
// Sends recorded audio (converted to base64) to FastAPI.
//
// Why:
// Backend converts speech → text → extracts symptoms.
//
// Parameters:
// audioBase64 → Base64 encoded audio file
// language    → Selected language (default = 'en')
//
// Returns:
// JSON response containing detected symptoms and voice output
// ----------------------------------------------------
export function extractSymptomsFromAudio(audioBase64, language = 'en') {
  return postJson(API_ENDPOINTS.EXTRACT_AUDIO, {
    audio_b64: audioBase64, // Audio data in base64 format
    language,
  });
}


// ----------------------------------------------------
// getFollowUpQuestions(symptoms, language)
// ----------------------------------------------------
// Purpose:
// Requests dynamic follow-up questions from FastAPI.
//
// Why:
// Based on detected symptoms, backend generates
// additional diagnostic questions.
//
// Parameters:
// symptoms → Array of detected symptoms
// language → Selected language
//
// Returns:
// JSON response containing list of questions
// ----------------------------------------------------
export function getFollowUpQuestions(symptoms, language = 'en') {
  return postJson(API_ENDPOINTS.QUESTIONS, {
    symptoms,  // Symptoms array
    language,
  });
}


// ----------------------------------------------------
// classifySymptoms(symptoms, answers, language)
// ----------------------------------------------------
// Purpose:
// Sends symptoms and user answers to FastAPI for final classification.
//
// Why:
// Backend ML model determines:
// - Severity (mild/moderate/severe)
// - Recommendations
//
// Parameters:
// symptoms → Array of detected symptoms
// answers  → User responses from TellUsMore screen
// language → Selected language
//
// Returns:
// JSON response containing severity result
// ----------------------------------------------------
export function classifySymptoms(symptoms, answers, language = 'en') {
  return postJson(API_ENDPOINTS.CLASSIFY, {
    symptoms, // Symptoms array
    answers,  // Answer list from follow-up questions
    language,
  });
}