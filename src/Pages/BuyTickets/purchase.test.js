import React from 'react';
import { render, waitFor } from '@testing-library/react';
import BuyTicket from './purchase';
// Mock the fetch function
global.fetch = jest.fn();

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Mock console.error and console.log
console.error = jest.fn();
console.log = jest.fn();

describe('BuyTicket Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete window.location;
    window.location = { href: jest.fn() };
  });

  it('fetches redirect link and redirects when event is provided', async () => {
    const mockEvent = {
      id: '123',
      ticketPrice: 1000,
    };

    const mockUser = {
      uid: 'user123',
    };

    mockSessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ redirectUrl: 'https://example.com/payment' }),
    });

    render(<BuyTicket event={mockEvent} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://us-central1-witslivelycampus.cloudfunctions.net/app/getPaymentUrl',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 1000,
            externalId: JSON.stringify({
              id: '123',
              uid: 'user123',
            }),
          }),
        })
      );

      expect(window.location.href).toBe('https://example.com/payment');
    });
  });

  it('handles error when fetching redirect link fails', async () => {
    const mockEvent = {
      id: '123',
      ticketPrice: 1000,
    };

    mockSessionStorage.getItem.mockReturnValue(JSON.stringify({ uid: 'user123' }));

    global.fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<BuyTicket event={mockEvent} />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching payment URL:', 'API Error', expect.any(Error));
      expect(window.location.href).not.toBe('https://example.com/payment');
    });
  });

  it('does not fetch redirect link when event is not provided', async () => {
    render(<BuyTicket />);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
      expect(window.location.href).not.toBe('https://example.com/payment');
    });
  });

  it('does not fetch redirect link when event has no ticketPrice', async () => {
    const mockEvent = {
      id: '123',
    };

    render(<BuyTicket event={mockEvent} />);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
      expect(window.location.href).not.toBe('https://example.com/payment');
    });
  });
});