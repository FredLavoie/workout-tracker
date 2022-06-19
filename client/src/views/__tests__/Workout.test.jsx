import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { server, rest } from '../../mockServer';
import { Workout } from '../Workout';
import { convertTime } from '../../utils';


afterEach(cleanup);

describe('Workout view - new', () => {
  const MockedNewWorkout = () => {
    return (
      <MemoryRouter initialEntries={[{ pathname: '/workouts/new' }]}>
        <Workout />
      </MemoryRouter>
    );
  };

  const workoutBody = 'new workout body';

  it('renders new Workout view without crashing', () => {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = convertTime(new Date().toTimeString().split(':').splice(0, 2));

    render(<MockedNewWorkout />);
    // check that todays date is automatically set in the date input
    const dateValue = screen.getByDisplayValue(today);
    expect(dateValue).toBeInTheDocument();
    // check that the current time (hour) is automatically set in the time input
    const workoutTextArea = screen.getByDisplayValue(currentTime);
    expect(workoutTextArea).toBeInTheDocument();
  });

  it('renders Workout view and successfully saves a new workout', async () => {
    localStorage.setItem('token', 'asdf');
    localStorage.setItem('accountId', '1');
    server.use(
      rest.post('*/1/workouts', (req, res, context) => {
        return res(context.status(200), context.json({ ok: true }));
      })
    );

    render(<MockedNewWorkout />);
    // enter in a new workout body
    fireEvent.change(screen.getByPlaceholderText('Workout body'), { target: { value: workoutBody } });
    // find and click the submit button
    const submitButton = screen.getByText('Save');
    fireEvent.click(submitButton);
    // the successful submitting of the workout should render the success toast message
    const successToastMessage = await screen.findByText('Successfully saved new workout.');
    expect(successToastMessage).toBeInTheDocument();
    // clean up local storage
    localStorage.clear();
  });


  it('renders Workout view and fails form validation', async () => {
    localStorage.setItem('token', 'asdf');
    localStorage.setItem('accountId', '1');
    server.use(
      rest.post('*/1/workouts', (req, res, context) => {
        return res(context.status(200), context.json({ ok: true }));
      })
    );

    const invalidDate = '202-02-1';
    const invalidtime = '8:01';

    render(<MockedNewWorkout />);
    // enter in a new information
    fireEvent.change(screen.getByPlaceholderText('Workout body'), { target: { value: workoutBody } });
    fireEvent.change(screen.getByPlaceholderText('Date'), { target: { value: invalidDate } });
    fireEvent.change(screen.getByPlaceholderText('Time'), { target: { value: invalidtime } });
    // find and click the submit button
    const submitButton = screen.getByText('Save');
    fireEvent.click(submitButton);
    // submitting the workout with invalid data should render the failure toast message
    const failedToastMessage = await screen.findByText('One or more inputted values is invalid.');
    expect(failedToastMessage).toBeInTheDocument();
    // clean up local storage
    localStorage.clear();
  });
});


describe('Workout view - existing', () => {
  const MockedExistingWorkout = () => {
    return (
      <MemoryRouter initialEntries={[{ pathname: '/workouts/qwerty123456' }]}>
        <Workout />
      </MemoryRouter>
    );
  };
  // existing workout data
  const workoutDate = '2022-02-25';
  const workoutTime = '13:45:00';
  const workoutTimeShort = '13:45';
  const workoutBody = 'squats';

  it('renders existing Workout view without crashing', async () => {
    localStorage.setItem('token', 'asdf');
    localStorage.setItem('accountId', '1');

    server.use(
      rest.get('*/1/workouts/qwerty123456', (req, res, context) => {
        return res(context.status(200), context.json({ ok: true, date: workoutDate, time: workoutTime, workout_body: workoutBody }));
      })
    );

    render(<MockedExistingWorkout />);
    // find the workout date, time and body
    const dateValue = await screen.findByDisplayValue(workoutDate);
    const timeValue = await screen.findByDisplayValue(workoutTimeShort);
    const workoutValue = await screen.findByText(workoutBody);
    // assert that the workout date, time and body are in the rendered component
    expect(dateValue).toBeInTheDocument();
    expect(timeValue).toBeInTheDocument();
    expect(workoutValue).toBeInTheDocument();
    // clean up local storage
    localStorage.clear();
  });

  it('deletes existing workout', async () => {
    localStorage.setItem('token', 'asdf');
    localStorage.setItem('accountId', '1');

    server.use(
      rest.get('*/1/workouts/qwerty123456', (req, res, context) => {
        return res(context.status(200), context.json({ ok: true, date: workoutDate, time: workoutTime, workout_body: workoutBody }));
      }),
      rest.delete('*/1/workouts/qwerty123456', (req, res, context) => {
        return res(context.status(200), context.json({ ok: true }));
      })
    );

    render(<MockedExistingWorkout />);
    // find the workout date, time and body
    const dateValue = await screen.findByDisplayValue(workoutDate);
    const timeValue = await screen.findByDisplayValue(workoutTimeShort);
    const workoutValue = await screen.findByText(workoutBody);
    // assert that the workout date, time and body are in the rendered component
    expect(dateValue).toBeInTheDocument();
    expect(timeValue).toBeInTheDocument();
    expect(workoutValue).toBeInTheDocument();
    // find and click the delete button
    const submitButton = screen.getByText('Delete');
    fireEvent.click(submitButton);
    // the successful delete the workout should render the success toast message
    const successToastMessage = await screen.findByText('Successfully deleted workout.');
    expect(successToastMessage).toBeInTheDocument();
    // clean up local storage
    localStorage.clear();
  });

  it('updates existing workout', async () => {
    localStorage.setItem('token', 'asdf');
    localStorage.setItem('accountId', '1');

    const updatedWorkoutBody = 'updated workout body';

    server.use(
      rest.get('*/1/workouts/qwerty123456', (req, res, context) => {
        return res(context.status(200), context.json({ ok: true, date: workoutDate, time: workoutTime, workout_body: workoutBody }));
      }),
      rest.patch('*/1/workouts/qwerty123456', (req, res, context) => {
        return res(context.status(200), context.json({ ok: true, date: workoutDate, time: workoutTime, workout_body: updatedWorkoutBody }));
      })
    );

    render(<MockedExistingWorkout />);
    // enter in a new workout body
    fireEvent.change(await screen.findByText(workoutBody), { target: { value: updatedWorkoutBody } });
    // find and click the submit button
    const submitButton = screen.getByText('Save');
    fireEvent.click(submitButton);
    // the successful updating of the workout should render the success toast message
    const successToastMessage = await screen.findByText('Successfully updated workout.');
    expect(successToastMessage).toBeInTheDocument();
    // clean up local storage
    localStorage.clear();
  });
});
