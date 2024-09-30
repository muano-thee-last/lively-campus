import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TicketHistory from './ticketHistory';
import { act } from 'react-dom/test-utils';

// Mock the child components
jest.mock('./ticketView', () => {
  return function MockTicketView(props) {
    return <div data-testid="ticket-view">{JSON.stringify(props)}</div>;
  };
});
jest.mock('../dashboard/header', () => () => <div data-testid="header">Header</div>);
jest.mock('../dashboard/footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('../dashboard/side-bar', () => () => <div data-testid="sidebar">Sidebar</div>);

// Mock the fetch function
global.fetch = jest.fn();

describe('TicketHistory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    sessionStorage.setItem('uid', 'testUserId');
  });


  it('renders error message when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<TicketHistory />);

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    });
  });

  it('renders tickets when fetch is successful', async () => {
    const mockTickets = [
      { id: 1, eventTitle: 'Event 1', price: 10, purchaseDate: '2023-01-01', ticketCode: 'ABC123', venue: 'Venue 1', time: '10:00', date: '2023-02-01', imageUrl: 'image1.jpg' },
      { id: 2, eventTitle: 'Event 2', price: 20, purchaseDate: '2023-01-02', ticketCode: 'DEF456', venue: 'Venue 2', time: '11:00', date: '2023-02-02', imageUrl: 'image2.jpg' },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTickets),
    });

    await act(async () => {
      render(<TicketHistory />);
    });

    await waitFor(() => {
      expect(screen.queryByText('No tickets')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('ticket-view')).toHaveLength(2);
    });
  });

  it('filters out tickets with "Title not found"', async () => {
    const mockTickets = [
      { id: 1, eventTitle: 'Event 1', price: 10, purchaseDate: '2023-01-01', ticketCode: 'ABC123', venue: 'Venue 1', time: '10:00', date: '2023-02-01', imageUrl: 'image1.jpg' },
      { id: 2, eventTitle: 'Title not found', price: 20, purchaseDate: '2023-01-02', ticketCode: 'DEF456', venue: 'Venue 2', time: '11:00', date: '2023-02-02', imageUrl: 'image2.jpg' },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTickets),
    });

    await act(async () => {
      render(<TicketHistory />);
    });

    await waitFor(() => {
      expect(screen.queryByText('No tickets')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('ticket-view')).toHaveLength(1);
    });
  });

  it('renders "No tickets" when there are no valid tickets', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await act(async () => {
      render(<TicketHistory />);
    });

    await waitFor(() => {
      expect(screen.getByText('No tickets')).toBeInTheDocument();
    });
  });

  it('renders Header, Sidebar, and Footer components', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await act(async () => {
      render(<TicketHistory />);
    });

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});