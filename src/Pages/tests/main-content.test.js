// src/Pages/tests/main-content.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainContent from '../dashboard/main-content'; // Adjust the import path as necessary
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate from react-router-dom
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock sessionStorage
const mockUser = {
  displayName: 'John Doe',
  photoURL: 'http://example.com/johndoe.jpg',
};

const mockUid = 'user123';

// Mock events data
const mockEvents = [
  {
    id: 'event1',
    title: 'Music Festival',
    organizerImg: '',
    organizerName: 'Alice',
    imageUrl: 'http://example.com/event1.jpg',
    tags: ['Music'],
    likes: 10,
    comments: [
      {
        text: 'Great event!',
        timestamp: '2023-09-28T10:00:00Z',
        userName: 'Bob',
        userProfilePic: 'http://example.com/bob.jpg',
      },
    ],
  },
  // Add more mock events as needed
];

// Mock liked events data
const mockLikedEvents = ['event1'];

beforeEach(() => {
  // Mock sessionStorage
  const mockGetItem = jest.fn((key) => {
    if (key === 'user') {
      return JSON.stringify(mockUser);
    }
    if (key === 'uid') {
      return mockUid;
    }
    return null;
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: mockGetItem,
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });

  // Mock fetch
  global.fetch = jest.fn();

  // Clear any previous mocks
  mockedUsedNavigate.mockClear();
});

afterEach(() => {
  jest.resetAllMocks();
});

const renderComponent = () =>
  render(
    <BrowserRouter>
      <MainContent />
    </BrowserRouter>
  );

describe('MainContent Component', () => {
  test('renders without crashing and displays event groups', async () => {
    // Mock fetch for events
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      })
      // Mock fetch for liked events
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likedEvents: mockLikedEvents }),
      });

    renderComponent();

    // Wait for events to be fetched and rendered
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // Check if the event group "Music & Dance" is rendered
    expect(screen.getByText('Music & Dance')).toBeInTheDocument();

    // Check if the event title is rendered
    expect(screen.getByText('Music Festival')).toBeInTheDocument();
  });

  test('allows liking and unliking an event', async () => {
    // Mock fetch for events
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      })
      // Mock fetch for liked events
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likedEvents: mockLikedEvents }),
      })
      // Mock fetch for like/unlike actions
      .mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

    renderComponent();

    // Wait for initial fetch calls
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // Find the like button by aria-label
    const likeButton = screen.getByLabelText('like-button-event1');
    expect(likeButton).toBeInTheDocument();

    // Initially, the like button should have 'active' class
    expect(likeButton).toHaveClass('active');

    // Click to unlike
    fireEvent.click(likeButton);

    // Like button should not have 'active' class
    expect(likeButton).not.toHaveClass('active');

    // Ensure the unlike API was called
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/unlike'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: mockUid, eventId: 'event1' }),
        })
      )
    );

    // Click to like again
    fireEvent.click(likeButton);

    // Like button should have 'active' class again
    expect(likeButton).toHaveClass('active');

    // Ensure the like API was called
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/like'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: mockUid, eventId: 'event1' }),
        })
      )
    );
  });

  test('opens and closes comments overlay', async () => {
    // Mock fetch for events
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      })
      // Mock fetch for liked events
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likedEvents: mockLikedEvents }),
      });

    renderComponent();

    // Wait for initial fetch calls
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // Find the comments image by alt text
    const commentsImages = screen.getAllByAltText('Comments');
    expect(commentsImages.length).toBeGreaterThan(0);
    const commentsImage = commentsImages[0];

    // Click on comments image to open overlay
    fireEvent.click(commentsImage);

    // Overlay should be visible
    expect(screen.getByText('Comments')).toBeInTheDocument();

    // Close the overlay by clicking the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Overlay should not be visible
    await waitFor(() => {
      expect(screen.queryByText('Comments')).not.toBeInTheDocument();
    });
  });

  test('displays comments in the overlay', async () => {
    // Mock fetch for events
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      })
      // Mock fetch for liked events
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likedEvents: mockLikedEvents }),
      });

    renderComponent();

    // Wait for initial fetch calls
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // Find the comments image by alt text
    const commentsImages = screen.getAllByAltText('Comments');
    expect(commentsImages.length).toBeGreaterThan(0);
    const commentsImage = commentsImages[0];

    // Click on comments image to open overlay
    fireEvent.click(commentsImage);

    // Check if comment is displayed
    expect(screen.getByText('Great event!')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText(/ago$/)).toBeInTheDocument(); // Matches timeAgo format

    // Close the overlay
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
  });

  test('submits a new comment', async () => {
    // Mock fetch for events
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      })
      // Mock fetch for liked events
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likedEvents: mockLikedEvents }),
      })
      // Mock fetch for fetching event details
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents[0],
      })
      // Mock fetch for updating comments
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    renderComponent();

    // Wait for initial fetch calls
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // Find the comments image by alt text
    const commentsImages = screen.getAllByAltText('Comments');
    expect(commentsImages.length).toBeGreaterThan(0);
    const commentsImage = commentsImages[0];

    // Click on comments image to open overlay
    fireEvent.click(commentsImage);

    // Enter a new comment in the textarea
    const commentInput = screen.getByPlaceholderText('Write a comment...');
    fireEvent.change(commentInput, { target: { value: 'New test comment' } });

    // Click the submit button
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Wait for the fetch calls: one for fetching event details, one for updating comments
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(4));

    // The new comment should appear in the comments list
    expect(screen.getByText('New test comment')).toBeInTheDocument();

    // Ensure that the comment input is cleared
    expect(commentInput.value).toBe('');
  });

  test('shows feedback box after scrolling', async () => {
    // Mock fetch for events
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      })
      // Mock fetch for liked events
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likedEvents: mockLikedEvents }),
      });

    renderComponent();

    // Wait for initial fetch calls
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // Initially, feedback box should not be visible
    expect(screen.queryByText('Send us your feedback!')).not.toBeInTheDocument();

    // Mock window scrollY and scrollHeight to simulate scrolling
    Object.defineProperty(window, 'scrollY', { value: 1600, writable: true });
    Object.defineProperty(document.body, 'scrollHeight', { value: 3000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

    // Trigger scroll event
    fireEvent.scroll(window);

    // Now, feedback box should appear
    await waitFor(() =>
      expect(screen.getByText('Send us your feedback!')).toBeInTheDocument()
    );
  });

  test('navigates to view more details on button click', async () => {
    // Mock fetch for events
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      })
      // Mock fetch for liked events
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likedEvents: mockLikedEvents }),
      });

    renderComponent();

    // Wait for initial fetch calls
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // Find the "View more details" button by aria-label
    const viewMoreButton = screen.getByLabelText('view-more-details-button');
    expect(viewMoreButton).toBeInTheDocument();

    // Click the "View more details" button
    fireEvent.click(viewMoreButton);

    // Expect navigation to be called with the correct path
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/view-more-details/event1');
  });

  test('opens mailto link when feedback is clicked', async () => {
    // Mock fetch for events
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      })
      // Mock fetch for liked events
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likedEvents: mockLikedEvents }),
      });

    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };

    renderComponent();

    // Wait for initial fetch calls
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
 
    // Mock scrolling to trigger feedback box
    Object.defineProperty(window, 'scrollY', { value: 1600, writable: true });
    Object.defineProperty(document.body, 'scrollHeight', { value: 3000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

    // Trigger scroll event
    fireEvent.scroll(window);

    // Wait for feedback box to appear
    await waitFor(() =>
      expect(screen.getByText('Send us your feedback!')).toBeInTheDocument()
    );

    // Click the feedback box
    const feedbackBox = screen.getByText('Send us your feedback!');
    fireEvent.click(feedbackBox);

    // Check if mailto link was set correctly
    expect(window.location.href).toBe('mailto:livelycampus@gmail.com?subject=Feedback');
  });
});
