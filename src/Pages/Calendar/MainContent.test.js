import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import MainContent from './MainContent';
import '@testing-library/jest-dom';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]), // Return an empty array of events
  })
);

// Mock the current date to ensure consistent testing
const mockDate = new Date('2024-09-30T00:00:00.000Z');
const RealDate = Date;

// Mock console.log and console.error to suppress unnecessary logs during tests
const originalLog = console.log;
const originalError = console.error;

describe('MainContent', () => {
  beforeAll(() => {
    global.Date = class extends RealDate {
      constructor() {
        super();
        return mockDate;
      }
      static now() {
        return mockDate.getTime();
      }
    };
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    global.Date = RealDate;
    console.log = originalLog;
    console.error = originalError;
  });

  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(<MainContent />);
    });
    await waitFor(() => {
      expect(screen.getByText('No upcoming events')).toBeInTheDocument();
    });
  });

  it('displays no events message when there are no events', async () => {
    await act(async () => {
      render(<MainContent />);
    });
    await waitFor(() => {
      expect(screen.getByText('No upcoming events')).toBeInTheDocument();
    });
  });

  it('fetches events on component mount', async () => {
    await act(async () => {
      render(<MainContent />);
    });
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://us-central1-witslivelycampus.cloudfunctions.net/app/events');
    });
  });

  it('displays the current month and year', async () => {
    await act(async () => {
      render(<MainContent />);
    });
    expect(screen.getByText('September 2024')).toBeInTheDocument();
  });
});
