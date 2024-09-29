import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TicketView from './ticketView';

// Mock the TicketModal component
jest.mock('./ticketModal', () => {
  return function MockTicketModal({ isOpen, onClose, eventName }) {
    return isOpen ? (
      <div data-testid="mock-modal">
        <p>{eventName}</p>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null;
  };
});

// Mock the image imports
jest.mock('../../asserts/location_icon.jpg', () => 'mocked-location-icon.jpg');
jest.mock('../../asserts/calender_icon.jpg', () => 'mocked-calendar-icon.jpg');

describe('TicketView Component', () => {
  const mockProps = {
    eventName: 'Test Event',
    ticketPrice: 50,
    purchaseDate: '2023-07-01',
    ticketCode: 'TEST123',
    venue: 'Test Venue',
    time: '19:00',
    date: '2023-07-15',
    imageUrl: 'test-image.jpg'
  };

  it('renders correctly with given props', () => {
    render(<TicketView {...mockProps} />);

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText(/Location:/)).toHaveTextContent('Location: Test Venue');
    expect(screen.getByText(/Time:/)).toHaveTextContent('Time: 19:00 15 July 2023');
    expect(screen.getByRole('button', { name: 'View Ticket' })).toBeInTheDocument();
    expect(screen.getByAltText('event')).toHaveAttribute('src', 'test-image.jpg');
  });

  it('opens modal when "View Ticket" button is clicked', () => {
    render(<TicketView {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'View Ticket' }));

    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('closes modal when close button in modal is clicked', () => {
    render(<TicketView {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'View Ticket' }));
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close Modal' }));
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });

  it('formats date correctly', () => {
    render(<TicketView {...mockProps} />);

    expect(screen.getByText(/Time:/)).toHaveTextContent('Time: 19:00 15 July 2023');
  });

  it('passes correct props to TicketModal', () => {
    render(<TicketView {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'View Ticket' }));

    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('handles missing props gracefully', () => {
    const incompleteProps = {
      eventName: 'Incomplete Event',
      imageUrl: 'incomplete-image.jpg'
    };

    render(<TicketView {...incompleteProps} />);

    expect(screen.getByText('Incomplete Event')).toBeInTheDocument();
    expect(screen.getByAltText('event')).toHaveAttribute('src', 'incomplete-image.jpg');
    expect(screen.getByText(/Location:/)).toHaveTextContent('Location:');
    expect(screen.getByText(/Time:/)).toHaveTextContent('Time:');
  });
});