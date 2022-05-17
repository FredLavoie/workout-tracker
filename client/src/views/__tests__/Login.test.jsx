import React from 'react';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { Login } from '../Login';


afterEach(cleanup);

describe('Login view', () => {
  it('renders Login view crashing and submit button is disabled', () => {
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
    render(<Login />);
    // enter in credentials
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123' } });
    // click the login button
    const submitButton = screen.getByText('Login');
    fireEvent.click(submitButton);

    // TODO: mock the login endpoint

    // the validation should fail and get the proper error message
    // const errorMessage = await waitFor(() => screen.getByText('Network request failed'));
    // expect(errorMessage).toBeInTheDocument();
  });
});
