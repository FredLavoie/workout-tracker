export function correctDate(dateArr) {
  const numDaysInMonth = new Date(dateArr[2], dateArr[0], 0).getDate();
  let numDaysPrevMonth = null;

  // determine days in previous month based accounting for previous month being Dec of the previous year
  if (dateArr[0] === '1') {
    numDaysPrevMonth = new Date(Number(dateArr[2]) - 1, '1', 0).getDate();
  } else {
    numDaysPrevMonth = new Date(dateArr[2], Number(dateArr[0]) - 1, 0).getDate();
  }
  let dayOfTheWeek = Number(new Date().getDay().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  if (dayOfTheWeek === 7) dayOfTheWeek = 0;

  let day = Number(dateArr[1]);
  let month = Number(dateArr[0]);
  let year = Number(dateArr[2]);

  if (day > numDaysInMonth) {
    if (month === 12) {
      day = day - numDaysInMonth;
      month = 1;
      year++;
    } else {
      day = day - numDaysInMonth;
      month++;
    }
  } else if (day < 1) {
    if (month === 1) {
      day = numDaysPrevMonth + day;
      month = 12;
      year--;
    } else {
      day = numDaysPrevMonth + day;
      month--;
    }
  }
  return [String(month), String(day), String(year)];
}
