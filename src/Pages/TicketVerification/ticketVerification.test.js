import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TicketVerification from './TicketVerification';

describe('TicketVerification Component', () => {
  test('displays error message when ticket verification fails', async () => {
    // Mock fetch to simulate an API failure
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Unable to fetch ticket'))
    );

    render(<TicketVerification />);

    const input = screen.getByPlaceholderText('Enter ticket code');
    const button = screen.getByText('Verify');

    // Enter a ticket number and click verify
    fireEvent.change(input, { target: { value: 'INVALID_CODE' } });
    fireEvent.click(button);

    // Expect to see the loading state first
    expect(button).toHaveTextContent('Verifying...');

    // Wait for the error message to appear
    await waitFor(() => {
      const errorMessage = screen.getByText('Unable to verify ticket. Please try again.');
      expect(errorMessage).toBeInTheDocument();
      expect(button).toHaveTextContent('Verify');
    });
  });

  test('displays ticket information when verification succeeds', async () => {
    // Mock fetch to simulate a successful API response
    const mockTicketData = {
      price: 100,
      purchaseDate: '2023-09-28',
      ticketCode: 'VALID_CODE',
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTicketData),
      })
    );

    render(<TicketVerification />);

    const input = screen.getByPlaceholderText('Enter ticket code');
    const button = screen.getByText('Verify');

    // Enter a valid ticket number and click verify
    fireEvent.change(input, { target: { value: 'VALID_CODE' } });
    fireEvent.click(button);

    // Expect to see the loading state first
    expect(button).toHaveTextContent('Verifying...');

    // Wait for the ticket information to appear
    await waitFor(() => {
      const priceElement = screen.getByText('R100');
      const purchaseDateElement = screen.getByText('2023-09-28');
      const ticketCodeElement = screen.getByText('VALID_CODE');

      expect(priceElement).toBeInTheDocument();
      expect(purchaseDateElement).toBeInTheDocument();
      expect(ticketCodeElement).toBeInTheDocument();
      expect(button).toHaveTextContent('Verify');
    });
  });
});
