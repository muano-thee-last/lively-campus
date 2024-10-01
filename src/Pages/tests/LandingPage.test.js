import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from '../LandingPage/LandingPage';
import Login from '../Login/login';

// Mock necessary components and modules
jest.mock('../dashboard/footer', () => () => <div>Mocked Footer</div>);
jest.mock('../Login/login', () => () => <div>Mocked Login</div>);

// Mock fetch for events
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => {
        const data = [
          { title: 'Upcoming Event 1', description: 'Description for Upcoming Event 1', imageUrl: 'event1.jpg', date: '2025-01-01' },
          { title: 'Upcoming Event 2', description: 'Description for Upcoming Event 2', imageUrl: 'event2.jpg', date: '2025-01-02' },
          { title: 'Previous Event 1', description: 'Description for Previous Event 1', imageUrl: 'pastevent.jpg', date: '2023-01-01' },
        ];
        return Promise.resolve(data);
      }
    })
  );
});

describe('LandingPage Component', () => {
  beforeEach(() => {
    render(<LandingPage />);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Landing Page without crashing', () => {
    expect(screen.getByText(/Ignite Your Campus/i)).toBeInTheDocument();
    expect(screen.getByText(/Experience!/i)).toBeInTheDocument();
  });
  
  test('renders loading state initially', () => {
    expect(screen.getByText(/Loading events.../i)).toBeInTheDocument();
  });

  test('renders header, hero section, and footer correctly', async () => {
    await waitFor(() => expect(screen.queryByText(/Loading events.../i)).not.toBeInTheDocument());

    expect(screen.getByText('LivelyCampus')).toBeInTheDocument();
    expect(screen.getByText('Ignite Your Campus')).toBeInTheDocument();
    expect(screen.getByText('Mocked Footer')).toBeInTheDocument();
  });

  test('displays an error message if events cannot be fetched', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API error')));

    render(<LandingPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading events.../i)).not.toBeInTheDocument();
    });

    const errorMessages = await screen.findAllByText('Error fetching events, please try again later.');
    expect(errorMessages.length).toBeGreaterThan(0); // Ensure at least one error message is displayed
  });

  test('shows login modal when login button is clicked', async () => {
    await waitFor(() => expect(screen.queryByText(/Loading events.../i)).not.toBeInTheDocument());

    const loginButton = screen.getByLabelText(/Login/i);
    fireEvent.click(loginButton);

    expect(screen.getByLabelText(/landing-close-button/i)).toBeInTheDocument();
  });

  test('closes login modal when close button is clicked', async () => {
    await waitFor(() => expect(screen.queryByText(/Loading events.../i)).not.toBeInTheDocument());
    const loginButton = screen.getByLabelText(/Login/i);
    fireEvent.click(loginButton);

    const closeButton = screen.getByLabelText(/landing-close-button/i);
    fireEvent.click(closeButton);

    expect(screen.queryByLabelText(/landing-close-button/i)).not.toBeInTheDocument();
  });

  // test('displays upcoming and previous events after successful fetch', async () => {
  //   await waitFor(() => {
  //     expect(screen.queryByText(/Loading events.../i)).not.toBeInTheDocument();
  //   });

  //   const upcomingHeader = screen.getByText((content) => content.includes("Upcoming") && content.includes("Events"));
  //   const previousHeader = screen.getByText((content) => content.includes("Previous") && content.includes("Events"));

  //   expect(upcomingHeader).toBeInTheDocument();
  //   expect(previousHeader).toBeInTheDocument();

  //   expect(screen.getByText(/Upcoming Event 1/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Upcoming Event 2/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Previous Event 1/i)).toBeInTheDocument();
  // });

  // test('automatically filters events into upcoming and previous categories', async () => {
  //   await waitFor(() => {
  //     expect(screen.queryByText(/Loading events.../i)).not.toBeInTheDocument();
  //   });

  //   expect(screen.getByText(/Upcoming Event 1/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Upcoming Event 2/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Previous Event 1/i)).toBeInTheDocument();
  //   expect(screen.queryByText(/Past Event/i)).not.toBeInTheDocument();
  // });

  // test('handles dot click for upcoming events', async () => {
  //   await waitFor(() => {
  //     expect(screen.queryByText(/Loading events.../i)).not.toBeInTheDocument();
  //   });

  //   const firstDot = screen.getByLabelText(/Slide 1/i);
  //   fireEvent.click(firstDot);

  //   expect(screen.getByText(/Upcoming Event 1/i)).toBeInTheDocument();
  // });

  // test('handles dot click for previous events', async () => {
  //   await waitFor(() => {
  //     expect(screen.queryByText(/Loading events.../i)).not.toBeInTheDocument();
  //   });

  //   const secondDot = screen.getByLabelText(/Slide 1/i);
  //   fireEvent.click(secondDot);

  //   expect(screen.getByText(/Previous Event 1/i)).toBeInTheDocument();
  // });

  test('toggles menu when burger button is clicked', async () => {
    await waitFor(() => expect(screen.queryByText(/Loading events.../i)).not.toBeInTheDocument());

    const navMenu = screen.getByRole('navigation');
    expect(navMenu).not.toHaveClass('open');

    const burgerButton = screen.getByLabelText('burger');
    fireEvent.click(burgerButton);

    expect(navMenu).toHaveClass('open');

    fireEvent.click(burgerButton);
    expect(navMenu).not.toHaveClass('open');
  });
});
