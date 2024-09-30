import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EventDetails from './EventDetails';
import '@testing-library/jest-dom';

// Mock TextEncoder and TextDecoder
class MockTextEncoder {
  encode() { return new Uint8Array(); }
}
class MockTextDecoder {
  decode() { return ''; }
}

global.TextEncoder = MockTextEncoder;
global.TextDecoder = MockTextDecoder;

// Mock the react-icons
jest.mock('react-icons/fa', () => ({
  FaMapMarkerAlt: () => <span>MapIcon</span>,
  FaCalendarAlt: () => <span>CalendarIcon</span>,
  FaUsers: () => <span>UsersIcon</span>,
  FaTicketAlt: () => <span>TicketIcon</span>,
}));

// Mock the fetch function
global.fetch = jest.fn();

// Mock Firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  update: jest.fn(),
}));

// Update the BuyTicket mock
jest.mock('../BuyTickets/purchase', () => () => <div data-testid="mock-buy-tickets">Mock BuyTickets</div>);

const mockEvent = {
  id: '1',
  title: 'Test Event',
  venue: 'Test Venue',
  date: '2023-07-01T10:00:00',
  capacity: 100,
  availableTickets: 50,
  description: 'Test Description',
  imageUrl: 'http://test-image.jpg',
  tags: ['tag1', 'tag2'],
  ticketPrice: 10,
  bookingId: 'booking123',
};

describe('EventDetails', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockImplementation((url) => {
      if (url.includes('/events/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEvent),
        });
      } else if (url.includes('/getEnvgoogle')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ value: 'mock-google-api-key' }),
        });
      } else if (url.includes('/getEnvWiman')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ value: 'mock-wiman-api-key' }),
        });
      } else if (url.includes('/bookings/status/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: 'confirmed' }),
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('renders event details correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/events/1']}>
        <Routes>
          <Route path="/events/:id" element={<EventDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
    expect(screen.getByText('Capacity: 100')).toBeInTheDocument();
    expect(screen.getByText('Available Tickets: 50')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/Ticket Price:/)).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
    
    // Change this line
    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'strong' && content.includes('10');
    })).toBeInTheDocument();
  });

  it('opens buy ticket modal when button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/events/1']}>
        <Routes>
          <Route path="/events/:id" element={<EventDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const buyTicketButton = screen.getByText('Buy Ticket');
    fireEvent.click(buyTicketButton);

    await waitFor(() => {
      expect(screen.getByTestId('mock-buy-tickets')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
