import { API_CONFIG } from '../config/apiConfig';

// Builds a full API URL from the base URL and endpoint path.
export function buildApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Sends a JSON POST request and returns the parsed JSON response.
export async function postJson(endpoint, payload) {
  const response = await fetch(buildApiUrl(endpoint), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(responseText || 'API request failed');
  }

  return responseText ? JSON.parse(responseText) : null;
}
