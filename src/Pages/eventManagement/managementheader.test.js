import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Header from './managementheader';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Header', () => {
  const mockToggleSidebar = jest.fn();

  beforeEach(() => {
    render(
      <BrowserRouter>
        <Header toggleSidebar={mockToggleSidebar} />
      </BrowserRouter>
    );
  });

  it('renders without crashing', () => {
    expect(screen.getByText('Livelycampus')).toBeInTheDocument();
    expect(screen.getByText('EVENT MANAGEMENT')).toBeInTheDocument();
  });

  it('calls toggleSidebar when hamburger icon is clicked', () => {
    fireEvent.click(screen.getByAltText('Menu'));
    expect(mockToggleSidebar).toHaveBeenCalled();
  });

  it('navigates to dashboard when logo or text is clicked', () => {
    fireEvent.click(screen.getByAltText('Livelycampus Logo'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

    fireEvent.click(screen.getByText('Livelycampus'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to notifications when notification icon is clicked', () => {
    fireEvent.click(screen.getByAltText('Notifications'));
    expect(mockNavigate).toHaveBeenCalledWith('/Notifications');
  });

  it('navigates to profile when profile icon is clicked', () => {
    fireEvent.click(screen.getByAltText('Profile'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });
});
