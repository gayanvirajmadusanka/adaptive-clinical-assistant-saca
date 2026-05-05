// Chooses English symptoms first, then Warlpiri symptoms if English is empty.
export function getSymptomsForApi(symptomsEn = [], symptomsWp = []) {
  return symptomsEn.length > 0 ? symptomsEn : symptomsWp;
}

// Builds the classify request payload used by loading and result screens.
export function buildClassifyPayload(symptomsEn, symptomsWp, answers, language) {
  return {
    symptoms: getSymptomsForApi(symptomsEn, symptomsWp),
    answers: answers || [],
    language: language || 'en',
  };
}

// Converts answer object values into the API answer format.
export function buildAnswerList(answersObject) {
  return Object.values(answersObject || {}).map((item) => ({
    question_id: item.question_id,
    answer_id: item.answer_id,
  }));
}
