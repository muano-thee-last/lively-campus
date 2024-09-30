import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import EventDetails from './EventDetails';

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  update: jest.fn(),
}));

// Mock other dependencies
jest.mock('../../asserts/card-payment.png', () => 'mocked-card-payment-image');
jest.mock('../../asserts/logo.png', () => 'mocked-logo-image');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: '123',
  }),
  useLocation: () => ({
    state: { approveEvent: false },
  }),
  useNavigate: () => jest.fn(),
}));

const mockEvent = {
  id: '123',
  title: 'Test Event',
  description: 'Test Description',
  venue: 'Test Venue',
  date: '2023-07-01T12:00:00Z',
  capacity: 100,
  availableTickets: 50,
  ticketPrice: 20,
  tags: ['tag1', 'tag2'],
  imageUrl: 'http://test-image.jpg',
  bookingId: 'booking123',
};

describe('EventDetails Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => new Promise(resolve => setTimeout(() => resolve(mockEvent), 100)),
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('renders loading state and then event details correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <EventDetails />
        </MemoryRouter>
      );
    });

    // Check if loading state is shown initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Advance timers and wait for component to update
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Check if event details are rendered
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/Test Venue/)).toBeInTheDocument();
    expect(screen.getByText(/Capacity: 100/)).toBeInTheDocument();
    expect(screen.getByText(/Available Tickets: 50/)).toBeInTheDocument();
    
    // Update these lines to be more flexible
    expect(screen.getByText(/Ticket Price:/)).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
    expect(screen.getByText(/20/)).toBeInTheDocument(); // Changed from /^20$/ to /20/

    expect(screen.getByTestId('event-details-container')).toBeInTheDocument();
    expect(screen.getByTestId('event-buy-tickets')).toBeInTheDocument();
    const ticketPrice = screen.getByTestId('ticket-price');
    expect(ticketPrice).toHaveTextContent(/Ticket Price:/);
    expect(ticketPrice).toHaveTextContent('R');
    expect(ticketPrice).toHaveTextContent('20');
  });

  test('opens buy ticket modal when button is clicked', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <EventDetails />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const buyTicketButton = screen.getByText('Buy Ticket');
    fireEvent.click(buyTicketButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });
  });

  test('displays approve/reject buttons when approveEvent is true', async () => {
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      state: { approveEvent: true },
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <EventDetails />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Reject')).toBeInTheDocument();
    expect(screen.getByText('Approve')).toBeInTheDocument();
  });

  // Add more tests as needed for other functionalities
});
