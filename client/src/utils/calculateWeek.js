/**
 * Utility function that takes a date as an array and determines the 7 days that exist in that week and returns
 * the 7 dates in an array.
 * 
 * Example:
 * dateArr ["4", "14", "2022"]
 * results ["2022-04-10", "2022-04-11", "2022-04-12", "2022-04-13", "2022-04-14", "2022-04-15", "2022-04-16"]
 * 
 * @param {string[]} dateArr a simple date array containing a month, day and year respectively
 * @return {string[]} an array of 7 dates. The dates will be used to fetch the workouts on those days which will
 * then be displayed in the Week view 
 */
export function calculateWeek(dateArr) {
  const numDaysInMonth = new Date(dateArr[2], dateArr[0], 0).getDate();
  let numDaysPrevMonth = null;
  if (dateArr[0] === '1') {
    // Current month is Jan, therefore the previous month is Dec and it has 31 days
    numDaysPrevMonth = 31;
  } else {
    // setting the day = 0 and calling the .getDate() method returns the number of days
    // in the previous month. The month in the dateArr is the actual month number, therefore
    // we need to subtract 1 to get the index of the current month
    numDaysPrevMonth = new Date(dateArr[2], Number(dateArr[0]) - 1, 0).getDate();
  }
  const weekObj = {};
  const dateArrAsString = `${dateArr[2]}-${dateArr[0].padStart(2, '0')}-${dateArr[1].padStart(2, '0')}T00:00:00`;
  const dayOfTheWeek = Number(new Date(dateArrAsString).getDay());
  for (let i = 0; i < 7; i++) {
    let year = Number(dateArr[2]);
    let month = Number(dateArr[0]);
    let day = Number(dateArr[1]) - (dayOfTheWeek - i);
    if (day > numDaysInMonth) {
      if (month === 12) {
        year = year + 1;
        month = '01';
      } else {
        month = month + 1;
      }
      day = day - numDaysInMonth;
    } else if (day < 1) {
      if (month === 1) {
        year = year - 1;
        month = '12';
      } else {
        month = month - 1;
      }
      day = day + numDaysPrevMonth;
    }
    weekObj[i] = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return Object.values(weekObj);
}
