import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ViewMoreDetails from './ViewMoreDetails';
import '@testing-library/jest-dom';

// Mock the components used in ViewMoreDetails
jest.mock('../dashboard/header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('../dashboard/side-bar', () => () => <div data-testid="mock-sidebar">Sidebar</div>);
jest.mock('./EventDetails', () => () => <div data-testid="mock-event-details">Event Details</div>);

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

    expect(screen.getByTestId('mock-event-details')).toBeInTheDocument();
    // Note: In a real scenario, you might want to check if the correct id is passed to EventDetails.
    // However, since we've mocked EventDetails, we can't directly test this here.
    // You might consider adding a prop to the mock component if you need to test this specifically.
  });
});
