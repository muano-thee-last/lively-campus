import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Calendar from './Calendar';

// Mock the components used in Calendar
jest.mock('../dashboard/header', () => () => <div data-testid="mock-header">Header</div>);
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

  // Add more tests as needed for Calendar component functionality
});
