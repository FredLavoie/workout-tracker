import { calculateMonth } from '../index';

describe('calculateMonth', () => {
  it('[1] Get previous month in middle of a year', () => {
    const result = calculateMonth('04', '2022', 'prev');
    expect(result).toEqual('2022-03');
  });

  it('[2] Get next month in the middle of a year', () => {
    const result = calculateMonth('04', '2022', 'next');
    expect(result).toEqual('2022-05');
  });

  it('[3] Get previous month at the beginning of the year', () => {
    const result = calculateMonth('01', '2022', 'prev');
    expect(result).toEqual('2021-12');
  });

  it('[4] Get next month at the end of the year', () => {
    const result = calculateMonth('12', '2022', 'next');
    expect(result).toEqual('2023-01');
  });
});
