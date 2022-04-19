import { correctDate } from '../index';

describe('correctDate', () => {
  it('[1] Get the adjusted date given a date array with a negative day value', () => {
    const result = correctDate(['1', '-5', '2022']);
    expect(result).toEqual(['12', '26', '2021']);
  });

  it('[2] Get the adjusted date given a date array with a day value > 31', () => {
    const result = correctDate(['12', '37', '2022']);
    expect(result).toEqual(['1', '6', '2023']);
  });

  it('[3] Get the adjusted date given a date array with a normal day value ', () => {
    const result = correctDate(['4', '15', '2022']);
    expect(result).toEqual(['4', '15', '2022']);
  });
});
