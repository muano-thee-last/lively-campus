import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useNavigate } from 'react-router-dom';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import VerifyEmail from './verifyEmail';
import createNewUser from './createNewUser';
import { auth } from './config';

// Mock all the dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  isSignInWithEmailLink: jest.fn(),
  signInWithEmailLink: jest.fn(),
  auth: {},
}));

jest.mock('./createNewUser', () => jest.fn());
jest.mock('./config', () => ({
  auth: {},
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('VerifyEmail Component', () => {
  const mockNavigate = jest.fn();
  const originalLocalStorage = window.localStorage;
  const originalSessionStorage = window.sessionStorage;
  const originalPrompt = window.prompt;
  const originalConfirm = window.confirm;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);

    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    // Mock sessionStorage
    const sessionStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
    });

    // Mock window.prompt
    window.prompt = jest.fn();

    // Mock window.confirm
    window.confirm = jest.fn();

    // Reset fetch mock
    global.fetch.mockReset();
  });

  afterEach(() => {
    // Restore original implementations
    Object.defineProperty(window, 'localStorage', { value: originalLocalStorage });
    Object.defineProperty(window, 'sessionStorage', { value: originalSessionStorage });
    window.prompt = originalPrompt;
    window.confirm = originalConfirm;
  });



  it('should handle invalid verification link', async () => {
    isSignInWithEmailLink.mockReturnValue(false);
    
    render(<VerifyEmail />);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid verification link.')).toBeInTheDocument();
    });
  });

  it('should prompt for email if not in localStorage', async () => {
    isSignInWithEmailLink.mockReturnValue(true);
    window.localStorage.getItem.mockReturnValue(null);
    window.prompt.mockReturnValue('test@example.com');
    signInWithEmailLink.mockResolvedValue({ user: { uid: 'test-uid' } });
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: false }),
    });
    
    render(<VerifyEmail />);
    
    await waitFor(() => {
      expect(window.prompt).toHaveBeenCalledWith(
        'Please provide your email for confirmation'
      );
    });
  });

  it('should handle successful verification for existing user', async () => {
    isSignInWithEmailLink.mockReturnValue(true);
    window.localStorage.getItem.mockReturnValue('test@example.com');
    signInWithEmailLink.mockResolvedValue({ user: { uid: 'test-uid' } });
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: true }),
    });

    jest.useFakeTimers();
    
    render(<VerifyEmail />);
    
    await waitFor(() => {
      expect(screen.getByText('Email verified successfully! Redirecting...')).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    
    jest.useRealTimers();
  });



  it('should handle verification error', async () => {
    isSignInWithEmailLink.mockReturnValue(true);
    window.localStorage.getItem.mockReturnValue('test@example.com');
    signInWithEmailLink.mockRejectedValue(new Error('Verification failed'));
    
    render(<VerifyEmail />);
    
    await waitFor(() => {
      expect(screen.getByText('Verification failed. Please try again.')).toBeInTheDocument();
      expect(screen.getByText('Return to Sign In')).toBeInTheDocument();
    });
  });

  it('should show retry button and navigate to signin when clicked', async () => {
    isSignInWithEmailLink.mockReturnValue(true);
    window.localStorage.getItem.mockReturnValue('test@example.com');
    signInWithEmailLink.mockRejectedValue(new Error('Verification failed'));
    
    render(<VerifyEmail />);
    
    await waitFor(() => {
      const retryButton = screen.getByText('Return to Sign In');
      fireEvent.click(retryButton);
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });


});