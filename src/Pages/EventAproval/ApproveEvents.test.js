import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ApproveEvents from './ApproveEvents';
import { useNavigate } from 'react-router-dom';

// Mock the fetch function
global.fetch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockEvents = [
  { id: 1, title: 'Event 1', organizerName: 'Organizer 1', imageUrl: 'image1.jpg', isApproved: true, createdAt: '2023-04-01T00:00:00Z', organizerImg: 'organizer1.jpg' },
  { id: 2, title: 'Event 2', organizerName: 'Organizer 2', imageUrl: 'image2.jpg', isApproved: false, createdAt: '2023-04-02T00:00:00Z', organizerImg: 'organizer2.jpg' },
  { id: 3, title: 'Event 3', organizerName: 'Organizer 3', imageUrl: 'image3.jpg', isApproved: null, createdAt: '2023-04-03T00:00:00Z', organizerImg: 'organizer3.jpg' },
];

describe('ApproveEvents', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents),
    });
  });

  test('renders events and filters correctly', async () => {
    render(
      <MemoryRouter>
        <ApproveEvents />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Event \d/).length).toBe(3);
    });

    // Check if all events are rendered initially
    expect(screen.getAllByText(/Event \d/).length).toBe(3);

    // Test filtering
    fireEvent.click(screen.getByLabelText('Approved'));
    expect(screen.getAllByText(/Event \d/).length).toBe(1);

    fireEvent.click(screen.getByLabelText('Rejected'));
    expect(screen.getAllByText(/Event \d/).length).toBe(1);

    fireEvent.click(screen.getByLabelText('Pending'));
    expect(screen.getAllByText(/Event \d/).length).toBe(1);

    fireEvent.click(screen.getByLabelText('All'));
    expect(screen.getAllByText(/Event \d/).length).toBe(3);
  });

  test('displays correct approval status for each event', async () => {
    render(
      <MemoryRouter>
        <ApproveEvents />
      </MemoryRouter>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Wait for the events to be rendered
    await waitFor(() => {
      expect(screen.getAllByText(/Event \d/).length).toBe(3);
    });

    expect(screen.getByText('Approved', { selector: '.status' })).toBeInTheDocument();
    expect(screen.getByText('Rejected', { selector: '.status' })).toBeInTheDocument();
    expect(screen.getByText('Pending', { selector: '.status' })).toBeInTheDocument();
  });

  test('navigates to view more details when button is clicked', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockImplementation(() => mockNavigate);

    render(
      <MemoryRouter>
        <ApproveEvents />
      </MemoryRouter>
    );

    // Wait for the events to be rendered
    await waitFor(() => {
      expect(screen.getAllByText(/Event \d/).length).toBe(3);
    });

    const viewMoreButtons = screen.getAllByText('View more details');
    expect(viewMoreButtons.length).toBeGreaterThan(0);
    fireEvent.click(viewMoreButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/view-more-details/1', { state: { approveEvent: true } });
  });

  test('displays "No events found" when there are no events', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(
      <MemoryRouter>
        <ApproveEvents />
      </MemoryRouter>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByText('No events found.')).toBeInTheDocument();
  });
});
