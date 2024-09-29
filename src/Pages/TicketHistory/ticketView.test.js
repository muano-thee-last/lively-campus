import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TicketView from './ticketView';
import TicketModal from './ticketModal'; // Import for verifying modal interaction

jest.mock('./TicketModal', () => {
  return ({ isOpen, onClose, eventName }) => (
    isOpen ? <div data-testid="modal"><h1>{eventName}</h1></div> : null
  );
});

describe('TicketView Component', () => {
  const mockProps = {
    eventName: "Campus Party",
    ticketPrice: "100",
    purchaseDate: "2023-09-28",
    ticketCode: "ABC123",
    venue: "Wits Great Hall",
    time: "19:00",
    date: "2023-09-28",
    imageUrl: "event.jpg",
  };

  test('renders TicketView with correct details', () => {
    render(<TicketView {...mockProps} />);

    // Verify event name is rendered
    expect(screen.getByText('Campus Party')).toBeInTheDocument();

    // Verify venue and time details
    expect(screen.getByText(/Wits Great Hall/)).toBeInTheDocument();
    expect(screen.getByText(/19:00 28 September 2023/)).toBeInTheDocument();
  });

  test('opens and closes the modal when button is clicked', () => {
    render(<TicketView {...mockProps} />);

    // Verify that modal is not open initially
    expect(screen.queryByTestId('modal')).toBeNull();

    // Click 'View Ticket' button to open the modal
    fireEvent.click(screen.getByText('View Ticket'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    // Verify that the modal displays event name
    expect(screen.getByText('Campus Party')).toBeInTheDocument();

    // Simulate closing the modal
    fireEvent.click(screen.getByTestId('modal'));
    expect(screen.queryByTestId('modal')).toBeNull();
  });
});
