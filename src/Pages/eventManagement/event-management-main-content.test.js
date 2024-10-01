import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import EventManagementMainContent from './event-management-main-content';
import * as firebaseAuth from 'firebase/auth';

// Mock the firebase auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the useImageUpload hook
jest.mock('./useImageUpload', () => ({
  __esModule: true,
  default: () => ({
    imagePreview: null,
    uploading: false,
    uploadImage: jest.fn(),
    fileInputRef: { current: null },
    handleFileChange: jest.fn(),
    handleDivClick: jest.fn(),
    setImagePreview: jest.fn(),
  }),
}));

describe('EventManagementMainContent', () => {
  beforeEach(() => {
    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: '1', title: 'Test Event', organizerName: 'Test User', imageUrl: 'test.jpg', availableTickets: 100 },
        ]),
      })
    );

    // Mock the auth state
    firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ displayName: 'Test User' });
      return jest.fn();
    });
  });

  it('renders without crashing', async () => {
    render(
      <BrowserRouter>
        <EventManagementMainContent />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('EVENT MANAGEMENT')).toBeInTheDocument();
    });
  });

  it('displays events when fetched successfully', async () => {
    render(
      <BrowserRouter>
        <EventManagementMainContent />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
  });

  it('handles delete event', async () => {
    render(
      <BrowserRouter>
        <EventManagementMainContent />
      </BrowserRouter>
    );

    await waitFor(() => {
      const deleteButton = screen.getByTitle('Delete');
      fireEvent.click(deleteButton);
    });

    // Add assertions for delete functionality
  });

  it('handles edit event', async () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

    render(
      <BrowserRouter>
        <EventManagementMainContent />
      </BrowserRouter>
    );

    await waitFor(() => {
      const editButton = screen.getByTitle('Edit');
      fireEvent.click(editButton);
    });

    expect(navigateMock).toHaveBeenCalledWith('/post-event/', expect.any(Object));
  });

  // Add more tests for other functionalities like image upload, search, etc.
});
