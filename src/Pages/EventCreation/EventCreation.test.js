import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventCreation from './EventCreation';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

// Mock the necessary modules and functions
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: { editingEvent: null, isEditing: false }
  })
}));

jest.mock('firebase/storage', () => ({
  getDownloadURL: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn()
}));

jest.mock('../../Pages/Login/config', () => ({
  storage: {}
}));

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ value: 'mocked-api-key' })
  })
);

describe('EventCreation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(() => JSON.stringify({ displayName: 'Test User', uid: '123' })),
        setItem: jest.fn(),
      },
      writable: true
    });
  });

  test('renders EventCreation component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <EventCreation />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Upload Cover Image')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Event Name')).toBeInTheDocument();
  });

  test('handles event name input', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <EventCreation />
        </BrowserRouter>
      );
    });

    const eventNameInput = screen.getByPlaceholderText('Event Name');
    fireEvent.change(eventNameInput, { target: { value: 'Test Event' } });
    expect(eventNameInput.value).toBe('Test Event');
  });

  test('handles description input', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <EventCreation />
        </BrowserRouter>
      );
    });

    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    expect(descriptionInput.value).toBe('Test Description');
  });

  test('opens tag popup when "Add tag" is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <EventCreation />
        </BrowserRouter>
      );
    });

    const addTagButton = screen.getByText('Add tag');
    fireEvent.click(addTagButton);
    expect(screen.getByText('Select Tags')).toBeInTheDocument();
  });

  test('handles ticket price input', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <EventCreation />
        </BrowserRouter>
      );
    });

    const ticketPriceInput = screen.getByLabelText('Ticket Price R');
    fireEvent.change(ticketPriceInput, { target: { value: '50' } });
    expect(ticketPriceInput.value).toBe('50');
  });

  test('opens location popup when "Available Venues" is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <EventCreation />
        </BrowserRouter>
      );
    });

    const availableVenuesButton = screen.getByText('Available Venues');
    fireEvent.click(availableVenuesButton);
    expect(screen.getByText('Wits Venues')).toBeInTheDocument();
  });

  // Add more tests as needed for other functionalities
});
