import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import TicketHistory from './ticketHistory';


jest.mock('../dashboard/header', () => {
  return function MockHeader({ toggleSidebar }) {
    return <div data-testid="header" onClick={toggleSidebar}>Header</div>;
  };
});

jest.mock('../dashboard/side-bar', () => {
  return function MockSideBar({ isSidebarOpen }) {
    return <div data-testid="sidebar">{isSidebarOpen ? 'Open' : 'Closed'}</div>;
  };
});

jest.mock('../dashboard/footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('./ticketView', () => {
  return function MockTicketView(props) {
    return <div data-testid="ticket-view">{props.eventName}</div>;
  };
});

describe('TicketHistory Component', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([
        { id: 1, eventTitle: 'Event 1', eventId: 'e1' },
        { id: 2, eventTitle: 'Event 2', eventId: 'e2' },
      ]),
    });
    sessionStorage.setItem('uid', 'testUser');
  });

  afterEach(() => {
    global.fetch.mockRestore();
    sessionStorage.clear();
  });

  it('renders ticket history when tickets are available', async () => {
    await act(async () => {
      render(<TicketHistory />);
    });

    await waitFor(() => {
      expect(screen.getByText('Ticket History')).toBeInTheDocument();
      expect(screen.getAllByTestId('ticket-view')).toHaveLength(2);
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });
  });

  it('renders "No tickets bought yet" when no valid tickets are available', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([
        { id: 1, eventTitle: 'Title not found' },
        { id: 2, eventTitle: 'Title not found' },
      ]),
    });

    await act(async () => {
      render(<TicketHistory />);
    });

    await waitFor(() => {
      expect(screen.getByText('No tickets bought yet')).toBeInTheDocument();
    });
  });

  it('renders error message when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    await act(async () => {
      render(<TicketHistory />);
    });

    await waitFor(() => {
      expect(screen.getByText('No tickets bought yet')).toBeInTheDocument();
    });
  });

  it('toggles sidebar when header is clicked', async () => {
    await act(async () => {
      render(<TicketHistory />);
    });

    const header = screen.getByTestId('header');
    const sidebar = screen.getByTestId('sidebar');

    expect(sidebar).toHaveTextContent('Closed');

    act(() => {
      header.click();
    });

    expect(sidebar).toHaveTextContent('Open');
  });

  it('renders footer', async () => {
    await act(async () => {
      render(<TicketHistory />);
    });

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
