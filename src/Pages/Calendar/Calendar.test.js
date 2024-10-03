import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Calendar from './Calendar';

// Mock the components used in Calendar
jest.mock('../dashboard/header', () => ({ toggleSidebar }) => (
  <button data-testid="mock-header" onClick={toggleSidebar}>Toggle Sidebar</button>
));
jest.mock('../dashboard/side-bar', () => ({ isSidebarOpen }) => (
  <div data-testid="mock-sidebar">Sidebar {isSidebarOpen ? 'Open' : 'Closed'}</div>
));
jest.mock('./MainContent', () => () => <div data-testid="mock-main-content">Main Content</div>);

describe('Calendar Component', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <Calendar />
      </Router>
    );
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-main-content')).toBeInTheDocument();
  });

  test('sidebar is initially closed', () => {
    render(
      <Router>
        <Calendar />
      </Router>
    );
    expect(screen.getByTestId('mock-sidebar')).toHaveTextContent('Sidebar Closed');
  });

  test('toggles sidebar when header button is clicked', () => {
    render(
      <Router>
        <Calendar />
      </Router>
    );
    const toggleButton = screen.getByTestId('mock-header');
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('mock-sidebar')).toHaveTextContent('Sidebar Open');
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('mock-sidebar')).toHaveTextContent('Sidebar Closed');
  });

  // Add more tests as needed for Calendar component functionality
});
