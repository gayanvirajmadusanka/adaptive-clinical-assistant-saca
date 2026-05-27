// triageApi.js

// Import all backend API endpoint constants
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// Import reusable POST request helper
import { postJson } from './httpClient';


// Extract symptoms from typed text input
// Sends user text and selected language to backend
export function extractSymptomsFromText(text, language = 'en') {
  return postJson(API_ENDPOINTS.EXTRACT_TEXT, {
    text,
    language,
  });
}


// Extract symptoms from recorded audio
// Sends base64 audio and selected language to backend
export function extractSymptomsFromAudio(audioBase64, language = 'en') {
  return postJson(API_ENDPOINTS.EXTRACT_AUDIO, {
    audio_b64: audioBase64,
    language,
  });
}


// Request dynamic follow-up questions from backend
// Uses detected symptoms and selected language
export function getFollowUpQuestions(symptoms, language = 'en') {
  return postJson(API_ENDPOINTS.QUESTIONS, {
    symptoms,
    language,
  });
}


// Send symptoms + answers to backend ML model
// Backend returns severity classification result
export function classifySymptoms(symptoms, answers, language = 'en') {
  return postJson(API_ENDPOINTS.CLASSIFY, {
    symptoms,
    answers,
    language,
  });
}


// Used for:
// 1. DetectedSymptomsVoice yes/no answer
// 2. TellUsMoreVoice spoken answers
//
// Sends recorded answer audio to backend
export function submitAnswerAudio(audioBase64, questionId, language = 'en') {
  return postJson('/answer/audio', {
    audio_b64: audioBase64,
    question_id: questionId,
    language,
  });
}


// Backward compatibility alias
// Older screens using resolveAnswerAudio() will still work
export function resolveAnswerAudio(audioBase64, questionId, language = 'en') {
  return submitAnswerAudio(audioBase64, questionId, language);
}


// Submit an STT transcript for keyword-based answer matching.
// Used on Android English where faster-whisper is not available.
export function submitAnswerText(text, questionId, language = 'en') {
  return postJson('/answer/text', {
    text,
    question_id: questionId,
    language,
  });
}


// Extract symptoms selected from body map/body input flow
// Sends selected symptoms and language to backend
export function extractSymptomsFromBody(symptoms, language = 'en') {
  return postJson(API_ENDPOINTS.EXTRACT_IMAGE, {
    symptoms,
    language,
  });
}