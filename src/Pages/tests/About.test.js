import React from 'react';
import { render, screen, fireEvent, waitFor,act } from '@testing-library/react';
import LandingPage from '../LandingPage/LandingPage'; // Adjust the import path as necessary

// Mock necessary components
jest.mock('../dashboard/footer', () => () => <div>Footer Mock</div>);
jest.mock('../Login/login', () => () => <div>Login Mock</div>);

// Mock fetch for events
beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => {
          const data = [
            { title: 'Event 1', description: 'Description for Event 1', imageUrl: 'event1.jpg', date: '2025-01-01' },
            { title: 'Event 2', description: 'Description for Event 2', imageUrl: 'event2.jpg', date: '2025-01-02' },
            { title: 'Past Event', description: 'Description for Past Event', imageUrl: 'pastevent.jpg', date: '2023-01-01' },
          ];
          console.log('Fetched Events:', data); 
          return Promise.resolve(data);
        }
      })
    );
  });
  

describe('LandingPage Component', () => {
  beforeEach(() => {
    act(() => {
      render(<LandingPage />);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Landing Page without crashing', () => {
    expect(screen.getByText(/Ignite Your Campus/i)).toBeInTheDocument();
    expect(screen.getByText(/Experience!/i)).toBeInTheDocument();
  });
  

  test('displays Footer component', () => {
    expect(screen.getByText(/Footer Mock/i)).toBeInTheDocument();
  });

  test('toggles the Login Modal when Login button is clicked', async () => {
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(screen.getByText(/Login Mock/i)).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByLabelText(/landing-close-button/i));
    expect(screen.queryByText(/Login Mock/i)).not.toBeInTheDocument();
  });
});
