import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainContent from './MainContent';
import '@testing-library/jest-dom';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]), // Return an empty array of events
  })
);

// Make sure to clear the mock before each test
beforeEach(() => {
  jest.clearAllMocks();
  fetch.mockClear();
  fetch.mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );
});

// Mock the current date to ensure consistent testing
const mockDate = new Date('2024-09-30T00:00:00.000Z');
const RealDate = Date;

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
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', async () => {
    await act(async () => {
      render(
        <Router>
          <MainContent />
        </Router>
      );
    });
    expect(screen.getByText('September 2024')).toBeInTheDocument();
  });

  test('fetches events on component mount', async () => {
    await act(async () => {
      render(
        <Router>
          <MainContent />
        </Router>
      );
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://us-central1-witslivelycampus.cloudfunctions.net/app/events');
  });

  test('displays no events message when there are no events', async () => {
    await act(async () => {
      render(
        <Router>
          <MainContent />
        </Router>
      );
    });
    await waitFor(() => {
      expect(screen.getByText('No upcoming events')).toBeInTheDocument();
    });
  });

  test('changes month when select is changed', async () => {
    console.log = jest.fn();
    await act(async () => {
      render(
        <Router>
          <MainContent />
        </Router>
      );
    });
    const select = screen.getByLabelText('Select month');
    await act(async () => {
      fireEvent.change(select, { target: { value: '8' } }); // September is index 8
    });

    await waitFor(() => {
      const viewingMonth = screen.getByTestId('viewing-month');
      console.log('Viewing month text:', viewingMonth.textContent);
      expect(viewingMonth.textContent).toContain('September');
      expect(viewingMonth.textContent).toContain('2024');
    }, { timeout: 3000 });

    console.log('Console logs:', console.log.mock.calls);
  });

  // Add more tests here for other functionalities like filtering, date selection, etc.
  test('filters events by date', async () => {
    await act(async () => {
      render(
        <Router>
          <MainContent />
        </Router>
      );
    });
    const dateFilter = screen.getByLabelText('Date Filter');
    await act(async () => {
      fireEvent.change(dateFilter, { target: { value: '2024-09-15' } });
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue('2024-09-15')).toBeInTheDocument();
    });
  });

  test('filters events by type', async () => {
    await act(async () => {
      render(
        <Router>
          <MainContent />
        </Router>
      );
    });
    const typeFilter = screen.getByRole('combobox', { name: '' });
    await act(async () => {
      fireEvent.change(typeFilter, { target: { value: 'Seminar' } });
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue('Seminar')).toBeInTheDocument();
    });
  });

  test('filters events by location', async () => {
    await act(async () => {
      render(
        <Router>
          <MainContent />
        </Router>
      );
    });
    const locationFilter = screen.getByPlaceholderText('location');
    await act(async () => {
      fireEvent.change(locationFilter, { target: { value: 'Campus Center' } });
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue('Campus Center')).toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    fetch.mockImplementationOnce(() => Promise.reject("API is down"));

    await act(async () => {
      render(
        <Router>
          <MainContent />
        </Router>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('No upcoming events')).toBeInTheDocument();
    });

    expect(console.error).toHaveBeenCalledWith('Error fetching events:', "API is down");

    console.error = originalError;
  });
});
