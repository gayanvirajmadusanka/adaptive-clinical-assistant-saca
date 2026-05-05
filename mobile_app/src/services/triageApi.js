import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { postJson } from './httpClient';

// Sends typed symptom text to FastAPI for symptom extraction.
export function extractSymptomsFromText(text, language = 'en') {
  return postJson(API_ENDPOINTS.EXTRACT_TEXT, {
    text,
    language,
  });
}

// Sends recorded audio base64 to FastAPI for symptom extraction.
export function extractSymptomsFromAudio(audioBase64, language = 'en') {
  return postJson(API_ENDPOINTS.EXTRACT_AUDIO, {
    audio_b64: audioBase64,
    language,
  });
}

// Loads follow-up questions from FastAPI using detected symptoms.
export function getFollowUpQuestions(symptoms, language = 'en') {
  return postJson(API_ENDPOINTS.QUESTIONS, {
    symptoms,
    language,
  });
}

// Sends symptoms and answers to FastAPI for severity classification.
export function classifySymptoms(symptoms, answers, language = 'en') {
  return postJson(API_ENDPOINTS.CLASSIFY, {
    symptoms,
    answers,
    language,
  });
}
