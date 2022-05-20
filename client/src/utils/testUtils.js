import { months } from '../lib/months';

/**
 * This helper function builds the next or previous month's title.
 * Example: "June 2022"
 * @param {string} month current month
 * @param {string} option paramter to determine which month to get
 * @param {string} year current year
 * @returns returns the month title as a string
 */
export function getNextPrevMonth(month, option, year) {
  if (option === 'prev') {
    if (month === '1') {
      return `December ${Number(year) - 1}`;
    } else {
      return `${months[String(Number(month) - 1).padStart(2, '0')]} ${year}`;
    }
  } else {
    if (month === '12') {
      return `January ${Number(year) + 1}`;
    } else {
      return `${months[String(Number(month) + 1).padStart(2, '0')]} ${year}`;
    }
  }
}
