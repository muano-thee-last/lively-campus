import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CalendarPopUpCard from './CalendarPopUpCard';

// Mock the FontAwesomeIcon component
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => null
}));

describe('CalendarPopUpCard', () => {
  const mockOnClose = jest.fn();
  const mockDate = '2023-10-10';
  const mockEvents = [
    {
      id: 1,
      title: 'Event 1',
      venue: 'Venue 1',
      date: '2023-10-10T10:00:00',
      capacity: 100,
      availableTickets: 50,
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      title: 'Event 2',
      venue: 'Venue 2',
      date: '2023-10-10T14:00:00',
      capacity: 200,
      availableTickets: 150,
      imageUrl: 'https://via.placeholder.com/150'
    }
  ];

  const renderComponent = (props) => {
    return render(
      <Router>
        <CalendarPopUpCard {...props} />
      </Router>
    );
  };

  it('renders the CalendarPopUpCard component with events', () => {
    renderComponent({ date: mockDate, events: mockEvents, onClose: mockOnClose });

    expect(screen.getByText(mockDate)).toBeInTheDocument();
    expect(screen.getByText('Available Events')).toBeInTheDocument();
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  it('renders the CalendarPopUpCard component with no events', () => {
    renderComponent({ date: mockDate, events: [], onClose: mockOnClose });

    expect(screen.getByText(mockDate)).toBeInTheDocument();
    expect(screen.getByText("Oops!! It looks like there's nothing scheduled for this date.")).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    renderComponent({ date: mockDate, events: mockEvents, onClose: mockOnClose });

    fireEvent.click(screen.getByText('X'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when an event link is clicked', () => {
    renderComponent({ date: mockDate, events: mockEvents, onClose: mockOnClose });

    fireEvent.click(screen.getByText('Event 1'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
