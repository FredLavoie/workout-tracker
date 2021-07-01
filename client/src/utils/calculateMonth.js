export function calculateMonth(month, year, req) {
  if (month === '01' && req === 'prev') return `${Number(year) - 1}-12`;
  if (month === '12' && req === 'next') return `${Number(year) + 1}-01`;
  if (Number(month) <= 10 && req === 'prev') return `${year}-0${Number(month) - 1}`;
  if (Number(month) < 9 && req === 'next') return `${year}-0${Number(month) + 1}`;
  if (req === 'prev') return `${year}-${Number(month) - 1}`;
  if (req === 'next') return `${year}-${Number(month) + 1}`;
}
