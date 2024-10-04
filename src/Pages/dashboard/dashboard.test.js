import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './dashboard';

jest.mock('./header', () => ({ toggleSidebar, onSearch }) => (
  <div>
    <button onClick={toggleSidebar}>Toggle Sidebar</button>
    <input onChange={(e) => onSearch(e.target.value)} />
  </div>
));

jest.mock('./side-bar', () => ({ isSidebarOpen }) => (
  <div>{isSidebarOpen ? 'Sidebar Open' : 'Sidebar Closed'}</div> 
));

jest.mock('./main-content', () => ({ searchQuery }) => (
  <div>Main Content: {searchQuery}</div>
));

jest.mock('./footer', () => () => <div>Footer</div>);

describe('Dashboard', () => {
  it('renders all components', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Toggle Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Sidebar Closed')).toBeInTheDocument();
    expect(screen.getByText('Main Content:')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('toggles sidebar when button is clicked', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Toggle Sidebar'));
    expect(screen.getByText('Sidebar Open')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Toggle Sidebar'));
    expect(screen.getByText('Sidebar Closed')).toBeInTheDocument();
  });

  it('updates search query when input changes', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test query' } });
    expect(screen.getByText('Main Content: test query')).toBeInTheDocument();
  });
});
