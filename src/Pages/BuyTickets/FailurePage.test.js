import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import FailurePage from './onFailure';

jest.useFakeTimers(); 
test('renders FailurePage with correct message and navigates after 4 seconds', async () => {
  render(
    <MemoryRouter initialEntries={['/failure']}>
      <Routes>
        <Route path="/failure" element={<FailurePage />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} /> {/* Mock Dashboard */}
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Purchase Failed!/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Something went wrong. You will be redirected to your dashboard shortly./i)
  ).toBeInTheDocument();

  // Fast-forward 4 seconds
  jest.advanceTimersByTime(4000);

  // Verify that the user is redirected to '/dashboard'
  await waitFor(() => expect(screen.getByText(/Dashboard/i)).toBeInTheDocument());
});
