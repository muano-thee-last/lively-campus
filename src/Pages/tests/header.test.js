// src/Pages/tests/header.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';


// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Import Header **after** setting up mocks
import Header from '../dashboard/header'; // Adjust the import path as needed

// Define a default user for tests
const defaultUser = {
  uid: '123',
  photoURL: 'https://example.com/profile.jpg',
};

describe('Header Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test

    window.sessionStorage.clear();
    mockedNavigate.mockReset();

    // Set a default user in sessionStorage for all tests
    window.sessionStorage.setItem('user', JSON.stringify(defaultUser));
  });

  test('renders all elements correctly', async () => {
    // Mock fetch responses for notifications and viewed notifications
    const notifications = [];
    const viewedNotifications = [];

    render(
      <BrowserRouter>
        <Header toggleSidebar={jest.fn()} />
      </BrowserRouter>
    );

    // Check for hamburger menu
    const hamburger = screen.getByAltText(/Menu/i);
    expect(hamburger).toBeInTheDocument();

    // Check for logo
    const logo = screen.getByAltText(/Livelycampus Logo/i);
    expect(logo).toBeInTheDocument();

    // Check for Livelycampus text
    const logoText = screen.getByText(/Livelycampus/i);
    expect(logoText).toBeInTheDocument();

    // Check for search input
    const searchInput = screen.getByPlaceholderText(/Search/i);
    expect(searchInput).toBeInTheDocument();

    // Check for notifications icon
    const notificationsIcon = screen.getByAltText(/Notifications/i);
    expect(notificationsIcon).toBeInTheDocument();

    // Check for profile image
    const profileImage = screen.getByAltText(/Profile/i);
    expect(profileImage).toBeInTheDocument();

    // Check that notification counter is displayed (0 in this case)
    const notificationCounter = screen.getByText('0');
    expect(notificationCounter).toBeInTheDocument();
  });

  test('calls toggleSidebar when hamburger menu is clicked', () => {
    const toggleSidebar = jest.fn();



    render(
      <BrowserRouter>
        <Header toggleSidebar={toggleSidebar} />
      </BrowserRouter>
    );

    const hamburger = screen.getByAltText(/Menu/i);
    fireEvent.click(hamburger);

    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });

  test('navigates to dashboard when logo or text is clicked', () => {
    // Mock fetch responses

    render(
      <BrowserRouter>
        <Header toggleSidebar={jest.fn()} />
      </BrowserRouter>
    );

    const logo = screen.getByAltText(/Livelycampus Logo/i);
    const logoText = screen.getByText(/Livelycampus/i);

    fireEvent.click(logo);
    fireEvent.click(logoText);

    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    expect(mockedNavigate).toHaveBeenCalledTimes(2);
  });

  test('navigates to notifications page when notifications icon is clicked', () => {

    render(
      <BrowserRouter>
        <Header toggleSidebar={jest.fn()} />
      </BrowserRouter>
    );

    const notificationsIcon = screen.getByAltText(/Notifications/i);
    fireEvent.click(notificationsIcon);

    expect(mockedNavigate).toHaveBeenCalledWith('/Notifications');
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
  });

  test('navigates to profile page when profile image is clicked', () => {
    // Mock fetch responses

    render(
      <BrowserRouter>
        <Header toggleSidebar={jest.fn()} />
      </BrowserRouter>
    );

    const profileImage = screen.getByAltText(/Profile/i);
    fireEvent.click(profileImage);

    expect(mockedNavigate).toHaveBeenCalledWith('/profile');
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
  });

  test('displays default profile image when no user photoURL is available', () => {
    // Override the user without photoURL
    const userWithoutPhoto = { uid: '456' };
    window.sessionStorage.setItem('user', JSON.stringify(userWithoutPhoto));


    render(
      <BrowserRouter>
        <Header toggleSidebar={jest.fn()} />
      </BrowserRouter>
    );

    const profileImage = screen.getByAltText(/Profile/i);
    expect(profileImage).toHaveAttribute('src', 'profile-logo.jpg'); // Assuming profile-logo.jpg is mocked as 'test-file-stub'
    expect(profileImage).not.toHaveStyle('border-radius: 50');
  });

  test('displays user profile image when photoURL is available', () => {
    // Mock fetch responses

    render(
      <BrowserRouter>
        <Header toggleSidebar={jest.fn()} />
      </BrowserRouter>
    );

    const profileImage = screen.getByAltText(/Profile/i);
    expect(profileImage).toHaveAttribute('src', defaultUser.photoURL);
    expect(profileImage).toHaveStyle('border-radius: 50px');
  });

  test('does not display filters when showFilters is false', () => {


    render(
      <BrowserRouter>
        <Header toggleSidebar={jest.fn()} />
      </BrowserRouter>
    );

    const filterOptions = screen.queryByText(/Filter by:/i);
    expect(filterOptions).not.toBeInTheDocument();
  });

  // Additional tests can be added here for more coverage
});
