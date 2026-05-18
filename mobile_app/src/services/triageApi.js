// Import API endpoint paths
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// Import reusable HTTP POST function
import { postJson } from './httpClient';

export function extractSymptomsFromText(text, language = 'en') {
  return postJson(API_ENDPOINTS.EXTRACT_TEXT, {
    text,
    language,
  });
}

export function extractSymptomsFromAudio(audioBase64, language = 'en') {
  return postJson(API_ENDPOINTS.EXTRACT_AUDIO, {
    audio_b64: audioBase64,
    language,
  });
}

export function getFollowUpQuestions(symptoms, language = 'en') {
  return postJson(API_ENDPOINTS.QUESTIONS, {
    symptoms,
    language,
  });
}

export function classifySymptoms(symptoms, answers, language = 'en') {
  return postJson(API_ENDPOINTS.CLASSIFY, {
    symptoms,
    answers,
    language,
  });
}

export async function resolveAnswerAudio(audioBase64, questionId, language) {
  return postJson('/answer/audio', {
    audio_b64: audioBase64,
    question_id: questionId,
    language: language || 'en',
  });
}

export async function extractSymptomsFromBody(symptoms, language = 'en') {
  return postJson(API_ENDPOINTS.EXTRACT_IMAGE, {
    symptoms,
    language,
  });
}