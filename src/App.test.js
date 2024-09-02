import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

describe('App Component', () => {
  
  test('renders LandingPage component at root path', () => {
    render(
      <Router>
        <App />
      </Router>
    );

    // Check if the LandingPage component is rendered
    expect(screen.getByText(/Landing Page Content/i)).toBeInTheDocument();
  });


  test('renders VerifyEmail component at /verify-email path', () => {
    window.history.pushState({}, 'Test Page', '/verify-email');

    render(
      <Router>
        <App />
      </Router>
    );

    // Check if the VerifyEmail component is rendered
    expect(screen.getByText(/Verify Email Page Content/i)).toBeInTheDocument();
  });
});
