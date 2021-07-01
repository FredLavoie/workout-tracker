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

export function calculateMonth(month, year, req) {
  if (month === '01' && req === 'prev') return `${Number(year) - 1}-12`;
  if (month === '12' && req === 'next') return `${Number(year) + 1}-01`;
  if (Number(month) <= 10 && req === 'prev') return `${year}-0${Number(month) - 1}`;
  if (Number(month) < 9 && req === 'next') return `${year}-0${Number(month) + 1}`;
  if (req === 'prev') return `${year}-${Number(month) - 1}`;
  if (req === 'next') return `${year}-${Number(month) + 1}`;
}