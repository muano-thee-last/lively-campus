import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import TicketVerification from './ticketVerification';

// Mock the TicketInfo component
jest.mock('./ticketDetails', () => ({ ticket }) => (
  <div>{ticket ? `Ticket Code: ${ticket.code}` : "No Ticket"}</div>
));

// Mock fetch function
global.fetch = jest.fn();

describe('TicketVerification Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders input, button, and no ticket initially', () => {
    render(<TicketVerification />);
    
    // Check if input, button, and no ticket info are rendered
    expect(screen.getByPlaceholderText('Enter ticket code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verify/i })).toBeInTheDocument();
    expect(screen.getByText(/No Ticket/i)).toBeInTheDocument();
  });


  test('displays error message when fetch fails', async () => {
    // Mock the fetch to throw an error
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<TicketVerification />);
    
    // Simulate input change
    fireEvent.change(screen.getByPlaceholderText('Enter ticket code'), {
      target: { value: 'invalid-code' },
    });

    // Simulate button click
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    // Wait for error message to appear
    await waitFor(() => expect(screen.getByText(/Unable to verify ticket/i)).toBeInTheDocument());
    
    // Verify that no ticket information is displayed
    expect(screen.getByText(/No Ticket/i)).toBeInTheDocument();
  });
});
