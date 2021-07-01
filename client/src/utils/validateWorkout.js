export function validateWorkout(date, time, body) {
  if (date === '' || !date.includes('-')) return false;
  if (time === '' || !time.includes(':')) return false;
  if (body === '') return false;

  const dateArr = date.split('-');

  if (dateArr.length !== 3) return false;
  if (dateArr[0].length !== 4 || Number(dateArr[0]) % 1 !== 0) return false;
  if (dateArr[1].length !== 2 || Number(dateArr[1]) % 1 !== 0) return false;
  if (dateArr[2].length !== 2 || Number(dateArr[2]) % 1 !== 0) return false;

  const timeArr = time.split(':');

  if (timeArr.length !== 2) return false;
  if (timeArr[0].length !== 2 || Number(timeArr[0]) < 0 || Number(timeArr[0]) > 23 || Number(timeArr[0]) % 1 !== 0) return false;
  if (timeArr[1].length !== 2 || Number(timeArr[1]) < 0 || Number(timeArr[1]) > 59 || Number(timeArr[1]) % 1 !== 0) return false;

  return true;
}
