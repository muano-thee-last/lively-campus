// ticketDetails.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for additional matchers like toBeInTheDocument
import TicketInfo from './ticketDetails';

describe('TicketInfo Component', () => {
  test('displays message when no ticket information is available', () => {
    render(<TicketInfo ticket={null} />);
    const noTicketMessage = screen.getByText(/No ticket information available/i);
    expect(noTicketMessage).toBeInTheDocument();
    expect(noTicketMessage).toHaveClass('ticket-info empty');
  });

  test('displays ticket details when ticket is provided', () => {
    const ticket = {
      userName: 'John Doe',
      price: '$100',
      purchaseDate: '2023-08-25',
      code: 'TICKET123',
    };

    render(<TicketInfo ticket={ticket} />);

    // Check for ticket details
    expect(screen.getByText(/Bought By:/i)).toBeInTheDocument();
    expect(screen.getByText(ticket.userName)).toBeInTheDocument();

    expect(screen.getByText(/Ticket Price:/i)).toBeInTheDocument();
    expect(screen.getByText(ticket.price)).toBeInTheDocument();

    expect(screen.getByText(/Purchase Date:/i)).toBeInTheDocument();
    expect(screen.getByText(ticket.purchaseDate)).toBeInTheDocument();

    expect(screen.getByText(/Ticket Code:/i)).toBeInTheDocument();
    expect(screen.getByText(ticket.code)).toBeInTheDocument();
  });
});
