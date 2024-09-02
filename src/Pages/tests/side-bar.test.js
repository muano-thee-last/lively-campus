import React from 'react';
import { render, screen } from '@testing-library/react';
import SideBar from '../dashboard/side-bar';

describe('SideBar component', () => {
  test('renders sidebar when open', () => {
    render(<SideBar isSidebarOpen={true} />);
    const sidebarElement = screen.getByRole('navigation');
    expect(sidebarElement).toHaveClass('expanded');
  });

  test('renders sidebar when closed', () => {
    render(<SideBar isSidebarOpen={false} />);
    const sidebarElement = screen.getByRole('navigation');
    expect(sidebarElement).toHaveClass('collapsed');
  });

  test('displays correct number of menu items', () => {
    render(<SideBar isSidebarOpen={true} />);
    const menuItems = screen.getAllByRole('link');
    expect(menuItems).toHaveLength(4);
  });

  test('displays text when sidebar is open', () => {
    render(<SideBar isSidebarOpen={true} />);
    expect(screen.getByText('Event Calendar')).toBeInTheDocument();
    expect(screen.getByText('Ticket History')).toBeInTheDocument();
    expect(screen.getByText('Post Event')).toBeInTheDocument();
    expect(screen.getByText('Event History')).toBeInTheDocument();
  });

  test('does not display text when sidebar is closed', () => {
    render(<SideBar isSidebarOpen={false} />);
    expect(screen.queryByText('Event Calendar')).not.toBeInTheDocument();
    expect(screen.queryByText('Ticket History')).not.toBeInTheDocument();
    expect(screen.queryByText('Post Event')).not.toBeInTheDocument();
    expect(screen.queryByText('Event History')).not.toBeInTheDocument();
  });
});
