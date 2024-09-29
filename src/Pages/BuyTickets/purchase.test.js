import { render, waitFor } from '@testing-library/react';
import BuyTicket from './purchase';

// Mocking the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ redirectUrl: 'https://example.com/payment' }),
  })
);

describe('BuyTicket Component', () => {

  it('does not fetch if no event is provided', async () => {
    render(<BuyTicket event={null} />);

    // Ensure fetch is not called when no event is passed
    expect(fetch).not.toHaveBeenCalled();
  });

  it('handles fetch error gracefully', async () => {
    // Mock fetch to return an error
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const event = {
      ticketPrice: 100,
    };

    render(<BuyTicket event={event} />);

    // Increase the timeout for error handling to 5000ms (5 seconds)
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error fetching payment URL:', 'HTTP error! Status: 500', expect.anything()), { timeout: 5000 });

    consoleSpy.mockRestore();
  });
});
