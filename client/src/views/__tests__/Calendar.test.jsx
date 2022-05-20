import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { server, rest } from '../../mockServer';
import { months } from '../../lib/months';
import { Calendar } from '../Calendar';


afterEach(cleanup);

/**
 * This helper function builds the next or previous month's title.
 * Example: "June 2022"
 * @param {string} month current month
 * @param {string} option paramter to determine which month to get
 * @param {string} year current year
 * @returns returns the month title as a string
 */
function getNextPrevMonth(month, option, year) {
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

const dateArray = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).split(',')[0].split('/');
const calPath = `/cal/${dateArray[2]}-${dateArray[0].padStart(2, '0')}`;
const currentMonthTitle = `${months[dateArray[0].padStart(2, '0')]} ${dateArray[2]}`;
const prevMonthTitle = getNextPrevMonth(dateArray[0], 'prev', dateArray[2]);
const NextMonthTitle = getNextPrevMonth(dateArray[0], 'next', dateArray[2]);

describe('Calendar view', () => {
  localStorage.setItem('token', 'asdf');
  localStorage.setItem('accountId', '1');

  const MockedCalendar = () => {
    return (
      <MemoryRouter initialEntries={[{ pathname: calPath }]}>
        <Calendar />
      </MemoryRouter>
    );
  };

  it('renders the Calendar view without crashing', async () => {
    server.use(
      rest.get('*/1/cal/:month', (req, res, context) => {
        return res(context.status(200), context.json([]));
      }),
    );
    render(<MockedCalendar />);
    // assert that the title is the current month and year
    const title = await screen.findByText(currentMonthTitle);
    expect(title).toBeInTheDocument();
  });

  it('renders the Calendar view and navigate to previous month', async () => {
    server.use(
      rest.get('*/1/cal/:month', (req, res, context) => {
        return res(context.status(200), context.json([]));
      }),
    );
    render(<MockedCalendar />);
    // find the PREV button and click it
    const prevButton = await screen.findByText('Prev');
    fireEvent.click(prevButton);
    // assert that the title is the current month and year
    const title = await screen.findByText(prevMonthTitle);
    expect(title).toBeInTheDocument();
  });

  it('renders the Calendar view and navigate to next month', async () => {
    server.use(
      rest.get('*/1/cal/:month', (req, res, context) => {
        return res(context.status(200), context.json([]));
      }),
    );
    render(<MockedCalendar />);
    // find the NEXT button and click it
    const nextButton = await screen.findByText('Next');
    fireEvent.click(nextButton);
    // assert that the title is the current month and year
    const title = await screen.findByText(NextMonthTitle);
    expect(title).toBeInTheDocument();
  });

});
