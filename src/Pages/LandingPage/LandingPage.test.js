import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from './LandingPage';

global.fetch = jest.fn();

jest.mock('./LandingPage.css', () => ({}));

jest.mock('../../asserts/logo.png', () => 'mocked-logo.png');

jest.mock('../Login/login', () => () => <div data-testid="mock-login">Mock Login</div>);
jest.mock('../dashboard/footer', () => () => <div data-testid="mock-footer">Mock Footer</div>);

describe('LandingPage Component', () => {
  const mockEvents = [
    { id: 1, title: 'Tech Innovators Conference', description: 'A tech conference', date: '2025-01-01', imageUrl: 'tech-conf.jpg' },
    { id: 2, title: 'Wits 100 Celebration', description: 'University celebration', date: '2025-02-01', imageUrl: 'wits-100.jpg' },
    { id: 3, title: "Jaiv'ujuluke", description: 'Past event 1', date: '2023-01-01', imageUrl: 'past-event-1.jpg' },
    { id: 4, title: 'Mountain Biking Challenge', description: 'Past event 2', date: '2023-02-01', imageUrl: 'past-event-2.jpg' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockEvents),
    });
  });

  test('renders LandingPage component and fetches events', async () => {
    render(<LandingPage />);

    expect(screen.getByText('LivelyCampus')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Tech Innovators Conference')).toBeInTheDocument();
      expect(screen.getByText("Jaiv'ujuluke")).toBeInTheDocument();
    });

    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('handles login modal', async () => {
    render(<LandingPage />);

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('mock-login')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('landing-close-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('mock-login')).not.toBeInTheDocument();
    });
  });

  test('handles event navigation', async () => {
    jest.useFakeTimers();

    render(<LandingPage />);

    await waitFor(() => {
      expect(screen.getByText('Tech Innovators Conference')).toBeInTheDocument();
    });

    expect(screen.getByText('Tech Innovators Conference')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(6500);
    });

    await waitFor(() => {
      expect(screen.getByText('Wits 100 Celebration')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  test('handles API error', async () => {
    global.fetch.mockRejectedValue(new Error('API Error'));

    render(<LandingPage />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching events, please try again later.')).toBeInTheDocument();
    });
  });
});