import { apiRequest } from './client.js';

/**
 * @param {{ q?: string, status?: string }} [params]
 */
export function getTickets(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.q?.trim()) {
    searchParams.set('q', params.q.trim());
  }
  if (params.status) {
    searchParams.set('status', params.status);
  }
  const query = searchParams.toString();
  return apiRequest(`/api/tickets${query ? `?${query}` : ''}`);
}

export function getTicket(id) {
  return apiRequest(`/api/tickets/${encodeURIComponent(id)}`);
}

export function createTicket(payload) {
  return apiRequest('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTicket(id, payload) {
  return apiRequest(`/api/tickets/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function transitionTicketStatus(id, status) {
  return apiRequest(`/api/tickets/${encodeURIComponent(id)}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

export function createComment(id, payload) {
  return apiRequest(`/api/tickets/${encodeURIComponent(id)}/comments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
