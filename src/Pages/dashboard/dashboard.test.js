import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './dashboard';

// Mock child components
jest.mock('./header', () => ({ toggleSidebar, onSearch }) => (
  <div data-testid="mock-header">
    <button onClick={toggleSidebar}>Toggle Sidebar</button>
    <input 
      data-testid="search-input"
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search"
    />
  </div>
));
jest.mock('./footer', () => () => <div data-testid="mock-footer">Footer</div>);
jest.mock('./side-bar', () => ({ isSidebarOpen }) => (
  <div data-testid="mock-sidebar">
    Sidebar {isSidebarOpen ? 'Open' : 'Closed'}
  </div>
));
jest.mock('./main-content', () => ({ searchQuery }) => (
  <div data-testid="mock-main-content">
    Main Content (Search Query: {searchQuery})
  </div>
));

describe('Dashboard Component', () => {
  test('renders Dashboard with all child components', () => {
    render(<Dashboard />);
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-main-content')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('toggles sidebar when button is clicked', () => {
    render(<Dashboard />);
    
    const toggleButton = screen.getByText('Toggle Sidebar');
    const sidebar = screen.getByTestId('mock-sidebar');

    expect(sidebar).toHaveTextContent('Sidebar Closed');

    fireEvent.click(toggleButton);
    expect(sidebar).toHaveTextContent('Sidebar Open');

    fireEvent.click(toggleButton);
    expect(sidebar).toHaveTextContent('Sidebar Closed');
  });

  test('updates search query when input changes', () => {
    render(<Dashboard />);
    
    const searchInput = screen.getByTestId('search-input');
    const mainContent = screen.getByTestId('mock-main-content');

    expect(mainContent).toHaveTextContent('Search Query:');

    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(mainContent).toHaveTextContent('Search Query: test query');
  });
});