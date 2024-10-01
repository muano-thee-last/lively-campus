import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveComponent from '../LandingPage/ResponsiveComponent';
import { useMediaQuery } from 'react-responsive';

jest.mock('react-responsive', () => ({
  useMediaQuery: jest.fn(),
}));

describe('ResponsiveComponent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders desktop content for screens wider than 1024px', () => {
    // Mock the useMediaQuery hook to simulate desktop screen size
    useMediaQuery.mockImplementationOnce(() => true).mockImplementationOnce(() => false).mockImplementationOnce(() => false);

    render(<ResponsiveComponent />);

    expect(screen.getByText('Desktop view content here')).toBeInTheDocument();
    expect(screen.queryByText('Tablet view content here')).not.toBeInTheDocument();
    expect(screen.queryByText('Mobile view content here')).not.toBeInTheDocument();
  });

  test('renders tablet content for screens between 768px and 1023px', () => {
    // Mock the useMediaQuery hook to simulate tablet screen size
    useMediaQuery.mockImplementationOnce(() => false).mockImplementationOnce(() => true).mockImplementationOnce(() => false);

    render(<ResponsiveComponent />);

    expect(screen.queryByText('Desktop view content here')).not.toBeInTheDocument();
    expect(screen.getByText('Tablet view content here')).toBeInTheDocument();
    expect(screen.queryByText('Mobile view content here')).not.toBeInTheDocument();
  });

  test('renders mobile content for screens less than 768px', () => {
    // Mock the useMediaQuery hook to simulate mobile screen size
    useMediaQuery.mockImplementationOnce(() => false).mockImplementationOnce(() => false).mockImplementationOnce(() => true);

    render(<ResponsiveComponent />);

    expect(screen.queryByText('Desktop view content here')).not.toBeInTheDocument();
    expect(screen.queryByText('Tablet view content here')).not.toBeInTheDocument();
    expect(screen.getByText('Mobile view content here')).toBeInTheDocument();
  });
});