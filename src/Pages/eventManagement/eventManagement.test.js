import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import EventManagement from './eventManagement';

// Mock the child components
jest.mock('../dashboard/footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('../dashboard/side-bar', () => ({ isSidebarOpen }) => <div data-testid="sidebar">Sidebar {isSidebarOpen ? 'Open' : 'Closed'}</div>);
jest.mock('../dashboard/header', () => ({ toggleSidebar }) => <div data-testid="header">Header</div>);
jest.mock('./event-management-main-content', () => () => <div data-testid="main-content">Event Management Main Content</div>);

describe('EventManagement', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <EventManagement />
      </BrowserRouter>
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  // Add more tests if there's any specific functionality in this component
});
