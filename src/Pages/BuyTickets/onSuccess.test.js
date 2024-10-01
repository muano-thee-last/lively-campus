import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SuccessPage from './onSuccess';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('SuccessPage', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(() => 'mockUserId'),
      },
      writable: true
    });
  });

  it('renders success message', () => {
    render(
      <MemoryRouter initialEntries={['/success?externalId={"id":"123"}']}>
        <Routes>
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('🎉 Purchase Successful!')).toBeInTheDocument();
    expect(screen.getByText('Thank you for purchasing your ticket. You will be redirected to your dashboard shortly.')).toBeInTheDocument();
  });

  it('calls API endpoints on mount', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('uniqueCode')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ uniqueString: 'mockTicketCode' }),
        });
      }
      return Promise.resolve({ ok: true });
    });

    render(
      <MemoryRouter initialEntries={['/success?externalId={"id":"123"}']}>
        <Routes>
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(4);
      expect(global.fetch).toHaveBeenCalledWith('https://us-central1-witslivelycampus.cloudfunctions.net/app/uniqueCode');
      expect(global.fetch).toHaveBeenCalledWith('https://us-central1-witslivelycampus.cloudfunctions.net/app/addTicket', expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith('https://us-central1-witslivelycampus.cloudfunctions.net/app/decrementAvailableTickets', expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith('https://us-central1-witslivelycampus.cloudfunctions.net/app/incrementTicketSales', expect.any(Object));
    });
  });

  it('handles API errors gracefully', async () => {
    console.error = jest.fn(); // Mock console.error to test error logging

    global.fetch.mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter initialEntries={['/success?externalId={"id":"123"}']}>
        <Routes>
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching unique code:', expect.any(Error));
    });
  });

  it('handles invalid externalId', () => {
    render(
      <MemoryRouter initialEntries={['/success?externalId=invalid']}>
        <Routes>
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('🎉 Purchase Successful!')).not.toBeInTheDocument();
  });
});