// Take a time array and converts it into a time with the format 00:00
export function convertTime(timeArr) {
  const hour = Number(timeArr[0]).toString();
  const paddedHour = hour.padStart(2, '0');
  return `${paddedHour}:00`;
}
