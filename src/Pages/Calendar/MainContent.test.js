import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainContent from './MainContent';
import '@testing-library/jest-dom';
import CalendarPopUpCard from './components/CalendarPopUpCard';

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

// Add this mock at the top of your file
jest.mock('./components/CalendarPopUpCard', () => {
  return function DummyCalendarPopUpCard({ date, events, onClose }) {
    return (
      <div data-testid="calendar-popup">
        <div>{date}</div>
        {events.map(event => <div key={event.id}>{event.title}</div>)}
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

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

  test('renders mini calendar', async () => {
    await act(async () => {
      render(
        <Router>
          <MainContent />
        </Router>
      );
    });
    const miniCalendarRow = screen.getAllByText('S')[0].closest('.mini-calendar-row');
    expect(miniCalendarRow).toHaveTextContent(/S.*M.*T.*W.*T.*F.*S/);
  });

  test('displays today events', async () => {
    const mockEvents = [
      { id: 1, title: 'Test Event 1', date: '2024-09-30T10:00:00.000Z' },
      { id: 2, title: 'Test Event 2', date: '2024-09-30T14:00:00.000Z' },
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      })
    );

    await act(async () => {
      render(
        <Router>
          <MainContent />
        </Router>
      );
    });

    await waitFor(() => {
      const todayEventsList = screen.getByText('Today').nextElementSibling;
      expect(todayEventsList).toHaveTextContent('Test Event 1');
      expect(todayEventsList).toHaveTextContent('Test Event 2');
    });
  });

  test('displays upcoming events', async () => {
    const mockEvents = [
      { id: 1, title: 'Future Event 1', date: '2024-10-01T10:00:00.000Z' },
      { id: 2, title: 'Future Event 2', date: '2024-10-02T14:00:00.000Z' },
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      })
    );

    await act(async () => {
      render(
        <Router>
          <MainContent />
        </Router>
      );
    });

    await waitFor(() => {
      const upcomingEventsList = screen.getByText('Upcoming Events').nextElementSibling;
      expect(upcomingEventsList).toHaveTextContent('Future Event 1');
      expect(upcomingEventsList).toHaveTextContent('Future Event 2');
    });
  });

  test('handles date click and shows popup', async () => {
    await act(async () => {
      render(
        <Router>
          <MainContent />
          <CalendarPopUpCard date="Sun Sep 15 2024" events={[]} onClose={() => {}} />
        </Router>
      );
    });

    const dayElement = screen.getAllByText('15')[0]; // Get the first element with text '15'
    fireEvent.click(dayElement);

    await waitFor(() => {
      const popup = screen.getByTestId('calendar-popup');
      expect(popup).toBeInTheDocument();
      expect(popup).toHaveTextContent('Sun Sep 15 2024');
    }, { timeout: 3000 });
  });

  test('closes popup when close button is clicked', async () => {
    const handleClose = jest.fn();
    await act(async () => {
      render(
        <Router>
          <MainContent />
          <CalendarPopUpCard date="Sun Sep 15 2024" events={[]} onClose={handleClose} />
        </Router>
      );
    });

    const dayElement = screen.getAllByText('15')[0];
    fireEvent.click(dayElement);

    await waitFor(() => {
      expect(screen.getByTestId('calendar-popup')).toBeInTheDocument();
    }, { timeout: 3000 });

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  // Add this test if you want to check the swipe functionality
  test('handles swipe gestures', async () => {
    console.log = jest.fn();
    await act(async () => {
      render(
        <Router>
          <MainContent />
        </Router>
      );
    });

    const calendar = screen.getByTestId('calendar-container');

    // Simulate swipe left (to go to next month)
    fireEvent.touchStart(calendar, { touches: [{ clientX: 100 }] });
    fireEvent.touchMove(calendar, { touches: [{ clientX: 50 }] });
    fireEvent.touchEnd(calendar, { changedTouches: [{ clientX: 0 }] });

    await waitFor(() => {
      const viewingMonth = screen.getByTestId('viewing-month');
      console.log('After left swipe:', viewingMonth.textContent);
      expect(viewingMonth).toHaveTextContent('September 2024');
    }, { timeout: 3000 });

    // Simulate swipe right (to go back to previous month)
    fireEvent.touchStart(calendar, { touches: [{ clientX: 0 }] });
    fireEvent.touchMove(calendar, { touches: [{ clientX: 50 }] });
    fireEvent.touchEnd(calendar, { changedTouches: [{ clientX: 100 }] });

    await waitFor(() => {
      const viewingMonth = screen.getByTestId('viewing-month');
      console.log('After right swipe:', viewingMonth.textContent);
      expect(viewingMonth).toHaveTextContent('September 2024');
    }, { timeout: 3000 });

    console.log('Console logs:', console.log.mock.calls);
  });
});