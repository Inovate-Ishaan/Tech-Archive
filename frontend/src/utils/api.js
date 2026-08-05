const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Authentication APIs
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

export async function register({ email, password, username, instituteId, firstName, lastName }) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username, instituteId, firstName, lastName }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function requestOtp(email) {
  const res = await fetch(`${API_BASE}/api/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function verifyOtp(email, code) {
  const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function setPassword(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/set-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function resetPassword(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function fetchReadme(githubUrl) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API_BASE}/api/posts/fetch-readme`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ githubUrl }),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json.data;
};

export async function uploadPost(formData){
  const token = localStorage.getItem('auth_token');
  const resp = await fetch(`${API_BASE}/api/posts`, {
    method: 'POST',
    headers: {
      ...(token ? {Authorization: `Bearer ${token}`} : {})
    },
    body: formData,
  });
  const data = await resp.json();
  if (!resp.ok) throw data;
  return data;
};

// feed page APIs

export async function getPosts(page) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API_BASE}/api/feed?page=${page}&limit=24`, {
    method: 'GET',
    headers: {
      ...(token ? {Authorization: `Bearer ${token}`} : {})
    }
  });
  const data = await res.json();
  if (!res.ok) throw data;

  return data;
}

export async function viewpost(id){
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API_BASE}/api/posts/${id}`, {
    method: 'GET',
    headers: {
      ...(token ? {Authorization: `Bearer ${token}`} : {})
    },
  });
  const data = await res.json();
  if (!res.ok) throw data;

  return data;
}

export async function bookmarker(id,bookmarked){
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API_BASE}/api/${id}/bookmark`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {})
    },
    body: JSON.stringify({ bookmarked })
  });
  const data = await res.json();
  if (!res.ok) throw data;

  return data;
}
