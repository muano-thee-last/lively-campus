import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TicketModal from './ticketModal'; // Adjust the import according to your file structure
import Modal from 'react-modal';

describe('TicketModal component', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    eventImage: 'event.jpg',
    eventName: 'Campus Party',
    eventDate: '28 September 2023',
    eventLocation: 'Wits Great Hall',
    studentNo: '12345678',
    ticketNo: 'ABC123',
    ticketDate: '28 September 2023',
    ticketTime: '19:00',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ABC123',
  };

  test('renders TicketModal with correct details', () => {
    render(<TicketModal {...mockProps} />);

    expect(screen.getByText('Campus Party')).toBeInTheDocument();
    expect(screen.getByText('28 September 2023 ~ Wits Great Hall')).toBeInTheDocument();
    expect(screen.getByText('Student no: 12345678')).toBeInTheDocument();
    expect(screen.getByText('Ticket Number: ABC123')).toBeInTheDocument();
    expect(screen.getByText('Date: 28 September 2023')).toBeInTheDocument();
    expect(screen.getByText('Time: 19:00')).toBeInTheDocument();
    expect(screen.getByAltText('QR Code')).toHaveAttribute('src', mockProps.qrCode);
  });

  test('calls onClose when close button is clicked', () => {
    render(<TicketModal {...mockProps} />);
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('does not render modal when isOpen is false', () => {
    render(<TicketModal {...mockProps} isOpen={false} />);

    expect(screen.queryByText('Campus Party')).not.toBeInTheDocument();
  });
});
