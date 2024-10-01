import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';  // Import MemoryRouter for testing routing
import EventHistory from '../EventHistory/EventHistory';
import '@testing-library/jest-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
  
// Mock the Firebase auth functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

describe('EventHistory Component', () => {
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('renders EventHistory without crashing', () => {
    render(
      <MemoryRouter>
        <EventHistory />
      </MemoryRouter>
    );
    expect(screen.getByText(/No events found/i)).toBeInTheDocument();
  });

  test('fetches and displays events', async () => {
    // Mock fetch and auth
    const mockFetchResponse = [
      { eventId: 1, title: "Event 1", organizerName: "JohnDoe", date: "2024-01-01", description: "An event", imageUrl: "image-url" }
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFetchResponse),
      })
    );
    
    const mockOnAuthStateChanged = onAuthStateChanged.mockImplementation((auth, cb) => cb({ displayName: "JohnDoe" }));
    
    render(
      <MemoryRouter>
        <EventHistory />
      </MemoryRouter>
    );
    
    expect(await screen.findByText(/Event 1/i)).toBeInTheDocument();
  });

  test('displays error when fetch fails', async () => {
    // Mock fetch to throw an error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    const mockOnAuthStateChanged = onAuthStateChanged.mockImplementation((auth, cb) => cb({ displayName: "JohnDoe" }));

    render(
      <MemoryRouter>
        <EventHistory />
      </MemoryRouter>
    );
    
    expect(await screen.findByText(/Error: Failed to fetch/i)).toBeInTheDocument();
  });

  test('displays "No events found" when no events for the user', async () => {
    // Mock fetch and auth
    const mockFetchResponse = [
      { eventId: 1, title: "Event 1", organizerName: "OtherOrganizer", date: "2024-01-01", description: "An event", imageUrl: "image-url" }
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFetchResponse),
      })
    );
    
    const mockOnAuthStateChanged = onAuthStateChanged.mockImplementation((auth, cb) => cb({ displayName: "JohnDoe" }));

    render(
      <MemoryRouter>
        <EventHistory />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No events found/i)).toBeInTheDocument();
    });
  });

//   test('toggles sidebar visibility when button is clicked', () => {
//     render(
//       <MemoryRouter>
//         <EventHistory />
//       </MemoryRouter>
//     );
    
//     const toggleButton = screen.getByText(/toggleSidebar/); // Assuming you have a button with this text
//     fireEvent.click(toggleButton);
    
//     expect(screen.getByTestId('sidebar')).toHaveClass('open');
    
//     fireEvent.click(toggleButton);

//     expect(screen.getByTestId('sidebar')).not.toHaveClass('open');
//   });
});
