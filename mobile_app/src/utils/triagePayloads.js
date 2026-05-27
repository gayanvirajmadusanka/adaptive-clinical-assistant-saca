// triagePayloads.js


// ----------------------------------------------------
// getSymptomsForApi(symptomsEn, symptomsWp)
// ----------------------------------------------------
// Purpose:
// Chooses which symptom list should be sent to backend.
//
// Logic:
// 1. Use English symptoms first
// 2. If English list is empty → use Warlpiri symptoms
//
// Parameters:
// symptomsEn → English symptoms array
// symptomsWp → Warlpiri symptoms array
//
// Returns:
// Final symptoms array for backend API
// ----------------------------------------------------
export function getSymptomsForApi(symptomsEn = [], symptomsWp = []) {

  // Prefer English symptoms if available
  return symptomsEn.length > 0 ? symptomsEn : symptomsWp;
}


// ----------------------------------------------------
// buildClassifyPayload()
// ----------------------------------------------------
// Purpose:
// Builds payload object for severity classification API.
//
// Used by:
// - LoadingSeverityScreen
// - ResultScreen
//
// Parameters:
// symptomsEn → English symptoms array
// symptomsWp → Warlpiri symptoms array
// answers    → formatted answer list
// language   → selected app language
//
// Returns:
// Backend classify request payload
// ----------------------------------------------------
export function buildClassifyPayload(
  symptomsEn,
  symptomsWp,
  answers,
  language
) {

  return {

    // Final symptom list sent to backend
    symptoms: getSymptomsForApi(symptomsEn, symptomsWp),

    // User answer list
    answers: answers || [],

    // Current selected language
    language: language || 'en',
  };
}


// ----------------------------------------------------
// buildAnswerList(answersObject)
// ----------------------------------------------------
// Purpose:
// Converts frontend answer object into backend API format.
//
// Example:
// {
//   q1: { question_id: 1, answer_id: 2 }
// }
//
// becomes:
//
// [
//   { question_id: 1, answer_id: 2 }
// ]
//
// Parameters:
// answersObject → frontend answers object
//
// Returns:
// Array formatted for backend classify API
// ----------------------------------------------------
export function buildAnswerList(answersObject) {

  // Convert object values into API answer array
  return Object.values(answersObject || {}).map((item) => ({

    // Backend question identifier
    question_id: item.question_id,

    // Backend selected answer identifier
    answer_id: item.answer_id,
  }));
}