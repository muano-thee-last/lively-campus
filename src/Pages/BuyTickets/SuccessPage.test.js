import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SuccessPage from './onSuccess';

jest.useFakeTimers(); // Mock timers to control time in tests

test('renders SuccessPage with correct message and navigates after 4 seconds', async () => {
  // Render the SuccessPage component inside a MemoryRouter
  render(
    <MemoryRouter initialEntries={['/success']}>
      <Routes>
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} /> {/* Mock Dashboard */}
      </Routes>
    </MemoryRouter>
  );

  // Check that the success message is displayed
  expect(screen.getByText(/Purchase Successful!/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Thank you for purchasing your ticket. You will be redirected to your dashboard shortly./i)
  ).toBeInTheDocument();

  // Fast-forward 4 seconds
  jest.advanceTimersByTime(4000);

  // Verify that the user is redirected to '/dashboard'
  await waitFor(() => expect(screen.getByText(/Dashboard/i)).toBeInTheDocument());
});
