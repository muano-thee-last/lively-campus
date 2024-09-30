import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

// Mock the components that are causing issues
jest.mock('./Pages/LandingPage/LandingPage', () => () => <div>Landing Page Content</div>);
jest.mock('./Pages/TicketHistory/ticketHistory', () => () => <div>Ticket History</div>);

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('App Component', () => {
  
  test('renders LandingPage component at root path', () => {
    render(<App />);

    // Check if the LandingPage component is rendered
    expect(screen.getByText(/Landing Page Content/i)).toBeInTheDocument();
  });

  // You can add more tests here for different routes
});
