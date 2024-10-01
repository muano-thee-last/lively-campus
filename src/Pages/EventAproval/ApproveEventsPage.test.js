import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ApproveEventsPage from './ApproveEventsPage';

// Mock the child components
jest.mock('../dashboard/header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('../dashboard/side-bar', () => ({ isSidebarOpen }) => <div data-testid="mock-sidebar">{isSidebarOpen ? 'Open' : 'Closed'}</div>);
jest.mock('./ApproveEvents', () => ({ id }) => <div data-testid="mock-approve-events">ApproveEvents {id}</div>);

describe('ApproveEventsPage', () => {
  const renderWithRouter = (ui, { route = '/approve-events/123' } = {}) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/approve-events/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders all components correctly', () => {
    renderWithRouter(<ApproveEventsPage />);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-approve-events')).toBeInTheDocument();
  });

  test('toggles sidebar when header triggers toggle', () => {
    const { getByTestId } = renderWithRouter(<ApproveEventsPage />);

    const header = getByTestId('mock-header');
    const sidebar = getByTestId('mock-sidebar');

    expect(sidebar).toHaveTextContent('Closed');

    // Simulate header triggering sidebar toggle
    fireEvent.click(header);

    // Wait for the state to update
    waitFor(() => {
      expect(sidebar).toHaveTextContent('Open');
    });
  });

  test('passes correct id to ApproveEvents component', () => {
    renderWithRouter(<ApproveEventsPage />);

    const approveEvents = screen.getByTestId('mock-approve-events');
    expect(approveEvents).toHaveTextContent('ApproveEvents 123');
  });
});
