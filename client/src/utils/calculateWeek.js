export function calculateWeek(dateArr) {
  const numDaysInMonth = new Date(dateArr[2], dateArr[0], 0).getDate();
  let numDaysPrevMonth = null;
  if (dateArr[0] === '1') {
    numDaysPrevMonth = new Date(Number(dateArr[2]) - 1, '1', 0).getDate();
  } else {
    numDaysPrevMonth = new Date(dateArr[2], Number(dateArr[0]) - 1, 0).getDate();
  }
  const weekObj = {};
  let dayOfTheWeek = Number(new Date().getDay().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  if (dayOfTheWeek === 7) dayOfTheWeek = 0;

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
