export function convertTime(timeArr) {
  if (timeArr[0] === '23') return '23:00';

  const hour = (Number(timeArr[0]) + 1).toString();
  const paddedHour = hour.padStart(2, '0');
  return `${paddedHour}:00`;
}
