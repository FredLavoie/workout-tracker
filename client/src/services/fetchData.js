
function fetchMonthData(monthToFetch) {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('accountId');

  return fetch(`http://localhost:8000/api/${id}/cal/${monthToFetch}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
  })
    .then(res => res.json());
}

function fetchAccountId() {
  if (localStorage.getItem('accountId')) return;

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  return fetch(`http://localhost:8000/api/accounts/${username}/`, {
    method: 'GET',
    headers: {
      'authorization': `Token ${token}`
    },
  })
    .then(res => res.json())
    .then(data => localStorage.setItem('accountId', data[0].id));
}



export { fetchMonthData, fetchAccountId };
