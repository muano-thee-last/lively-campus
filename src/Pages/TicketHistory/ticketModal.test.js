import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-modal
jest.mock('react-modal', () => {
  const Modal = ({ children, isOpen, onRequestClose }) => (
    isOpen ? (
      <div data-testid="modal" onClick={onRequestClose}>
        {children}
      </div>
    ) : null
  );
  Modal.setAppElement = jest.fn();
  return Modal;
});

// Import TicketModal after mocking react-modal
import TicketModal from './ticketModal';

describe('TicketModal', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    eventImage: 'event-image.jpg',
    eventName: 'Test Event',
    eventDate: '2023-07-01',
    eventLocation: 'Test Location',
    studentNo: '12345',
    ticketNo: 'TICKET123',
    ticketDate: '2023-07-01',
    ticketTime: '19:00',
    qrCode: 'qr-code.jpg'
  };

  it('renders correctly when open', () => {
    render(<TicketModal {...mockProps} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('2023-07-01 ~ Test Location')).toBeInTheDocument();
    expect(screen.getByText('Student no:')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('Ticket Number:')).toBeInTheDocument();
    expect(screen.getByText('TICKET123')).toBeInTheDocument();
    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText('2023-07-01')).toBeInTheDocument();
    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(screen.getByText('19:00')).toBeInTheDocument();
    expect(screen.getByText('Scan QR code at the entrance')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<TicketModal {...mockProps} isOpen={false} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });


  it('renders event image correctly', () => {
    render(<TicketModal {...mockProps} />);
    const image = screen.getByAltText('Event');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'event-image.jpg');
  });

  it('renders QR code image correctly', () => {
    render(<TicketModal {...mockProps} />);
    const qrCode = screen.getByAltText('QR Code');
    expect(qrCode).toBeInTheDocument();
    expect(qrCode).toHaveAttribute('src', 'qr-code.jpg');
  });
});