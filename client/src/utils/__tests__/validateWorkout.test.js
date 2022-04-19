import { validateWorkout } from '../index';

describe('validateWorkout', () => {
  it('[1] Should return true for a valid workout entry', () => {
    const result = validateWorkout('2022-04-06', '08:00', 'body');
    expect(result).toBe(true);
  });

  // test the date input
  it('[2] Should return false with date: slashes instead of dashes', () => {
    const result = validateWorkout('2022/04/06', '08:00', 'body');
    expect(result).toBe(false);
  });

  it('[3] Should return false with date: single digits in month and day', () => {
    const result = validateWorkout('2022-4-6', '08:00', 'body');
    expect(result).toBe(false);
  });

  it('[4] Should return false with date: invalid month number', () => {
    const result = validateWorkout('2022-13-06', '08:00', 'body');
    expect(result).toBe(false);
  });

  it('[5] Should return false with date: invalid day number', () => {
    const result = validateWorkout('2022-05-45', '08:00', 'body');
    expect(result).toBe(false);
  });

  it('[6] Should return false with date: invalid year number', () => {
    const result = validateWorkout('202-05-15', '08:00', 'body');
    expect(result).toBe(false);
  });

  // test the time input
  it('[7] Should return false with time: missing colon between hours and minutes', () => {
    const result = validateWorkout('2022-05-15', '0800', 'body');
    expect(result).toBe(false);
  });

  it('[8] Should return false with time: hours not two digits', () => {
    const result = validateWorkout('2022-05-15', '8:00', 'body');
    expect(result).toBe(false);
  });

  it('[9] Should return false with time: minutes not two digits', () => {
    const result = validateWorkout('2022-05-15', '08:1', 'body');
    expect(result).toBe(false);
  });

  it('[10] Should return false with time: hours > 24', () => {
    const result = validateWorkout('2022-05-15', '33:00', 'body');
    expect(result).toBe(false);
  });

  it('[10] Should return false with time: minutes > 59', () => {
    const result = validateWorkout('2022-05-15', '08:65', 'body');
    expect(result).toBe(false);
  });

  it('[11] Should return false with time: negative hours', () => {
    const result = validateWorkout('2022-05-15', '-08:05', 'body');
    expect(result).toBe(false);
  });

  // test the body of the workout
  it('[12] Should return false if body is only a number', () => {
    const result = validateWorkout('2022-05-15', '08:05', 12345);
    expect(result).toBe(false);
  });
});
