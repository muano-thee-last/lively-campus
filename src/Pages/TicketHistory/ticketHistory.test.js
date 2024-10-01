import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TicketHistory from './ticketHistory';

// Mock child components
jest.mock('./ticketView', () => {
  return function MockTicketView(props) {
    return <div data-testid="ticket-view">{JSON.stringify(props)}</div>;
  }
});
jest.mock('../dashboard/header', () => {
  return function MockHeader({ toggleSidebar }) {
    return <div data-testid="header" onClick={toggleSidebar}>Header</div>;
  }
});
jest.mock('../dashboard/footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  }
});
jest.mock('../dashboard/side-bar', () => {
  return function MockSideBar({ isSidebarOpen }) {
    return <div data-testid="sidebar">{isSidebarOpen ? 'Open' : 'Closed'}</div>;
  }
});

// Mock fetch
global.fetch = jest.fn();

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('TicketHistory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue('testUserId');
  });

  it('renders loading state initially', () => {
    global.fetch.mockImplementationOnce(() => new Promise(() => {}));
    render(<TicketHistory />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.queryByTestId('ticket-view')).not.toBeInTheDocument();
  });

  it('renders tickets when data is fetched successfully', async () => {
    const mockTickets = [
      { id: '1', eventTitle: 'Event 1', price: 100, purchaseDate: '2023-01-01', ticketCode: 'ABC123', venue: 'Venue 1', time: '10:00', date: '2023-02-01', imageUrl: 'image1.jpg' },
      { id: '2', eventTitle: 'Event 2', price: 200, purchaseDate: '2023-01-02', ticketCode: 'DEF456', venue: 'Venue 2', time: '11:00', date: '2023-02-02', imageUrl: 'image2.jpg' },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTickets),
    });

    render(<TicketHistory />);

    await waitFor(() => {
      expect(screen.getAllByTestId('ticket-view')).toHaveLength(2);
    });

    expect(screen.getByText(/"eventName":"Event 1"/)).toBeInTheDocument();
    expect(screen.getByText(/"eventName":"Event 2"/)).toBeInTheDocument();
  });

  it('renders error message when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Fetch failed'));

    render(<TicketHistory />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Fetch failed/)).toBeInTheDocument();
    });
  });

  it('filters out tickets with "Title not found"', async () => {
    const mockTickets = [
      { id: '1', eventTitle: 'Event 1', price: 100 },
      { id: '2', eventTitle: 'Title not found', price: 200 },
      { id: '3', eventTitle: 'Event 3', price: 300 },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTickets),
    });

    render(<TicketHistory />);

    await waitFor(() => {
      expect(screen.getAllByTestId('ticket-view')).toHaveLength(2);
    });

    expect(screen.getByText(/"eventName":"Event 1"/)).toBeInTheDocument();
    expect(screen.getByText(/"eventName":"Event 3"/)).toBeInTheDocument();
    expect(screen.queryByText(/"eventName":"Title not found"/)).not.toBeInTheDocument();
  });

  it('displays "No tickets" when there are no valid tickets', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<TicketHistory />);

    await waitFor(() => {
      expect(screen.getByText('No tickets')).toBeInTheDocument();
    });
  });

  it('toggles sidebar when header is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<TicketHistory />);

    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toHaveTextContent('Closed');
    });

    fireEvent.click(screen.getByTestId('header'));

    expect(screen.getByTestId('sidebar')).toHaveTextContent('Open');
  });
});