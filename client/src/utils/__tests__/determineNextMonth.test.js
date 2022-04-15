import { determineNextMonth } from '../index';

describe('determineNextMonth', () => {
  it('[1] Get the following month and year given a date that is later in the current month', () => {
    const result = determineNextMonth(['12', '26', '2021']);
    expect(result).toEqual(['2022', '1']);
  });

  it('[2] Get the previous month and year given a date that is early in the current month', () => {
    const result = determineNextMonth(['1', '2', '2021']);
    expect(result).toEqual(['2020', '12']);
  });

  it('[3] Get the following month and same year given a date that is later in the current month', () => {
    const result = determineNextMonth(['4', '20', '2021']);
    expect(result).toEqual(['2021', '5']);
  });

  it('[4] Get the previous month and same year given a date that is early in the current month', () => {
    const result = determineNextMonth(['4', '2', '2021']);
    expect(result).toEqual(['2021', '3']);
  });
});
