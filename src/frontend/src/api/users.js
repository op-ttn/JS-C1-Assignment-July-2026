import { apiRequest } from './client.js';

export function getUsers() {
  return apiRequest('/api/users');
}
