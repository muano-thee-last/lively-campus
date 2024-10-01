// Profile.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Profile from '../Profile/Profile';
import { BrowserRouter } from 'react-router-dom';

// Mock react-router-dom's useNavigate
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock sessionStorage
const mockUser = {
  displayName: 'John Doe',
  photoURL: 'http://example.com/profile.jpg',
  email: 'john.doe@example.com',
};

const mockEvents = [
  {
    id: '1', // Ensure IDs are strings to match 'likedEvents'
    title: 'Event One',
    organizerName: 'Organizer One',
    imageUrl: 'http://example.com/event1.jpg',
    likes: 10,
  },
  {
    id: '2',
    title: 'Event Two',
    organizerName: 'Organizer Two',
    imageUrl: 'http://example.com/event2.jpg',
    likes: 5,
  },
];

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  jest.clearAllMocks();

  // Mock sessionStorage
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === 'user') {
      return JSON.stringify(mockUser);
    }
    if (key === 'uid') {
      return 'user123';
    }
    return null;
  });

  // Mock fetch
  global.fetch = jest.fn((url) => {
    if (url === 'https://us-central1-witslivelycampus.cloudfunctions.net/app/events') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      });
    }

    if (url === 'https://us-central1-witslivelycampus.cloudfunctions.net/app/users/user123') {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            likedEvents: ['1'], // IDs as strings
          }),
      });
    }

    if (url === 'https://us-central1-witslivelycampus.cloudfunctions.net/app/unlike') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    }

    return Promise.reject(new Error('Unknown URL'));
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

test('renders Profile component without crashing and displays user info', async () => {
  renderWithRouter(<Profile />);

  // Check if user name is displayed
  expect(await screen.findByText(mockUser.displayName)).toBeInTheDocument();

  // Check if user title is displayed
  expect(screen.getByText('Student')).toBeInTheDocument();

  // Check if user email is displayed
  expect(screen.getByText(mockUser.email)).toBeInTheDocument();

  // Check if profile picture is displayed
  const profilePic = screen.getByAltText('profile-pic');
  expect(profilePic).toBeInTheDocument();
  expect(profilePic).toHaveAttribute('src', mockUser.photoURL);
});

test('fetches and displays liked events', async () => {
  renderWithRouter(<Profile />);

  // Wait for "Liked Events" heading to appear
  expect(await screen.findByText('Liked Events')).toBeInTheDocument();

  // Wait for "Event One" to appear as a heading level 4
  const eventOne = await screen.findByRole('heading', { name: 'Event One', level: 4 });
  expect(eventOne).toBeInTheDocument();

  // Ensure "Event Two" is not in the document
  expect(screen.queryByText('Event Two')).not.toBeInTheDocument();

  // Check organizer name
  expect(screen.getByText('Organizer One')).toBeInTheDocument();

  // Check likes count
  expect(screen.getByText('Likes: 10')).toBeInTheDocument();
});

test('displays "No liked events yet." when there are no liked events', async () => {
  // Modify the fetch mock for user to return no liked events
  fetch.mockImplementationOnce((url) => {
    if (url === 'https://us-central1-witslivelycampus.cloudfunctions.net/app/users/user123') {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            likedEvents: [],
          }),
      });
    }
    // Other URLs remain the same
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockEvents),
    });
  });

  renderWithRouter(<Profile />);

  await waitFor(() => {
    expect(screen.getByText('Liked Events')).toBeInTheDocument();
  });

  expect(screen.getByText('No liked events yet.')).toBeInTheDocument();
});

test('handles unlike event correctly with optimistic UI update', async () => {
  renderWithRouter(<Profile />);

  // Wait for liked events to load
  await waitFor(() => {
    expect(screen.getByText('Event One')).toBeInTheDocument();
  });

  // Find the event card for "Event One"
  const eventCard = screen.getByText('Event One').closest('.dashboard-card');
  expect(eventCard).toBeInTheDocument();

  // Within the event card, find the unlike button by its aria-label
  const unlikeButton = within(eventCard).getByRole('button', { name: /unlike event one/i });
  expect(unlikeButton).toBeInTheDocument();

  // Click the unlike button
  fireEvent.click(unlikeButton);

  // Optimistically, the liked event should be removed
  await waitFor(() => {
    expect(screen.queryByText('Event One')).not.toBeInTheDocument();
  });

  // Ensure the unlike API was called
  expect(fetch).toHaveBeenCalledWith(
    'https://us-central1-witslivelycampus.cloudfunctions.net/app/unlike',
    expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: 'user123', eventId: '1' }),
    })
  );

  // Check for console.log on successful decrement
  // Since console.log is not captured here, we assume success
});


test('navigates to event management on button click', async () => {
  renderWithRouter(<Profile />);

  // Wait for component to render
  await waitFor(() => {
    expect(screen.getByText('Additional Functions')).toBeInTheDocument();
  });

  const manageButton = screen.getByText('Manage your Events');
  fireEvent.click(manageButton);

  expect(mockedUsedNavigate).toHaveBeenCalledWith('/eventManagement');
});

test('renders "Create an Event" button', async () => {
  renderWithRouter(<Profile />);

  // Wait for component to render
  await waitFor(() => {
    expect(screen.getByText('Additional Functions')).toBeInTheDocument();
  });

  const createButton = screen.getByText('Create an Event');
  expect(createButton).toBeInTheDocument();
});


