import { Platform, NativeModules } from 'react-native';
import { API_CONFIG } from '../config/apiConfig';

const IS_ANDROID_RELEASE = Platform.OS === 'android' && !__DEV__;

export function buildApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

export async function postJson(endpoint, payload) {
  if (IS_ANDROID_RELEASE) {
    // Direct Chaquopy call — no HTTP, no sockets.
    // Python's server.handle() processes the request in-process.
    const { PythonServer } = NativeModules;
    const result = await PythonServer.callApi(
      endpoint,
      JSON.stringify(payload ?? {})
    );
    return result ? JSON.parse(result) : null;
  }

  // Development: HTTP fetch to local dev server
  const response = await fetch(buildApiUrl(endpoint), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(responseText || 'API request failed');
  }

  return responseText ? JSON.parse(responseText) : null;
}
