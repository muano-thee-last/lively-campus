import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TicketModal from './ticketModal';

jest.mock('react-modal', () => {
  return function MockModal({ isOpen, onRequestClose, children }) {
    if (!isOpen) return null;
    return (
      <div data-testid="modal">
        {children}
        <button onClick={onRequestClose}>Close Modal</button>
      </div>
    );
  };
});

jest.mock('./ticketModal.module.css', () => ({
  ticketModal: 'mockTicketModal',
  overlay: 'mockOverlay',
  contents: 'mockContents',
  modalContent: 'mockModalContent',
  eventImage: 'mockEventImage',
  ticketDetails: 'mockTicketDetails',
  ticketHeader: 'mockTicketHeader',
  infoRow: 'mockInfoRow',
  titleInput: 'mockTitleInput',
  qrCodeContainer: 'mockQrCodeContainer',
  qrCode: 'mockQrCode',
  closeBtn: 'mockCloseBtn',
}));

describe('TicketModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    eventImage: 'test-image.jpg',
    eventName: 'Test Event',
    eventDate: '2023-07-15',
    eventLocation: 'Test Venue',
    studentNo: '12345',
    ticketNo: 'TICKET123',
    ticketDate: '2023-07-15',
    ticketTime: '19:00',
    qrCode: 'qr-code.png',
    eventId: '1',
  };

  it('renders modal content when isOpen is true', () => {
    render(<TicketModal {...mockProps} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByAltText('Event')).toHaveAttribute('src', mockProps.eventImage);
    expect(screen.getByText(mockProps.eventName)).toBeInTheDocument();
    expect(screen.getByText(/15 July 2023 ~ Test Venue/)).toBeInTheDocument();
  });

  it('does not render modal content when isOpen is false', () => {
    render(<TicketModal {...mockProps} isOpen={false} />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('displays correct ticket information', () => {
    render(<TicketModal {...mockProps} />);

    expect(screen.getByText('Student No')).toBeInTheDocument();
    expect(screen.getByText(mockProps.studentNo)).toBeInTheDocument();
    expect(screen.getByText('Ticket Code')).toBeInTheDocument();
    expect(screen.getByText(mockProps.ticketNo)).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText(mockProps.ticketDate)).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText(mockProps.ticketTime)).toBeInTheDocument();
  });

  it('renders QR code image', () => {
    render(<TicketModal {...mockProps} />);

    expect(screen.getByAltText('QR Code')).toHaveAttribute('src', mockProps.qrCode);
  });

  it('calls onClose when close button is clicked', () => {
    render(<TicketModal {...mockProps} />);

    fireEvent.click(screen.getByText('Close'));
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('formats event date correctly', () => {
    render(<TicketModal {...mockProps} eventDate="2023-12-31" />);

    expect(screen.getByText(/31 December 2023 ~ Test Venue/)).toBeInTheDocument();
  });
});
