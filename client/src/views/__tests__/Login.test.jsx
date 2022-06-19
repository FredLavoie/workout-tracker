import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { server, rest } from '../../mockServer';
import { Login } from '../Login';


afterEach(cleanup);

describe('Login view', () => {
  it('renders Login view without crashing and submit button is disabled', () => {
    render(<Login />);
    const submitButton = screen.getByText('Login');
    expect(submitButton).toHaveAttribute('disabled');
  });

  it('renders an error when password field is empty or when username field is empty', () => {
    render(<Login />);
    // get the submit button and click it
    const submitButton = screen.getByText('Login');
    // enter in a username and no password
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'abc' } });
    expect(submitButton).toHaveAttribute('disabled');

    // remove the username and enter in a password
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123' } });
    expect(submitButton).toHaveAttribute('disabled');
  });

  it('renders an error when inputing the wrong credentials', async () => {
    server.use(
      rest.post('*/api/dj-rest-auth/login/', (req, res, context) => {
        return res(context.status(400), context.json({ non_field_errors: ['Unable to log in with provided credentials.'] }));
      })
    );

    render(<Login />);
    // enter in credentials
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123' } });
    // click the login button
    const submitButton = screen.getByText('Login');
    fireEvent.click(submitButton);
    // the login should fail and display a message
    const errorMessage = await screen.findByText('Wrong username or password! Please try again.');
    expect(errorMessage).toBeInTheDocument();
    // clean up local storage
    localStorage.clear();
  });

  it('renders an error when server is down', async () => {
    render(<Login />);
    // enter in credentials
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123' } });
    // click the login button
    const submitButton = screen.getByText('Login');
    fireEvent.click(submitButton);
    // the login should fail and display a message
    const errorMessage = await screen.findByText('Server error - status 500');
    expect(errorMessage).toBeInTheDocument();
    // clean up local storage
    localStorage.clear();
  });

  it('redirects upon successful login', async () => {
    server.use(
      rest.post('*/api/dj-rest-auth/login/', (req, res, context) => {
        return res(context.status(200), context.json({ key: 'l236hj4hsdr0s' }));
      })
    );
    render(
      <MemoryRouter initialEntries={[{ pathname: '/login' }]}>
        <Login />
        <Route path='/dashboard'>Dashboard</Route>
      </MemoryRouter>
    );
    // enter in credentials
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123' } });
    // click the login button
    const submitButton = screen.getByText('Login');
    fireEvent.click(submitButton);
    // the successful login should redirect to dashboard route
    const redirectContent = await screen.findByText('Dashboard');
    expect(redirectContent).toBeInTheDocument();
    // clean up local storage
    localStorage.clear();
  });
});
