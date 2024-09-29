import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TicketInfo from './ticketDetails';

describe('TicketInfo Component', () => {
  test('renders no ticket information if ticket prop is null', () => {
    render(<TicketInfo ticket={null} />);

    // Check if the fallback message is displayed
    const noTicketMessage = screen.getByText('No ticket information available');
    expect(noTicketMessage).toBeInTheDocument();
  });

  test('renders ticket information correctly when ticket prop is provided', () => {
    const ticket = {
      price: '$50',
      purchaseDate: '2023-09-28',
      code: 'ABC123',
    };

    render(<TicketInfo ticket={ticket} />);

    // Check if ticket price is rendered correctly
    const priceElement = screen.getByText('$50');
    expect(priceElement).toBeInTheDocument();

    // Check if purchase date is rendered correctly
    const dateElement = screen.getByText('2023-09-28');
    expect(dateElement).toBeInTheDocument();

    // Check if ticket code is rendered correctly
    const codeElement = screen.getByText('ABC123');
    expect(codeElement).toBeInTheDocument();
  });
});
