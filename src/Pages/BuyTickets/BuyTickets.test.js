import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BuyTickets from './BuyTickets';
import * as firebase from 'firebase/auth'; // Adjust according to your Firebase setup
import * as db from 'firebase/database';

// Mocking the Firebase authentication and database
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { email: 'testuser@example.com' },
  })),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback({ email: 'testuser@example.com' });
  }),
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  update: jest.fn(() => Promise.resolve()),
}));

// Mock the fetch function for network requests
global.fetch = jest.fn((url) => {
  if (url.includes('uniqueCode')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ uniqueString: 'ticket123' }),
    });
  } else if (url.includes('getPaymentUrl')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ redirectUrl: 'http://payment-url.com' }),
    });
  } else if (url.includes('send-confirmation-email')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Email sent successfully!' }),
    });
  }
  return Promise.reject(new Error('Unknown URL'));
});

describe('BuyTickets Component', () => {
  const mockEvent = {
    id: 'event1',
    title: 'Test Event',
    availableTickets: 10,
    ticketPrice: 100,
  };


  test('updates ticket count and total price', () => {
    render(<BuyTickets event={mockEvent} onClose={() => {}} />);

    const ticketCountInput = screen.getByLabelText(/Number of Tickets:/i);
    fireEvent.change(ticketCountInput, { target: { value: 5 } });
    
    expect(ticketCountInput.value).toBe('5');
    expect(screen.getByText(/Total: R500/i)).toBeInTheDocument();
  });



  test('disables confirm button if no payment method is selected', () => {
    render(<BuyTickets event={mockEvent} onClose={() => {}} />);

    const paymentButton = screen.getByText(/Confirm Purchase/i);
    expect(paymentButton).toBeDisabled();
  });


});
