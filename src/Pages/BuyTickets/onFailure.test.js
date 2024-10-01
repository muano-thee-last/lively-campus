import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FailurePage from './onFailure';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('FailurePage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders failure message', () => {
    render(
      <MemoryRouter>
        <FailurePage />
      </MemoryRouter>
    );

    expect(screen.getByText('😞 Purchase Failed!')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong. You will be redirected to your dashboard shortly.')).toBeInTheDocument();
  });

  it('navigates to dashboard after 4 seconds', () => {
    render(
      <MemoryRouter>
        <FailurePage />
      </MemoryRouter>
    );

    expect(mockNavigate).not.toHaveBeenCalled();

    // Fast-forward time by 4 seconds
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('clears the timeout on unmount', () => {
    const { unmount } = render(
      <MemoryRouter>
        <FailurePage />
      </MemoryRouter>
    );

    unmount();

    // Fast-forward time by 4 seconds
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});