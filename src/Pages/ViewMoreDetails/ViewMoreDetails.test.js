import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ViewMoreDetails from './ViewMoreDetails';
import '@testing-library/jest-dom';

// Mock the components used in ViewMoreDetails
jest.mock('../dashboard/header', () => ({ toggleSidebar }) => (
  <div data-testid="mock-header">
    Header
    <button onClick={toggleSidebar}>Toggle Sidebar</button>
  </div>
));
jest.mock('../dashboard/side-bar', () => ({ isSidebarOpen }) => (
  <div data-testid="mock-sidebar">Sidebar {isSidebarOpen ? 'Open' : 'Closed'}</div>
));
jest.mock('./EventDetails', () => ({ id }) => <div data-testid="mock-event-details">Event Details for ID: {id}</div>);

describe('ViewMoreDetails', () => {
  it('renders all components correctly', () => {
    render(
      <MemoryRouter initialEntries={['/events/1']}>
        <Routes>
          <Route path="/events/:id" element={<ViewMoreDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-event-details')).toBeInTheDocument();
  });

  it('passes the correct id to EventDetails', () => {
    render(
      <MemoryRouter initialEntries={['/events/123']}>
        <Routes>
          <Route path="/events/:id" element={<ViewMoreDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Event Details for ID: 123')).toBeInTheDocument();
  });

  it('toggles sidebar when button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/events/1']}>
        <Routes>
          <Route path="/events/:id" element={<ViewMoreDetails />} />
        </Routes>
      </MemoryRouter>
    );

    const toggleButton = screen.getByText('Toggle Sidebar');
    const sidebar = screen.getByTestId('mock-sidebar');

    expect(sidebar).toHaveTextContent('Sidebar Closed');

    fireEvent.click(toggleButton);

    expect(sidebar).toHaveTextContent('Sidebar Open');

    fireEvent.click(toggleButton);

    expect(sidebar).toHaveTextContent('Sidebar Closed');
  });
});
