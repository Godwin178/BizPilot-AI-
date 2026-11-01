export async function request(path, options = {}) {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}
export const auth = {
  me: () => request('/api/auth/me'),
  login: values => request('/api/auth/login', { method: 'POST', body: JSON.stringify(values) }),
  register: values => request('/api/auth/register', { method: 'POST', body: JSON.stringify(values) }),
  logout: () => request('/api/auth/logout', { method: 'POST' })
};
export const records = {
  list: collection => request(`/api/records/${collection}`),
  create: (collection, value) => request(`/api/records/${collection}`, { method: 'POST', body: JSON.stringify(value) }),
  update: (collection, id, value) => request(`/api/records/${collection}/${id}`, { method: 'PUT', body: JSON.stringify(value) }),
  remove: (collection, id) => request(`/api/records/${collection}/${id}`, { method: 'DELETE' })
};
