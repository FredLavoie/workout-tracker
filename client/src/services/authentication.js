
async function login(username, password) {
	return fetch('http://localhost:8000/api/dj-rest-auth/login/', {
		method: 'POST',
		credentials: 'omit',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({username, password})
	})
	.then(response => response.json())
	.then(data => {
		if (data.key) {
			localStorage.setItem('username', username);
			localStorage.setItem('token', data.key);
		}
		return data;
 })
	.catch(error => console.log('error: ', error));
}

async function logout() {
	fetch(`http://localhost:8000/api/dj-rest-auth/logout/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
	})
	.then(response => console.log('respose: ', response))
	.catch(error => console.log('error: ', error));

	localStorage.removeItem('token');
	localStorage.removeItem('accountId');
	localStorage.removeItem('username');
	return;
}

function isAuthenticated() {
	const token = localStorage.getItem('token');
	return token !== null && token !== undefined;
}

export { login, logout, isAuthenticated }