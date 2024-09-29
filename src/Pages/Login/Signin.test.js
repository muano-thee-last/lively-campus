import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './login';

// Mock the entire firebase/auth module
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  TwitterAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  isSignInWithEmailLink: jest.fn(),
  signInWithEmailLink: jest.fn(),
  sendSignInLinkToEmail: jest.fn(),
}));

// Mock the config file
jest.mock('./config', () => ({
  auth: {},
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock createNewUser function
jest.mock('./createNewUser', () => jest.fn());

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe('SignIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders SignIn component', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with Twitter')).toBeInTheDocument();
  });

  test('handles email input', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('sends verification email', async () => {
    const sendSignInLinkToEmail = require('firebase/auth').sendSignInLinkToEmail;
    sendSignInLinkToEmail.mockResolvedValue();

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const sendButton = screen.getByText('Send Verification Link');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(sendSignInLinkToEmail).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        expect.anything()
      );
      expect(screen.getByText('Verification Email Sent')).toBeInTheDocument();
    });
  });




  test('displays error message when sending email fails', async () => {
    const sendSignInLinkToEmail = require('firebase/auth').sendSignInLinkToEmail;
    sendSignInLinkToEmail.mockRejectedValue(new Error("Email send failed"));

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const sendButton = screen.getByText('Send Verification Link');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to send email. Please try again.")).toBeInTheDocument();
    });
  });
});
