import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewMoreDetails from './ViewMoreDetails';
import Header from '../dashboard/header';
import SideBar from '../dashboard/side-bar';
import EventDetails from './EventDetails';

jest.mock('../../components/Header/Header', () => ({ toggleSidebar }) => (
  <div data-testid="header" onClick={toggleSidebar}>Header</div>
));
jest.mock('../../components/SideBar/SideBar', () => ({ isSidebarOpen }) => (
  <div data-testid="sidebar">{isSidebarOpen ? 'Open' : 'Closed'}</div>
));
jest.mock('./EventDetails', () => () => <div data-testid="event-details">Event Details</div>);

describe('ViewMoreDetails Component', () => {
  test('renders ViewMoreDetails component with initial closed sidebar', () => {
    render(<ViewMoreDetails />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toHaveTextContent('Closed');
    expect(screen.getByTestId('event-details')).toBeInTheDocument();
  });

  test('toggles sidebar when Header is clicked', () => {
    render(<ViewMoreDetails />);
    const header = screen.getByTestId('header');
    const sidebar = screen.getByTestId('sidebar');

    expect(sidebar).toHaveTextContent('Closed');
    fireEvent.click(header);
    expect(sidebar).toHaveTextContent('Open');
    fireEvent.click(header);
    expect(sidebar).toHaveTextContent('Closed');
  });

  test('renders correct layout structure', () => {
    render(<ViewMoreDetails />);
    const mainFooterSeparator = screen.getByTestId('main-footer-separator');
    const viewMoreDetails = screen.getByTestId('ViewMoreDetails');
    const content = screen.getByTestId('content');

    expect(mainFooterSeparator).toContainElement(viewMoreDetails);
    expect(viewMoreDetails).toContainElement(screen.getByTestId('header'));
    expect(viewMoreDetails).toContainElement(content);
    expect(content).toContainElement(screen.getByTestId('sidebar'));
    expect(content).toContainElement(screen.getByTestId('event-details'));
  });
});
