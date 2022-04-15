/**
 * Utility function that validates a record, ensuring that fields are not empty and that
 * the date is properly formatted.
 * 
 * @param {string} date date of the workout, ex: 2022-04-06
 * @param {string} type an enum of the type of event
 * @param {string} event an enum of events
 * @param {string} score weight lifted, time, number of reps or distance
 * @return {boolean} if the data is valid, return true, else return false
 */
export function validateRecord(date, type, event, score) {
  if (date === '') return false;
  if (type === '') return false;
  if (event === '') return false;
  if (score.trim() === '') return false;

  const dateArr = date.split('-');

  if (dateArr.length !== 3) return false;
  if (dateArr[0].length !== 4 || Number(dateArr[0]) % 1 !== 0) return false;
  if (dateArr[1].length !== 2 || Number(dateArr[1]) % 1 !== 0) return false;
  if (dateArr[2].length !== 2 || Number(dateArr[2]) % 1 !== 0) return false;

  return true;
}
