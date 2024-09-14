import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventDetails from './EventDetails';
import '@testing-library/jest-dom/extend-expect';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: '123',
  }),
}));

describe('EventDetails Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <EventDetails />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays event details', async () => {
    const mockEvent = {
      id: '123',
      title: 'Test Event',
      description: 'Test Description',
      location: 'Test Location',
      date: '2023-07-01T12:00:00Z',
      capacity: 100,
      availableTickets: 50,
      ticketPrice: 20,
      tags: ['tag1', 'tag2'],
      imageUrl: 'http://test-image.jpg',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEvent),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ value: 'mock-api-key' }),
    });

    render(
      <MemoryRouter>
        <EventDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/Test Location/)).toBeInTheDocument();
    expect(screen.getByText(/Capacity: 100/)).toBeInTheDocument();
    expect(screen.getByText(/Available Tickets: 50/)).toBeInTheDocument();
    expect(screen.getByText(/Ticket Price: R 20/)).toBeInTheDocument();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();  });

  test('handles error when fetching event details', async () => {
    console.error = jest.fn();
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <MemoryRouter>
        <EventDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching event details:', expect.any(Error));
    });
  });

  test('handles error when fetching Google Maps API key', async () => {
    console.error = jest.fn();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    }).mockRejectedValueOnce(new Error('Failed to fetch API key'));

    render(
      <MemoryRouter>
        <EventDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching Google Maps API key:', expect.any(Error));
    });
  });
});
describe('EventDetails Component - Error Handling', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    console.error = jest.fn();
  });

  test('handles non-ok response when fetching event details', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    render(
      <MemoryRouter>
        <EventDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching event details:', expect.any(Error));
    });
    await waitFor(() => {
      expect(screen.getByText('Error: Unable to fetch event details')).toBeInTheDocument();
    });
    
  });

  test('handles network error when fetching event details', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <EventDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error fetching Google Maps API key:", expect.any(Error));
    });
    await waitFor(() => {
    expect(screen.getByText("Error fetching Google Maps API key:")).toBeInTheDocument();
    });
  });

  test('handles non-ok response when fetching Google Maps API key', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    }).mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    });

    render(
      <MemoryRouter>
        <EventDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching Google Maps API key:', expect.any(Error));
    });
  });

  test('handles empty response when fetching event details', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(null),
    });

    render(
      <MemoryRouter>
        <EventDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching event details:', expect.any(Error));
    });
    await waitFor(() => {
    expect(screen.getByText('Error: Unable to fetch event details')).toBeInTheDocument();
    });
  });
});
