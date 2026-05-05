// Import API configuration (base URL, endpoints, etc.)
import { API_CONFIG } from '../config/apiConfig';

// ----------------------------------------------------
// buildApiUrl(endpoint)
// ----------------------------------------------------
// Purpose:
// Combines the base API URL with a specific endpoint.
//
// Why:
// Avoids repeating BASE_URL everywhere in the app.
// Makes API calls cleaner and easier to maintain.
//
// Example:
// buildApiUrl('/extract/text')
// → http://192.168.0.10:8000/extract/text
// ----------------------------------------------------
export function buildApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}


// ----------------------------------------------------
// postJson(endpoint, payload)
// ----------------------------------------------------
// Purpose:
// Sends a POST request with JSON data to the backend API.
//
// Why:
// Standardizes all API calls in one place.
// Handles request + response + error handling.
//
// Parameters:
// endpoint → API path (e.g., '/extract/text')
// payload  → Data to send (JavaScript object)
//
// Flow:
// 1. Build full API URL
// 2. Send POST request with JSON body
// 3. Read response as text
// 4. Check if request was successful
// 5. Convert response text → JSON
//
// Returns:
// Parsed JSON response from backend
//
// Throws:
// Error if API response is not successful
// ----------------------------------------------------
export async function postJson(endpoint, payload) {

  // Send POST request to backend
  const response = await fetch(buildApiUrl(endpoint), {
    method: 'POST',

    // Tell backend we are sending JSON data
    headers: {
      'Content-Type': 'application/json',
    },

    // Convert JavaScript object → JSON string
    body: JSON.stringify(payload),
  });

  // Read response as plain text first
  // (safer than directly calling response.json())
  const responseText = await response.text();

  // If request failed → throw error
  if (!response.ok) {
    throw new Error(responseText || 'API request failed');
  }

  // Convert text → JSON (if response exists)
  return responseText ? JSON.parse(responseText) : null;
}