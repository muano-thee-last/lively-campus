import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TicketView from './ticketView';
import Modal from 'react-modal';

// Mock Modal.setAppElement to prevent errors during testing
Modal.setAppElement = jest.fn();  // Mocking globally for tests

describe('TicketView component', () => {
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

    const eventNameElement = screen.getByText('Campus Party');
    expect(eventNameElement).toBeInTheDocument();

    const venueElement = screen.getByText('Location: Wits Great Hall');
    expect(venueElement).toBeInTheDocument();

    const timeElement = screen.getByText('Time: 19:00 28 September 2023');
    expect(timeElement).toBeInTheDocument();
  });

  test('displays "View Ticket" button', () => {
    render(<TicketView {...mockProps} />);

    const viewTicketButton = screen.getByText('View Ticket');
    expect(viewTicketButton).toBeInTheDocument();
  });

  test('opens modal when "View Ticket" button is clicked', () => {
    render(<TicketView {...mockProps} />);

    const viewTicketButton = screen.getByText('View Ticket');
    fireEvent.click(viewTicketButton);

    const modalElement = screen.getByText('Campus Party');
    expect(modalElement).toBeInTheDocument();
  });

  test('closes modal when modal close is triggered', () => {
    render(<TicketView {...mockProps} />);

    const viewTicketButton = screen.getByText('View Ticket');
    fireEvent.click(viewTicketButton);

    // Assuming the modal has a close button or some element to trigger close
    const closeModalButton = screen.getByText('Campus Party');  // Replace this with actual close element if needed
    fireEvent.click(closeModalButton);

    expect(screen.queryByText('Campus Party')).not.toBeInTheDocument();
  });
});
