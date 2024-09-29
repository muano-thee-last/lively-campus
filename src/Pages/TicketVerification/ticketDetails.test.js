import React from 'react';
import { render, screen } from '@testing-library/react';
import TicketInfo from './ticketDetails';

describe('TicketInfo Component', () => {
  test('renders "No ticket information available" when no ticket is passed', () => {
    render(<TicketInfo ticket={null} />);

    // Check if the "No ticket information available" message is displayed
    expect(screen.getByText(/No ticket information available/i)).toBeInTheDocument();
  });

  test('displays correct ticket information when ticket is provided', () => {
    const ticket = {
      price: 'R100',
      purchaseDate: '2024-09-01',
      code: 'ABC123',
    };

    render(<TicketInfo ticket={ticket} />);

    // Check if the ticket details are displayed correctly
    expect(screen.getByText(/Ticket Price:/i)).toBeInTheDocument();
    expect(screen.getByText(/R100/i)).toBeInTheDocument();

    expect(screen.getByText(/Purchase Date:/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-09-01/i)).toBeInTheDocument();

    expect(screen.getByText(/Ticket Code:/i)).toBeInTheDocument();
    expect(screen.getByText(/ABC123/i)).toBeInTheDocument();
  });
});
