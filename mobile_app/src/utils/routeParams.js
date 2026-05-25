// routeParams.js


// ----------------------------------------------------
// parseJsonParam(value, fallbackValue)
// ----------------------------------------------------
// Purpose:
// Safely parses JSON route parameters.
//
// Why:
// Route params are passed as strings in Expo Router.
// This helper safely converts them back to objects/arrays.
//
// Parameters:
// value         → JSON string route param
// fallbackValue → default value if parsing fails
//
// Returns:
// Parsed JSON object/array OR fallback value
// ----------------------------------------------------
export function parseJsonParam(value, fallbackValue) {
  try {

    // Parse JSON if value exists
    return value ? JSON.parse(value) : fallbackValue;

  } catch (error) {

    // Log parsing error for debugging
    console.log('Route param parse error:', error);

    // Return fallback instead of crashing app
    return fallbackValue;
  }
}


// ----------------------------------------------------
// toJsonParam(value)
// ----------------------------------------------------
// Purpose:
// Converts JavaScript value into JSON string.
//
// Why:
// Expo Router route params must be strings.
//
// Parameters:
// value → object/array/value
//
// Returns:
// JSON string
// ----------------------------------------------------
export function toJsonParam(value) {

  // Convert value to JSON string
  // Default to empty array if value is missing
  return JSON.stringify(value || []);
}


// ----------------------------------------------------
// buildDetectedSymptomsParams()
// ----------------------------------------------------
// Purpose:
// Builds navigation params for DetectedSymptomsScreen.
//
// Used after:
// - Text input flow
// - Voice input flow
// - Body input flow
//
// Parameters:
// data         → backend response object
// language     → selected language
// voiceFileUri → cached voice file path
//
// Returns:
// Route params object
// ----------------------------------------------------
export function buildDetectedSymptomsParams(
  data,
  language,
  voiceFileUri = ''
) {

  return {

    // English detected symptoms array
    symptoms_en: toJsonParam(data?.symptoms_en),

    // Warlpiri detected symptoms array
    symptoms_wp: toJsonParam(data?.symptoms_wp),

    // Backend confidence score
    confidence: String(data?.confidence || ''),

    // Current selected language
    language: data?.language || language || 'en',

    // Cached backend audio file URI
    voice_file_uri: voiceFileUri,
  };
}


// ----------------------------------------------------
// buildResultParams()
// ----------------------------------------------------
// Purpose:
// Builds navigation params for ResultScreen.
//
// Parameters:
// resultData      → backend classification result
// classifyPayload → symptoms + answers sent to backend
//
// Returns:
// Route params object
// ----------------------------------------------------
export function buildResultParams(resultData, classifyPayload) {

  return {

    // Final result JSON data
    result_data: JSON.stringify(resultData || {}),

    // Original classify request payload
    classify_payload: JSON.stringify(classifyPayload || {}),
  };
}