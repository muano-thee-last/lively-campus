// src/Pages/tests/main-content.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MainContent from "../dashboard/main-content";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom"; // Correct import for jest-dom
import e from "express";

// Mock useNavigate from react-router-dom
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock sessionStorage
const mockUser = {
  displayName: "John Doe",
  photoURL: "http://example.com/profile.jpg",
};

const mockUserData = {
  uid: "user123",
  user: JSON.stringify(mockUser),
};

beforeEach(() => {
  // Reset mocks before each test
  fetch.resetMocks();
  jest.clearAllMocks();

  // Mock sessionStorage
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "uid") return mockUserData.uid;
    if (key === "user") return mockUserData.user;
    return null;
  });

  // Mock window.location
  delete window.location;
  window.location = { href: "" };
});

describe("MainContent Component", () => {
  const mockEvents = [
    {
      id: "event1",
      title: "Music Concert",
      organizerName: "Alice",
      organizerImg: "",
      imageUrl: "http://example.com/event1.jpg",
      likes: 10,
      comments: [],
      tags: ["Music"],
      isApproved: true,
      date: "2024-11-01T12:00:00Z",
    },
    {
      id: "event2",
      title: "Dance Workshop",
      organizerName: "Bob",
      organizerImg: "http://example.com/bob.jpg",
      imageUrl: "http://example.com/event2.jpg",
      likes: 5,
      comments: [],
      tags: ["Dance"],
      isApproved: true,
      date: "2024-11-01T12:00:00Z",
    },
  ];

  const mockLikedEvents = { likedEvents: ["event1"] };

  const setupFetchMocks = () => {
    fetch.mockImplementation((url, options) => {
      if (url.endsWith("/events")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEvents),
        });
      }

      if (url.endsWith(`/users/${mockUserData.uid}`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLikedEvents),
        });
      }

      if (url.endsWith("/like")) {
        return Promise.resolve({ ok: true });
      }

      if (url.endsWith("/unlike")) {
        return Promise.resolve({ ok: true });
      }

      if (url.endsWith("/comments")) {
        return Promise.resolve({ ok: true });
      }

      if (url.includes("/events/event1/comments")) {
        return Promise.resolve({ ok: true });
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });
  };

  test("renders without crashing and fetches events", async () => {
    setupFetchMocks();

    render(
      <BrowserRouter>
        <MainContent searchQuery="" />
      </BrowserRouter>
    );

    // Verify that fetch was called to get events and user liked events
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://us-central1-witslivelycampus.cloudfunctions.net/app/events"
      );
      expect(fetch).toHaveBeenCalledWith(
        "https://us-central1-witslivelycampus.cloudfunctions.net/app/users/user123"
      );
    });

    // Wait for events to be rendered
    await waitFor(() => {
      expect(screen.getByText("Music Concert")).toBeInTheDocument();
      expect(screen.getByText("Dance Workshop")).toBeInTheDocument();
    });

    // Verify like counts
    expect(screen.getByText("likes 10")).toBeInTheDocument();
    expect(screen.getByText("likes 5")).toBeInTheDocument();

    // Verify that the like button for event1 is active
    const likeButtonEvent1 = screen.getByLabelText("like-button-event1");
    await waitFor(() => expect(likeButtonEvent1).toHaveClass("active"));

    // Verify organizer names
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("handles like and unlike functionality", async () => {
    setupFetchMocks();

    render(
      <BrowserRouter>
        <MainContent searchQuery="" />
      </BrowserRouter>
    );

    // Wait for events to be rendered
    await waitFor(() => {
      expect(screen.getByText("Music Concert")).toBeInTheDocument();
    });

    const likeButton = screen.getByLabelText("like-button-event1");
    const likeCount = screen.getByText("likes 10");

    // Wait for 'active' class to be applied
    await waitFor(() => {
      expect(likeButton).toHaveClass("active");
    });

    // Click to unlike
    fireEvent.click(likeButton);

    // Optimistic UI update: should remove 'active' and decrease likes
    expect(likeButton).not.toHaveClass("active");
    expect(likeCount).toHaveTextContent("likes 9");

    // Verify unlike API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://us-central1-witslivelycampus.cloudfunctions.net/app/unlike",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "user123", eventId: "event1" }),
        })
      );
    });

    // Click to like again
    fireEvent.click(likeButton);

    // Optimistic UI update: should add 'active' and increase likes
    expect(likeButton).toHaveClass("active");
    expect(likeCount).toHaveTextContent("likes 10");

    // Verify like API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://us-central1-witslivelycampus.cloudfunctions.net/app/like",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "user123", eventId: "event1" }),
        })
      );
    });
  });

  test("opens and closes comments overlay", async () => {
    const mockEvents = [
      {
        id: "event1",
        title: "Music Concert",
        organizerName: "Alice",
        organizerImg: "",
        imageUrl: "http://example.com/event1.jpg",
        likes: 10,
        comments: [],
        tags: ["Music"],
        isApproved: true,
        date: "2024-11-01T12:00:00Z",
      },
    ];

    const mockLikedEvents = { likedEvents: [] };

    // Mock fetch
    fetch.mockImplementation((url) => {
      if (url.endsWith("/events")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEvents),
        });
      }

      if (url.endsWith(`/users/${mockUserData.uid}`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLikedEvents),
        });
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });

    render(
      <BrowserRouter>
        <MainContent searchQuery="" />
      </BrowserRouter>
    );

    // Wait for events to be rendered
    await waitFor(() => {
      expect(screen.getByText("Music Concert")).toBeInTheDocument();
    });

    // Use getByTestId to select the comments button
    const commentsButton = screen.getByTestId("comments-button");
    fireEvent.click(commentsButton);

    // Overlay should appear
    await waitFor(() => {
      expect(screen.getByText("Comments")).toBeInTheDocument();
    });

    // Close the overlay
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    // Overlay should disappear
    await waitFor(() => {
      expect(screen.queryByText("Comments")).not.toBeInTheDocument();
    });
  });
  test("submits a new comment", async () => {
    const mockEvents = [
      {
        id: "event1",
        title: "Music Concert",
        organizerName: "Alice",
        organizerImg: "",
        imageUrl: "http://example.com/event1.jpg",
        likes: 10,
        comments: [],
        tags: ["Music"],
        isApproved: true,
        date: "2024-11-01T12:00:00Z",
      },
    ];

    const mockLikedEvents = { likedEvents: [] };

    const mockUserData = {
      uid: "user123",
      displayName: "John Doe",
      photoURL: "http://example.com/profile.jpg",
    };

    const newComment = {
      text: "Looking forward to it!",
      timestamp: new Date().toISOString(),
      userName: "John Doe",
      userProfilePic: "http://example.com/profile.jpg",
    };

    // Mock fetch
    fetch.mockImplementation((url, options) => {
      if (url.endsWith("/events")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEvents),
        });
      }

      if (url.endsWith(`/users/${mockUserData.uid}`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLikedEvents),
        });
      }

      if (url.endsWith("/events/event1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...mockEvents[0], comments: [] }),
        });
      }

      if (url.endsWith("/events/event1/comments") && options.method === "PUT") {
        // Verify that the right payload is being sent
        const payload = JSON.parse(options.body);
        expect(payload.comments[0].text).toBe(newComment.text);
        expect(payload.comments[0].userName).toBe(newComment.userName);
        expect(payload.comments[0].userProfilePic).toBe(
          newComment.userProfilePic
        );
        return Promise.resolve({ ok: true });
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });

    render(
      <BrowserRouter>
        <MainContent searchQuery="" />
      </BrowserRouter>
    );

    // Wait for events to be rendered
    await waitFor(() => {
      expect(screen.getByText("Music Concert")).toBeInTheDocument();
    });

    const commentsButton = screen.getByTestId("comments-button");
    fireEvent.click(commentsButton);

    // Enter a new comment
    const commentInput = screen.getByPlaceholderText("Write a comment...");
    fireEvent.change(commentInput, { target: { value: newComment.text } });

    // Submit the comment
    const submitButton = screen.getByLabelText("submit-comment-button"); // Make sure this label exists in your component
    fireEvent.click(submitButton);

    // Optimistic UI update: comment should appear immediately
    await waitFor(() => {
      expect(screen.getByText(newComment.text)).toBeInTheDocument();
      // Ensure the comment input is cleared after submission
      expect(commentInput).toHaveValue("");
    });
  });

  test("displays feedback box upon scrolling", async () => {
    const mockEvents = [
      {
        id: "event1",
        title: "Music Concert",
        organizerName: "Alice",
        organizerImg: "",
        imageUrl: "http://example.com/event1.jpg",
        likes: 10,
        comments: [],
        tags: ["Music"],
        isApproved: true,
        date: "2024-11-01T12:00:00Z",
      },
    ];

    const mockLikedEvents = { likedEvents: [] };

    // Mock fetch
    fetch.mockImplementation((url) => {
      if (url.endsWith("/events")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEvents),
        });
      }

      if (url.endsWith(`/users/${mockUserData.uid}`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLikedEvents),
        });
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });

    render(
      <BrowserRouter>
        <MainContent searchQuery="" />
      </BrowserRouter>
    );

    // Initially, feedback box should not be visible
    expect(
      screen.queryByText("Send us your feedback!")
    ).not.toBeInTheDocument();

    // Mock scroll position
    Object.defineProperty(window, "scrollY", { value: 100, writable: true });
    Object.defineProperty(document.body, "scrollHeight", {
      value: 200,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 100,
      writable: true,
    });

    fireEvent.scroll(window, { target: { scrollY: 100 } });

    // Wait for feedback box to appear
    await waitFor(() => {
      expect(screen.getByText("Send us your feedback!")).toBeInTheDocument();
    });

    // Click the feedback box
    const feedbackBox = screen.getByText("Send us your feedback!");
    fireEvent.click(feedbackBox);

    // Verify that mailto link was triggered
    expect(window.location.href).toBe(
      "mailto:livelycampus@gmail.com?subject=Feedback"
    );
  });

  test("filters events based on search query", async () => {
    const mockEvents = [
      {
        id: "event1",
        title: "Music Concert",
        organizerName: "Alice",
        organizerImg: "",
        imageUrl: "http://example.com/event1.jpg",
        likes: 10,
        comments: [],
        tags: ["Music"],
        isApproved: true,
        date: "2024-11-01T12:00:00Z",
      },
      {
        id: "event2",
        title: "Dance Workshop",
        organizerName: "Bob",
        organizerImg: "http://example.com/bob.jpg",
        imageUrl: "http://example.com/event2.jpg",
        likes: 5,
        comments: [],
        tags: ["Dance"],
        isApproved: true,
        date: "2024-11-01T12:00:00Z",
      },
    ];

    const mockLikedEvents = { likedEvents: [] };

    // Mock fetch
    fetch.mockImplementation((url) => {
      if (url.endsWith("/events")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEvents),
        });
      }

      if (url.endsWith(`/users/${mockUserData.uid}`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLikedEvents),
        });
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });

    const { rerender } = render(
      <BrowserRouter>
        <MainContent searchQuery="Dance" />
      </BrowserRouter>
    );

    // Wait for events to be rendered
    await waitFor(() => {
      expect(screen.queryByText("Music Concert")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Dance Workshop")).toBeInTheDocument();

    // Rerender with a different search query
    rerender(
      <BrowserRouter>
        <MainContent searchQuery="Alice" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Music Concert")).toBeInTheDocument();
      expect(screen.queryByText("Dance Workshop")).not.toBeInTheDocument();
    });
  });
  test("replies to a comment", async () => {
    const mockEvents = [
      {
        id: "event1",
        title: "Music Concert",
        organizerName: "Alice",
        organizerImg: "",
        imageUrl: "http://example.com/event1.jpg",
        likes: 10,
        comments: [
          {
            id: "comment1",
            text: "Great event!",
            userName: "Alice",
            userProfilePic: "http://example.com/alice.jpg",
            replies: [],
          },
        ],
        tags: ["Music"],
        isApproved: true,
        date: "2024-11-01T12:00:00Z",
      },
    ];

    const mockLikedEvents = { likedEvents: [] };

    const mockUserData = {
      uid: "user123",
      displayName: "John Doe",
      photoURL: "http://example.com/profile.jpg",
    };

    const newReply = {
      text: "Looking forward to it!",
      timestamp: new Date().toISOString(),
      userName: "John Doe",
      userProfilePic: "http://example.com/profile.jpg",
    };

    // Mock fetch
    fetch.mockImplementation((url, options) => {
      if (url.endsWith("/events")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEvents),
        });
      }

      if (url.endsWith(`/users/${mockUserData.uid}`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLikedEvents),
        });
      }

      if (url.endsWith("/events/event1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEvents[0]),
        });
      }

      if (
        url.endsWith("/events/event1/comments/comment1/replies") &&
        options.method === "PUT"
      ) {
        const payload = JSON.parse(options.body);
        expect(payload.replies[0].text).toBe(newReply.text);
        expect(payload.replies[0].userName).toBe(newReply.userName);
        expect(payload.replies[0].userProfilePic).toBe(newReply.userProfilePic);
        return Promise.resolve({ ok: true });
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });

    render(
      <BrowserRouter>
        <MainContent searchQuery="" />
      </BrowserRouter>
    );

    // Wait for events to be rendered
    await waitFor(() => {
      expect(screen.getByText("Music Concert")).toBeInTheDocument();
    });

    const commentsButton = screen.getByTestId("comments-button");
    fireEvent.click(commentsButton);

    // Enter a reply to a comment
    const replyInputOpener = screen.getByTestId(`reply-button-0`);
    fireEvent.click(replyInputOpener);

    const replyInput = screen.getByPlaceholderText("Write a reply...");
    fireEvent.change(replyInput, { target: { value: newReply.text } });

    // Submit the reply
    const replyButton = screen.getByTestId("submit-reply-button"); // Ensure this button exists
    fireEvent.click(replyButton);

    // Optimistic UI update: reply should appear immediately
    await waitFor(() => {
      expect(screen.getByText("View replies (1)")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("View replies (1)"));

    expect(screen.getByText("Hide replies")).toBeInTheDocument();
  });
});
