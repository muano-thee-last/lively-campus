import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationsDashboard from '../Notifications/NotificationsDashboard';

// Mock the child components
jest.mock('../dashboard/header', () => ({ toggleSidebar }) => (
  <div data-testid="mock-header" onClick={toggleSidebar}>Header</div>
));
jest.mock('../dashboard/footer', () => () => <div data-testid="mock-footer">Footer</div>);
jest.mock('../dashboard/side-bar', () => ({ isSidebarOpen }) => (
  <div data-testid="mock-sidebar">{isSidebarOpen ? 'Open' : 'Closed'}</div>
));
jest.mock('../Notifications/Notifications', () => () => <div data-testid="mock-notifications">Notifications</div>);

describe('NotificationsDashboard', () => {
  test('renders all components', () => {
    render(<NotificationsDashboard />);
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-notifications')).toBeInTheDocument();
  });

  test('toggles sidebar when header is clicked', () => {
    render(<NotificationsDashboard />);
    
    const header = screen.getByTestId('mock-header');
    const sidebar = screen.getByTestId('mock-sidebar');

    expect(sidebar).toHaveTextContent('Closed');
    
    fireEvent.click(header);
    
    expect(sidebar).toHaveTextContent('Open');
  });

  });