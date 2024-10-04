import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from './LandingPage';
import fetchMock from 'jest-fetch-mock';

jest.mock('../Login/login', () => () => <div>Login Component</div>);
jest.mock('../dashboard/footer', () => () => <div>Footer Component</div>);

describe('LandingPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders the LandingPage with the header and hero section', () => {
    render(<LandingPage />);
    
    expect(screen.getByText('Ignite Your Campus')).toBeInTheDocument();
    expect(screen.getByText('Experience!')).toBeInTheDocument();
    expect(screen.getByAltText('LivelyCampus Logo')).toBeInTheDocument();
  });

  test('shows error message when fetching events fails', async () => {
    fetchMock.mockReject(() => Promise.reject('API is down'));

    render(<LandingPage />);

    await waitFor(() => expect(screen.getByText('Error fetching events, please try again later.')).toBeInTheDocument());
  });

  test('shows login modal when login button is clicked', () => {
    render(<LandingPage />);

    const loginButton = screen.getByLabelText('Login');
    fireEvent.click(loginButton);

    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });



  test('toggles the mobile menu when burger icon is clicked', () => {
    render(<LandingPage />);

    const burgerMenu = screen.getByLabelText('burger');
    fireEvent.click(burgerMenu);

    const navMenu = screen.getByRole('navigation');
    expect(navMenu).toHaveClass('open');
  });
});
