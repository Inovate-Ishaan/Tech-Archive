const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function signin(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export default { signin };

export async function register({ email, password, username, instituteId }) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username, instituteId }),
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
