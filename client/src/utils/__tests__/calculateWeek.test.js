import { calculateWeek } from '../index';

describe('calculateWeek', () => {
  it('[1] Get current week in middle of a month', () => {
    const result = calculateWeek(['4', '15', '2022']);
    expect(result).toEqual(['2022-04-10', '2022-04-11', '2022-04-12', '2022-04-13', '2022-04-14', '2022-04-15', '2022-04-16']);
  });

  it('[2] Get current week at the beginning of a month', () => {
    const result = calculateWeek(['4', '2', '2022']);
    expect(result).toEqual(['2022-03-27', '2022-03-28', '2022-03-29', '2022-03-30', '2022-03-31', '2022-04-01', '2022-04-02']);
  });

  it('[3] Get current week at the end of a month', () => {
    const result = calculateWeek(['5', '30', '2022']);
    expect(result).toEqual(['2022-05-29', '2022-05-30', '2022-05-31', '2022-06-01', '2022-06-02', '2022-06-03', '2022-06-04']);
  });

  it('[4] Get current week at the beginning of January', () => {
    const result = calculateWeek(['1', '01', '2022']);
    expect(result).toEqual(['2021-12-26', '2021-12-27', '2021-12-28', '2021-12-29', '2021-12-30', '2021-12-31', '2022-01-01']);
  });

  it('[5] Get current week at the end of December', () => {
    const result = calculateWeek(['12', '28', '2021']);
    expect(result).toEqual(['2021-12-26', '2021-12-27', '2021-12-28', '2021-12-29', '2021-12-30', '2021-12-31', '2022-01-01']);
  });
});
