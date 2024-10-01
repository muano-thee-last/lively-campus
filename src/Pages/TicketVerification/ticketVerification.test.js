import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TicketVerification from './ticketVerification';

// Mock the QrReader component
jest.mock('react-qr-reader', () => ({
  QrReader: ({ onScan }) => (
    <button onClick={() => onScan('mocked-qr-code')}>Scan QR Code</button>
  ),
}));

// Mock the fetch function
global.fetch = jest.fn();

describe('TicketVerification Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders TicketVerification component', () => {
    render(<TicketVerification />);
    expect(screen.getByText('Ticket Verification')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter ticket code')).toBeInTheDocument();
    expect(screen.getByText('Verify')).toBeInTheDocument();
    expect(screen.getByText('📷')).toBeInTheDocument();
  });

  test('handles input change', () => {
    render(<TicketVerification />);
    const input = screen.getByPlaceholderText('Enter ticket code');
    fireEvent.change(input, { target: { value: 'TEST123' } });
    expect(input.value).toBe('TEST123');
  });

  test('verifies ticket on button click', async () => {
    const mockTicketData = {
      price: 100,
      purchaseDate: '2023-05-01',
      ticketCode: 'TEST123',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTicketData),
    });

    render(<TicketVerification />);
    const input = screen.getByPlaceholderText('Enter ticket code');
    const verifyButton = screen.getByText('Verify');

    fireEvent.change(input, { target: { value: 'TEST123' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText('Ticket Information')).toBeInTheDocument();
      expect(screen.getByText('Price: R100')).toBeInTheDocument();
      expect(screen.getByText('Purchase Date: 2023-05-01')).toBeInTheDocument();
      expect(screen.getByText('Code: TEST123')).toBeInTheDocument();
    });
  });

  test('displays error message on failed verification', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<TicketVerification />);
    const input = screen.getByPlaceholderText('Enter ticket code');
    const verifyButton = screen.getByText('Verify');

    fireEvent.change(input, { target: { value: 'INVALID' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText('Unable to verify ticket. Please try again.')).toBeInTheDocument();
    });
  });

  test('toggles camera when camera button is clicked', () => {
    render(<TicketVerification />);
    const cameraButton = screen.getByText('📷');

    fireEvent.click(cameraButton);
    expect(screen.getByText('Scan QR Code')).toBeInTheDocument();

    fireEvent.click(cameraButton);
    expect(screen.queryByText('Scan QR Code')).not.toBeInTheDocument();
  });

  test('handles QR code scan', async () => {
    const mockTicketData = {
      price: 200,
      purchaseDate: '2023-05-02',
      ticketCode: 'QR123',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTicketData),
    });

    render(<TicketVerification />);
    const cameraButton = screen.getByText('📷');
    fireEvent.click(cameraButton);

    const scanButton = screen.getByText('Scan QR Code');
    fireEvent.click(scanButton);

    await waitFor(() => {
      expect(screen.getByText('Ticket Information')).toBeInTheDocument();
      expect(screen.getByText('Price: R200')).toBeInTheDocument();
      expect(screen.getByText('Purchase Date: 2023-05-02')).toBeInTheDocument();
      expect(screen.getByText('Code: QR123')).toBeInTheDocument();
    });
  });
});