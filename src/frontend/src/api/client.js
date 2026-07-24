/**
 * Shared fetch helper for `/api` calls.
 * Success: returns parsed JSON body (`{ data }`).
 * Failure: throws an Error with `status`, `code`, `details`, and `message`.
 */
export async function apiRequest(path, options = {}) {
  const { headers: optionHeaders, ...restOptions } = options;
  let response;
  try {
    response = await fetch(path, {
      ...restOptions,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...optionHeaders,
      },
    });
  } catch (networkError) {
    const error = new Error(
      networkError instanceof Error ? networkError.message : 'Network request failed',
    );
    error.code = 'NETWORK_ERROR';
    error.status = 0;
    throw error;
  }

  let body = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    body = await response.json();
  }

  if (!response.ok) {
    const apiError = body?.error;
    const error = new Error(apiError?.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.code = apiError?.code || 'HTTP_ERROR';
    error.details = apiError?.details;
    throw error;
  }

  return body;
}
