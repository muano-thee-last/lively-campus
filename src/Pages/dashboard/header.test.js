import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import Header from './header';

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/dashboard' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe('Header', () => {
  const mockToggleSidebar = jest.fn();
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.setItem('user', JSON.stringify({ uid: '123', photoURL: 'https://example.com/photo.jpg' }));
  });

  it('renders search bar and handles search input', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Header toggleSidebar={mockToggleSidebar} onSearch={mockOnSearch} />
        </BrowserRouter>
      );
    });

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  it('disables search input when not on dashboard', async () => {
    mockLocation.pathname = '/other';
    
    await act(async () => {
      render(
        <BrowserRouter>
          <Header toggleSidebar={mockToggleSidebar} onSearch={mockOnSearch} />
        </BrowserRouter>
      );
    });

    const searchInput = screen.getByPlaceholderText('Search');
    expect(searchInput).toBeDisabled();
  });

  it('fetches and displays notification count', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: '1', eventId: '123' }]),
      })
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <Header toggleSidebar={mockToggleSidebar} onSearch={mockOnSearch} />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('handles notification click', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Header toggleSidebar={mockToggleSidebar} onSearch={mockOnSearch} />
        </BrowserRouter>
      );
    });

    fireEvent.click(screen.getByTestId('NotificationsIcon'));
    expect(mockNavigate).toHaveBeenCalledWith('/Notifications');
  });

  it('displays user profile picture when available', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Header toggleSidebar={mockToggleSidebar} onSearch={mockOnSearch} />
        </BrowserRouter>
      );
    });

    const profilePic = screen.getByAltText('Profile');
    expect(profilePic).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('displays default icon when no profile picture is available', async () => {
    sessionStorage.setItem('user', JSON.stringify({ uid: '123' }));

    await act(async () => {
      render(
        <BrowserRouter>
          <Header toggleSidebar={mockToggleSidebar} onSearch={mockOnSearch} />
        </BrowserRouter>
      );
    });

    expect(screen.getByTestId('AccountCircleIcon')).toBeInTheDocument();
  });
});
