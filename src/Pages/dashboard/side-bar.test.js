import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import SideBar from './side-bar';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

describe('SideBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.setItem('uid', '123');
  });

  it('renders sidebar items when open', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar isSidebarOpen={true} />
        </BrowserRouter>
      );
    });
 
    expect(screen.getByText('Event Calendar')).toBeInTheDocument();
    expect(screen.getByText('Ticket History')).toBeInTheDocument();
    expect(screen.getByText('Post Event')).toBeInTheDocument();
    expect(screen.getByText('Event History')).toBeInTheDocument();
  });

  it('does not render text for sidebar items when closed', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar isSidebarOpen={false} />
        </BrowserRouter>
      );
    });

    expect(screen.queryByText('Event Calendar')).not.toBeInTheDocument();
    expect(screen.queryByText('Ticket History')).not.toBeInTheDocument();
    expect(screen.queryByText('Post Event')).not.toBeInTheDocument();
    expect(screen.queryByText('Event History')).not.toBeInTheDocument();
  });

  it('renders admin link when user is admin', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ isAdmin: true }),
      })
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar isSidebarOpen={true} />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Approve Events')).toBeInTheDocument();
    });
  });

  it('does not render admin link when user is not admin', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ isAdmin: false }),
      })
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar isSidebarOpen={true} />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Approve Events')).not.toBeInTheDocument();
    });
  });

  it('handles fetch error gracefully', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Fetch failed'))
    );

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar isSidebarOpen={true} />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
