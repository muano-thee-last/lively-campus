import React from "react";
import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import SideBar from "./side-bar";

// Mock sessionStorage methods
const mockClear = jest.fn();
Object.defineProperty(window, "sessionStorage", {
  value: {
    getItem: jest.fn(() => "12345"),
    setItem: jest.fn(),
    clear: mockClear,
  },
});

describe("SideBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.setItem("uid", "123");
  });

  afterEach(() => {
    global.fetch.mockRestore(); // Ensure fetch is reset after each test
  });

  it("renders sidebar items when open", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar isSidebarOpen={true} />
        </BrowserRouter>
      );
    });

    expect(screen.getByText("Event Calendar")).toBeInTheDocument();
    expect(screen.getByText("Ticket History")).toBeInTheDocument();
    expect(screen.getByText("Post Event")).toBeInTheDocument();
    expect(screen.getByText("Event History")).toBeInTheDocument();
  });

  it("does not render text for sidebar items when closed", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar isSidebarOpen={false} />
        </BrowserRouter>
      );
    });

    expect(screen.queryByText("Event Calendar")).not.toBeInTheDocument();
    expect(screen.queryByText("Ticket History")).not.toBeInTheDocument();
    expect(screen.queryByText("Post Event")).not.toBeInTheDocument();
    expect(screen.queryByText("Event History")).not.toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("renders admin link when user is admin", async () => {
    // Mock fetch to simulate admin user
    global.fetch = jest.fn(() =>
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

    // Wait for the fetch to resolve and the component to update
    await waitFor(() => {
      expect(screen.getByText("Approve Events")).toBeInTheDocument();
    });
  });

  it("does not render admin link when user is not admin", async () => {
    // Mock fetch to simulate non-admin user
    global.fetch = jest.fn(() =>
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

    // Ensure the "Approve Events" link is not rendered
    await waitFor(() => {
      expect(screen.queryByText("Approve Events")).not.toBeInTheDocument();
    });
  });

  it("handles fetch error gracefully", async () => {
    // Mock fetch to throw an error
    global.fetch = jest.fn(() => Promise.reject(new Error("Fetch failed")));

    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar isSidebarOpen={true} />
        </BrowserRouter>
      );
    });

    // Ensure the error is logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  describe("SideBar Logout functionality", () => {
    it("calls sessionStorage.clear() when Logout is clicked", async () => {
      render(
        <BrowserRouter>
          <SideBar isSidebarOpen={true} />
        </BrowserRouter>
      );

      // Find the Logout link (only visible when sidebar is open)
      const logoutLink = screen.getByText("Logout");

      // Simulate a click on the Logout link
      fireEvent.click(logoutLink);

      // Check that sessionStorage.clear() was called
      expect(mockClear).toHaveBeenCalled();
    });

    it("redirects to home page after logout", async () => {
      const mockAssign = jest.fn();
      delete window.location;
      window.location = { assign: mockAssign };

      render(
        <BrowserRouter>
          <SideBar isSidebarOpen={true} />
        </BrowserRouter>
      );

      // Simulate a click on the Logout link
      const logoutLink = screen.getByText("Logout");
      fireEvent.click(logoutLink);

    });
  });
});