import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TicketView from './ticketView';

// Mock the TicketModal component
jest.mock('./ticketModal', () => {
  return function MockTicketModal({ isOpen, onClose, eventName }) {
    if (!isOpen) return null;
    return (
      <div data-testid="ticket-modal">
        <p>{eventName}</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

// Mock the CSS module
jest.mock('./ticketView.module.css', () => ({
  ticketContainer: 'mockTicketContainer',
  image: 'mockImage',
  eventName: 'mockEventName',
  detailsContainer: 'mockDetailsContainer',
  eventNamex: 'mockEventNamex',
  button: 'mockButton',
}));

describe('TicketView Component', () => {
  const mockProps = {
    eventName: 'Test Event',
    ticketPrice: 100,
    purchaseDate: '2023-06-01',
    ticketCode: 'TEST123',
    venue: 'Test Venue',
    time: '19:00',
    date: '2023-07-15',
    imageUrl: 'http://test.com/image.jpg',
  };

  it('renders ticket information correctly', () => {
    render(<TicketView {...mockProps} />);

    expect(screen.getByAltText('event')).toHaveAttribute('src', mockProps.imageUrl);
    expect(screen.getByText(mockProps.eventName)).toBeInTheDocument();
    expect(screen.getByText(`Location: ${mockProps.venue}`)).toBeInTheDocument();
    expect(screen.getByText(/Time: 19:00 July 15, 2023/)).toBeInTheDocument();
    expect(screen.getByText('View Ticket')).toBeInTheDocument();
  });

  it('opens modal when "View Ticket" button is clicked', () => {
    render(<TicketView {...mockProps} />);

    fireEvent.click(screen.getByText('View Ticket'));

    expect(screen.getByTestId('ticket-modal')).toBeInTheDocument();
    expect(screen.getByText(mockProps.eventName)).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(<TicketView {...mockProps} />);

    fireEvent.click(screen.getByText('View Ticket'));
    expect(screen.getByTestId('ticket-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('ticket-modal')).not.toBeInTheDocument();
  });

  it('formats date correctly', () => {
    const { rerender } = render(<TicketView {...mockProps} />);
    expect(screen.getByText(/July 15, 2023/)).toBeInTheDocument();

    rerender(<TicketView {...mockProps} date="2023-12-31" />);
    expect(screen.getByText(/December 31, 2023/)).toBeInTheDocument();
  });

  it('passes correct props to TicketModal', () => {
    render(<TicketView {...mockProps} />);

    fireEvent.click(screen.getByText('View Ticket'));

    const modal = screen.getByTestId('ticket-modal');
    expect(modal).toBeInTheDocument();
    
    // We can't directly check all props passed to TicketModal because of how we mocked it,
    // but we can check that the eventName is correctly passed
    expect(screen.getByText(mockProps.eventName)).toBeInTheDocument();
  });
});