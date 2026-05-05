// Safely parses a JSON route parameter and returns a fallback when parsing fails.
export function parseJsonParam(value, fallbackValue) {
  try {
    return value ? JSON.parse(value) : fallbackValue;
  } catch (error) {
    console.log('Route param parse error:', error);
    return fallbackValue;
  }
}

// Converts a value into a JSON string route parameter.
export function toJsonParam(value) {
  return JSON.stringify(value || []);
}

// Builds route params for the detected symptoms screen.
export function buildDetectedSymptomsParams(data, language, voiceFileUri = '') {
  return {
    symptoms_en: toJsonParam(data?.symptoms_en),
    symptoms_wp: toJsonParam(data?.symptoms_wp),
    confidence: String(data?.confidence || ''),
    language: data?.language || language || 'en',
    voice_file_uri: voiceFileUri,
  };
}

// Builds route params for the final result screen.
export function buildResultParams(resultData, classifyPayload) {
  return {
    result_data: JSON.stringify(resultData || {}),
    classify_payload: JSON.stringify(classifyPayload || {}),
  };
}
