require('dotenv').config();
const URL = process.env.REACT_APP_BASE_URL;

export async function fetchAccountId() {
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

export async function fetchSearchResults(checkedWorkout, checkedRecord, query) {
  if (!checkedWorkout && !checkedRecord) return [];

  const token = localStorage.getItem('token');
  const id = localStorage.getItem('accountId');
  const trimmedQuery = query.trim().split(' ').join('+');
  let workoutResults = [];
  let recordResults = [];

  if (checkedWorkout) {
    await fetch(`${URL}/${id}/workouts/search/?q=${trimmedQuery}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': `Token ${token}`
      },
    })
      .then((res) => res.json())
      .then((data) => workoutResults = data);
  }

  if (checkedRecord) {
    await fetch(`${URL}/${id}/records/search/?q=${trimmedQuery}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': `Token ${token}`
      },
    })
      .then((res) => res.json())
      .then((data) => recordResults = data);
  }

  return [...workoutResults, ...recordResults];
}


/***************************************** WORKOUTS *****************************************/
/********************************************************************************************/

export async function fetchMonthData(monthToFetch) {
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

export async function fetchYearData(yearToFetch) {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('accountId');

  return fetch(`${URL}/${id}/workouts/${yearToFetch}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
  })
    .then((res) => res.json());
}

export async function fetchWorkout(workout_id) {
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

export async function updateWorkout(workout_id, date, time, workout_body) {
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

export async function postWorkout(date, time, workout_body) {
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

export async function deleteWorkout(workout_id) {
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

export async function fetchRecord(record_id) {
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

export async function fetchRecords() {
  const token = localStorage.getItem('token');
  const accountId = localStorage.getItem('accountId');

  return fetch(`${URL}/${accountId}/records/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': `Token ${token}`
    },
  })
    .then((res) => res.json());
}

export async function updateRecord(record_id, date, type, event, score) {
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

export async function postRecord(date, type, event, score) {
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

export async function deleteRecord(record_id) {
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
