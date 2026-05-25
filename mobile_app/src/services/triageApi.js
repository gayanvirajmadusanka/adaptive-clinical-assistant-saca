// triageApi.js

import { API_ENDPOINTS } from '../constants/apiEndpoints';
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

// Used for DetectedSymptomsVoice yes/no AND TellUsMoreVoice answers
export function submitAnswerAudio(audioBase64, questionId, language = 'en') {
  return postJson('/answer/audio', {
    audio_b64: audioBase64,
    question_id: questionId,
    language,
  });
}

// Keep this alias so old screens using resolveAnswerAudio still work
export function resolveAnswerAudio(audioBase64, questionId, language = 'en') {
  return submitAnswerAudio(audioBase64, questionId, language);
}

export function extractSymptomsFromBody(symptoms, language = 'en') {
  return postJson(API_ENDPOINTS.EXTRACT_IMAGE, {
    symptoms,
    language,
  });
}