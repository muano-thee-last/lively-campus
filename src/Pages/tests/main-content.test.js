import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MainContent from '../dashboard/main-content';

// Define mock events data
const mockEvents = [
  { title: "Event 1", organizer: "Organizer 1", likes: 10 },
  { title: "Event 2", organizer: "Organizer 2", likes: 20 },
];

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockEvents),
    })
  );
});

afterEach(() => {
  global.fetch.mockClear();
});

test('fetches and displays events on component mount', async () => {
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

  const { MemoryRouter } = require('react-router-dom');

  render(
    <MemoryRouter>
      <MainContent />
    </MemoryRouter>
  );

  // Verify fetch is called with correct URL
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('https://us-central1-witslivelycampus.cloudfunctions.net/app/events');
  });
  expect(global.fetch).toHaveBeenCalledTimes(1);

  // Verify the number of event cards rendered
  const eventCards = await screen.findAllByRole('heading', { name: /Event \d/ });
  expect(eventCards).toHaveLength(mockEvents.length);

  // Verify the correct event titles are displayed
  mockEvents.forEach(event => {
    expect(screen.getByText(event.title)).toBeInTheDocument();
  });
});
