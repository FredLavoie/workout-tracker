/**
 * Take a time array and return the time as a string with the minutes set to "00"
 * 
 * Example: ["13", "43"] => "13:00"
 * 
 * @param {string} timeArr array of current time
 * @return {string} time in 24h format
 */
export function convertTime(timeArr) {
  return `${timeArr[0]}:00`;
}
