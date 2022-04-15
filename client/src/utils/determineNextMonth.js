/**
 * Utility function that takes in a date array and determines which month (previous or following) to fetch.
 * 
 * Rgardless of which navigation button was clicked (prev or next), the nextt month will be the closest based
 * on the current day of the month regardless if the previous or next month workouts are needed at all. This 
 * way we don't have to consider if the user is nagivating backwards or forwards, the nearest month's data will
 * be fetched.
 * 
 * Example:  ["12", "26", "2021"] => ["2022","01"]
 * 
 * @param {string[]} dataArr a simple date array containing a month, day and year respectively
 * @return {string[]} a valid date array
 */
export function determineNextMonth(dateArr) {
  const year = Number(dateArr[2]);
  const month = Number(dateArr[0]);
  const day = Number(dateArr[1]);
  let nextMonth = -1;
  let nextYear = -1;

  if (day <= 15) {
    if (month - 1 === 0) {
      nextMonth = 12;
      nextYear = year - 1;
    } else {
      nextMonth = month - 1;
      nextYear = year;
    }
  } else {
    if (month + 1 === 13) {
      nextMonth = 1;
      nextYear = year + 1;
    } else {
      nextMonth = month + 1;
      nextYear = year;
    }
  }
  return [String(nextYear), String(nextMonth)];
}
