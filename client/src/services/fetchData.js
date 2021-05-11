
async function fetchDataMonth(username, password) {

}

async function fetchAccountId() {
	if (localStorage.getItem('accountId')) return;

	const token = localStorage.getItem('token');
	const username = localStorage.getItem('username');
	return fetch(`http://localhost:8000/api/accounts/${username}`,{
      method: 'GET',
      headers: {
        'authorization': `Token ${token}`
      },
    })
      .then(res => res.json())
      .then(data => localStorage.setItem('accountId', data[0].id));
}













export { fetchDataMonth, fetchAccountId }
