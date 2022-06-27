/**
 * Utility function that takes the currently viewing year and month, and returns a date for the next or
 * previous month to fetch the date for.
 * 
 * @param month
 * @param year
 * @param req either next or previous month
 * @return date in string format of the month to fetch the data for. Ex: "2022-03"
 */
export function calculateMonth(month: string, year: string, req: string): string {
  if (month === '01' && req === 'prev') return `${Number(year) - 1}-12`;
  if (month === '12' && req === 'next') return `${Number(year) + 1}-01`;
  if (req === 'prev') return `${year}-${String(Number(month) - 1).padStart(2, '0')}`;
  if (req === 'next') return `${year}-${String(Number(month) + 1).padStart(2, '0')}`;
}
