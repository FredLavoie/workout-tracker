require('dotenv').config();
const URL = process.env.REACT_APP_BASE_URL;

async function login(username, password) {
  return fetch(`${URL}/dj-rest-auth/login/`, {
    method: 'POST',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ username, password })
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.key) {
        localStorage.setItem('username', username);
        localStorage.setItem('token', data.key);
      }
      return data;
    })
    .catch((error) => console.log('error: ', error));
}

async function logout() {
  fetch(`${URL}/dj-rest-auth/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })
    .then((response) => console.log('respose: ', response))
    .catch((error) => console.log('error: ', error));

  localStorage.removeItem('token');
  localStorage.removeItem('accountId');
  localStorage.removeItem('username');
  return;
}

async function changePassword(newPassword1, newPassword2) {
  const token = localStorage.getItem('token');
  return fetch(`${URL}/dj-rest-auth/password/change/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
    body: JSON.stringify({ new_password1: newPassword1, new_password2: newPassword2 })
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.log('error: ', error));
}

function isAuthenticated() {
  const token = localStorage.getItem('token');
  return token !== null && token !== undefined;
}

export { login, logout, changePassword, isAuthenticated };
