const URL = process.env.REACT_APP_BASE_URL || 'https://workout-tracker.xyz/api';

export async function login(username: string, password: string) {
  const res = await fetch(`${URL}/dj-rest-auth/login/`, {
    method: 'POST',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  // login failed with provided credentials
  if (data.non_field_errors) return data;
  // throw error if there is a server error
  if (!res.ok) throw new Error(`Server error - status ${res.status}`);

  // if all goes well, save credentials to localStorage and return data
  localStorage.setItem('username', username);
  localStorage.setItem('token', data.key);
  return data;
}

export async function logout() {
  const res = await fetch(`${URL}/dj-rest-auth/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Server error - status ${res.status}`);
  localStorage.removeItem('token');
  localStorage.removeItem('accountId');
  localStorage.removeItem('username');
  localStorage.removeItem('userTheme');
  return;
}

export async function changePassword(newPassword1: string, newPassword2: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/dj-rest-auth/password/change/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
    body: JSON.stringify({ new_password1: newPassword1, new_password2: newPassword2 })
  });
  if (!res.ok) throw new Error(`Server error - status ${res.status}`);
  return await res.json();
}

export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return token !== null && token !== undefined;
}
