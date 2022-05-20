import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { server, rest } from '../../mockServer';
import { calculateWeek, correctDate } from '../../utils';
import { months } from '../../lib/months';
import { Week } from '../Week';


afterEach(cleanup);

const currentWeekArr = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).split(',')[0].split('/');
const prevWeekArr = correctDate(currentWeekArr.map((ea, index) => {
  if (index === 1) return String(Number(ea) - 7);
  else return ea;
}));
const nextWeekArr = correctDate(currentWeekArr.map((ea, index) => {
  if (index === 1) return String(Number(ea) + 7);
  else return ea;
}));

const currentWeekArrDays = calculateWeek(currentWeekArr);
const prevWeekArrDays = calculateWeek(prevWeekArr);
const nextWeekArrDays = calculateWeek(nextWeekArr);

describe('Week view', () => {
  localStorage.setItem('token', 'asdf');
  localStorage.setItem('accountId', '1');

  const MockedWeek = () => {
    return (
      <MemoryRouter initialEntries={[{ pathname: '/week' }]}>
        <Week />
      </MemoryRouter>
    );
  };

  it('renders the Week view without crashing', async () => {
    server.use(
      rest.get('*/1/cal/:month', (req, res, context) => {
        return res(context.status(200), context.json([]));
      }),
    );
    render(<MockedWeek />);
    // find all the rest days and assert that there are 7 rest days
    const searchBox = await screen.findAllByText('Rest');
    expect(searchBox.length).toBe(7);
    // find current week title and assert it exists
    const weekTitle = `Week of ${months[currentWeekArrDays[0].split('-')[1]]} ${currentWeekArrDays[0].split('-')[2]}`;
    expect(await screen.findByText(weekTitle)).toBeInTheDocument();
  });

  it('renders the Week view and navigates back successfully', async () => {
    server.use(
      rest.get('*/1/cal/:month', (req, res, context) => {
        return res(context.status(200), context.json([]));
      }),
    );
    render(<MockedWeek />);
    // find current week title and assert it exists
    const weekTitle = `Week of ${months[currentWeekArrDays[0].split('-')[1]]} ${currentWeekArrDays[0].split('-')[2]}`;
    expect(await screen.findByText(weekTitle)).toBeInTheDocument();
    // find and click the PREV button
    const prevButton = await screen.findByText('Prev');
    fireEvent.click(prevButton);
    // assert that it shows the previous week
    const prevWeekTitle = `Week of ${months[prevWeekArrDays[0].split('-')[1]]} ${prevWeekArrDays[0].split('-')[2]}`;
    expect(await screen.findByText(prevWeekTitle)).toBeInTheDocument();
  });

  it('renders the Week view and navigates forwrard successfully', async () => {
    server.use(
      rest.get('*/1/cal/:month', (req, res, context) => {
        return res(context.status(200), context.json([]));
      }),
    );
    render(<MockedWeek />);
    // find current week title and assert it exists
    const weekTitle = `Week of ${months[currentWeekArrDays[0].split('-')[1]]} ${currentWeekArrDays[0].split('-')[2]}`;
    expect(await screen.findByText(weekTitle)).toBeInTheDocument();
    // find and click the NEXT button
    const nextButton = await screen.findByText('Next');
    fireEvent.click(nextButton);
    // assert that it shows the next week
    const nextWeekTitle = `Week of ${months[nextWeekArrDays[0].split('-')[1]]} ${nextWeekArrDays[0].split('-')[2]}`;
    expect(await screen.findByText(nextWeekTitle)).toBeInTheDocument();
  });

});
