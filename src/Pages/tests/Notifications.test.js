import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Notifications from "../Notifications/Notifications";

// Mock the fetch function
global.fetch = jest.fn();

describe("Notifications Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("renders loading message initially", () => {
    render(
      <Router>
        <Notifications />
      </Router>
    );
    expect(screen.getByText("Loading notifications...")).toBeInTheDocument();
  });

  it("renders notifications after loading", async () => {
    const mockNotifications = [
      {
        id: "1",
        eventId: "event1",
        message: "Test notification 1",
        timestamp: { _seconds: Date.now() / 1000 },
      },
    ];
    const mockEvent = { title: "Test Event", imageUrl: "test-image.jpg" };

    fetch.mockImplementation((url) => {
      if (url.includes("/notifications")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockNotifications),
        });
      } else if (url.includes("/events/")) {
        return Promise.resolve({ json: () => Promise.resolve(mockEvent) });
      }
    });

    render(
      <Router>
        <Notifications />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Event")).toBeInTheDocument();
    });
    expect(screen.getByText("Test notification 1")).toBeInTheDocument();
  });

  it('displays "Today" for current date notifications', async () => {
    const today = new Date();
    const mockNotifications = [
      {
        id: "1",
        eventId: "event1",
        message: "Today's notification",
        timestamp: { _seconds: today.getTime() / 1000 },
      },
    ];
    const mockEvent = { title: "Today's Event", imageUrl: "test-image.jpg" };

    fetch.mockImplementation((url) => {
      if (url.includes("/notifications")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockNotifications),
        });
      } else if (url.includes("/events/")) {
        return Promise.resolve({ json: () => Promise.resolve(mockEvent) });
      }
    });

    render(
      <Router>
        <Notifications />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Today")).toBeInTheDocument();
    });
    expect(screen.getByText("Today's Event")).toBeInTheDocument();
  });
});
