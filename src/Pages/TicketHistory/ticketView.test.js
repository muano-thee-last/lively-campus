import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for additional matchers like toBeInTheDocument
import TicketView from './ticketView'; // Adjust the path if needed

describe('TicketView Component', () => {
  const mockProps = {
    eventName: 'React Conference 2024',
    ticketPrice: 500,
    purchaseDate: '2024-10-01',
    ticketCode: 'REACTCONF2024',
  };

  test('renders the TicketView with correct details', () => {
    render(<TicketView {...mockProps} />);

    // Check if the event name is rendered correctly
    const eventName = screen.getByText(/React Conference 2024/i);
    expect(eventName).toBeInTheDocument();

    // Check if the ticket price is rendered correctly
    const ticketPrice = screen.getByText(/Price: R500/i);
    expect(ticketPrice).toBeInTheDocument();

    const purchaseDate = screen.getByText(/Purchase Date: 01\/10\/2024/i); // Date format may vary based on locale
    expect(purchaseDate).toBeInTheDocument();

    const ticketCode = screen.getByText(/Ticket Code: REACTCONF2024/i);
    expect(ticketCode).toBeInTheDocument();

    const qrCodeImage = screen.getByAltText(/QR code for ticket REACTCONF2024/i);
    expect(qrCodeImage).toBeInTheDocument();
    expect(qrCodeImage).toHaveAttribute(
      'src',
      'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=REACTCONF2024'
    );
  });

  test('renders with the correct styles', () => {
    const { container } = render(<TicketView {...mockProps} />);
    
    // Check if the ticket container has the correct background color and border
    const ticketContainer = container.firstChild;
    expect(ticketContainer).toHaveStyle('background-color: #fdfdfd');
    expect(ticketContainer).toHaveStyle('border-radius: 15px');
    expect(ticketContainer).toHaveStyle('max-width: 400px');
  });
});
