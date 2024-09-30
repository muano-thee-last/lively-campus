import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainContent from './MainContent';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

describe('MainContent Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', async () => {
    render(
      <Router>
        <MainContent />
      </Router>
    );
    await waitFor(() => expect(screen.getByText(/Filters/i)).toBeInTheDocument());
  });

  test('displays current month and year', () => {
    render(
      <Router>
        <MainContent />
      </Router>
    );
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear().toString();
    expect(screen.getByText(currentMonth, { selector: '.current-month' })).toBeInTheDocument();
    expect(screen.getByText(currentYear, { selector: '.current-year' })).toBeInTheDocument();
  });

  test('changes month when select is changed', async () => {
    render(
      <Router>
        <MainContent />
      </Router>
    );
    const select = screen.getByRole('combobox', { name: /select month/i });
    fireEvent.change(select, { target: { value: '5' } });
    await waitFor(() => expect(screen.getByText('June', { selector: '.current-month' })).toBeInTheDocument());
  });

  test('fetches events on component mount', async () => {
    render(
      <Router>
        <MainContent />
      </Router>
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith('https://us-central1-witslivelycampus.cloudfunctions.net/app/events');
  });

  test('filters events when date filter is applied', async () => {
    render(
      <Router>
        <MainContent />
      </Router>
    );
    const dateInput = screen.getByLabelText('Date Filter');
    fireEvent.change(dateInput, { target: { value: '2023-06-15' } });
    await waitFor(() => expect(screen.getByText('June', { selector: '.current-month' })).toBeInTheDocument());
  });

  test('displays "No events today" when there are no events', async () => {
    render(
      <Router>
        <MainContent />
      </Router>
    );
    await waitFor(() => expect(screen.getByText('No events today')).toBeInTheDocument());
  });

  test('displays "No upcoming events" when there are no upcoming events', async () => {
    render(
      <Router>
        <MainContent />
      </Router>
    );
    await waitFor(() => expect(screen.getByText('No upcoming events')).toBeInTheDocument());
  });

  // Add more tests as needed for MainContent component functionality
});
