// SignIn.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import SignIn from './login';
import { auth } from './config'; // Adjust path as needed
import { signInWithPopup, sendSignInLinkToEmail } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  sendSignInLinkToEmail: jest.fn(),
  isSignInWithEmailLink: jest.fn(),
  signInWithEmailLink: jest.fn(),
}));

jest.mock('./config', () => ({
  auth: {},
  GoogleAuthProvider: jest.fn(),
  TwitterAuthProvider: jest.fn(),
  FacebookAuthProvider: jest.fn(),
}));

describe('SignIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders SignIn component with all buttons', () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument();
    expect(screen.getByText(/Continue with Twitter/i)).toBeInTheDocument();
    expect(screen.getByText(/Send Verification Link/i)).toBeInTheDocument();
  });

  test('calls Authenticate function on button click', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.click(screen.getByText(/Continue with Google/i));
    expect(signInWithPopup).toHaveBeenCalled();
  });

  test('handles email verification link', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    jest.spyOn(require('./config'), 'isSignInWithEmailLink').mockReturnValue(true);

    render(
      <Router>
        <SignIn />
      </Router>
    );

    // Simulate localStorage
    window.localStorage.setItem('emailForSignIn', 'test@example.com');

    // Simulate a successful email verification link
    jest.spyOn(require('firebase/auth'), 'signInWithEmailLink').mockResolvedValue({ user: { uid: '12345', displayName: 'John Doe', photoURL: 'photo.jpg', email: 'test@example.com' } });

    // Trigger the effect
    await waitFor(() => {
      expect(screen.queryByText(/Verification Email Sent/i)).toBeInTheDocument();
    });
  });

  test('sends email verification link when button is clicked', async () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    // Mock the response of sendSignInLinkToEmail
    sendSignInLinkToEmail.mockResolvedValue();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/Send Verification Link/i));

    await waitFor(() => {
      expect(screen.getByText(/Verification Email Sent/i)).toBeInTheDocument();
    });
  });

  test('handles failed email verification link', async () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    // Mock the response of sendSignInLinkToEmail
    sendSignInLinkToEmail.mockRejectedValue(new Error('Failed to send'));

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/Send Verification Link/i));

    await waitFor(() => {
      expect(screen.queryByText(/Failed to send email. Please try again./i)).toBeInTheDocument();
    });
  });
});
