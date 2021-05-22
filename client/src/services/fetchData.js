require('dotenv').config();
const URL = process.env.REACT_APP_BASE_URL;

async function fetchAccountId() {
  if (localStorage.getItem('accountId')) return;

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  return fetch(`${URL}/accounts/${username}/`, {
    method: 'GET',
    headers: {
      'authorization': `Token ${token}`
    },
  })
    .then((res) => res.json())
    .then((data) => localStorage.setItem('accountId', data[0].id));
}

/****************************************** SEARCH ******************************************/
/********************************************************************************************/

async function fetchSearchResults(q) {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('accountId');

  const query = q.trim().split(' ').joint('+');

  const workoutResults = await fetch(`${URL}/${id}/workouts/search/?q=${query}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
  })
    .then((res) => res.json());

  const recordResults = await fetch(`${URL}/${id}/records/search/?q=${query}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
  })
    .then((res) => res.json());

  return [...workoutResults, ...recordResults];
}


/***************************************** WORKOUTS *****************************************/
/********************************************************************************************/

async function fetchMonthData(monthToFetch) {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('accountId');

  return fetch(`${URL}/${id}/cal/${monthToFetch}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
  })
    .then((res) => res.json());
}

async function fetchWorkout(workout_id) {
  const token = localStorage.getItem('token');
  const accountId = localStorage.getItem('accountId');

  return fetch(`${URL}/${accountId}/workouts/${workout_id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
  })
    .then((res) => res.json());
}

async function updateWorkout(workout_id, date, time, workout_body) {
  const token = localStorage.getItem('token');
  const accountId = localStorage.getItem('accountId');

  return fetch(`${URL}/${accountId}/workouts/${workout_id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
    body: JSON.stringify({ date, time, workout_body })
  })
    .then((response) => console.log('respose: ', response))
    .catch((error) => console.log('error: ', error));
}

async function postWorkout(date, time, workout_body) {
  const token = localStorage.getItem('token');
  const accountId = localStorage.getItem('accountId');

  return fetch(`${URL}/${accountId}/workouts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
    body: JSON.stringify({ author: accountId, date, time, workout_body })
  })
    .then((response) => console.log('respose: ', response))
    .catch((error) => console.log('error: ', error));
}

async function deleteWorkout(workout_id) {
  const token = localStorage.getItem('token');
  const accountId = localStorage.getItem('accountId');

  return fetch(`${URL}/${accountId}/workouts/${workout_id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
  })
    .then((response) => console.log('respose: ', response))
    .catch((error) => console.log('error: ', error));
}

/****************************************** RECORDS *****************************************/
/********************************************************************************************/

async function fetchRecord(record_id) {
  const token = localStorage.getItem('token');
  const accountId = localStorage.getItem('accountId');

  return fetch(`${URL}/${accountId}/records/${record_id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
  })
    .then((res) => res.json());
}

async function updateRecord(record_id, date, type, event, score) {
  const token = localStorage.getItem('token');
  const accountId = localStorage.getItem('accountId');

  return fetch(`${URL}/${accountId}/records/${record_id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
    body: JSON.stringify({ date, type, event, score })
  })
    .then((response) => console.log('respose: ', response))
    .catch((error) => console.log('error: ', error));
}

async function postRecord(date, type, event, score) {
  const token = localStorage.getItem('token');
  const accountId = localStorage.getItem('accountId');

  return fetch(`${URL}/${accountId}/records/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
    body: JSON.stringify({ author: accountId, date, type, event, score })
  })
    .then((response) => console.log('respose: ', response))
    .catch((error) => console.log('error: ', error));
}

async function deleteRecord(record_id) {
  const token = localStorage.getItem('token');
  const accountId = localStorage.getItem('accountId');

  return fetch(`${URL}/${accountId}/records/${record_id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
  })
    .then((response) => console.log('respose: ', response))
    .catch((error) => console.log('error: ', error));
}

/********************************************************************************************/

export {
  fetchAccountId,
  fetchSearchResults,
  fetchMonthData,
  fetchWorkout,
  postWorkout,
  updateWorkout,
  deleteWorkout,
  fetchRecord,
  updateRecord,
  postRecord,
  deleteRecord,
};
