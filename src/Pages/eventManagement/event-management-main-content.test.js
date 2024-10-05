import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import '@testing-library/jest-dom';
import EventManagementMainContent from "./event-management-main-content";
import { useNavigate } from "react-router-dom";
import useImageUpload from "./useImageUpload";

// Mock useNavigate and useImageUpload hooks
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));
jest.mock("./useImageUpload", () => jest.fn());

const mockUseImageUpload = useImageUpload;

describe("EventManagementMainContent", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockNavigate.mockClear();
    mockUseImageUpload.mockReturnValue({
      imagePreview: null,
      uploading: false,
      uploadImage: jest.fn(),
      fileInputRef: { current: null },
      handleFileChange: jest.fn(),
      handleDivClick: jest.fn(),
      setImagePreview: jest.fn(),
    });

    // Mock sessionStorage for user
    sessionStorage.setItem(
      "user",
      JSON.stringify({ displayName: "Test User" })
    );

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    global.fetch.mockClear();
  });

  it("renders correctly with no events", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    await act(async () => {
      render(<EventManagementMainContent />);
    });

    expect(screen.getByText("No events found")).toBeInTheDocument();
  });

  it("displays error message when fetching events fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn(),
    });

    await act(async () => {
      render(<EventManagementMainContent />);
    });

    expect(screen.getByText("Error: HTTP error! Status: 500")).toBeInTheDocument();
  });

  it("renders events correctly", async () => {
    const events = [
      { id: "1", title: "Event 1", organizerName: "Test User", imageUrl: "", availableTickets: 50, isApproved: true },
      { id: "2", title: "Event 2", organizerName: "Test User", imageUrl: "", availableTickets: 100, isApproved: false },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(events),
    });

    await act(async () => {
      render(<EventManagementMainContent />);
    });

    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
    expect(screen.getAllByText("Test User")).toHaveLength(2);
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("handles event deletion", async () => {
    const events = [
      { id: "1", title: "Event 1", organizerName: "Test User", imageUrl: "", availableTickets: 50 },
    ];

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(events),
      })
      .mockResolvedValueOnce({ ok: true }); // DELETE success

    await act(async () => {
      render(<EventManagementMainContent />);
    });

    expect(screen.getByText("Event 1")).toBeInTheDocument();

    // Mock the DELETE request
    const deleteButton = screen.getByTestId("management-deleteEvent");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://us-central1-witslivelycampus.cloudfunctions.net/app/events/1",
      { method: "DELETE" }
    );

    expect(screen.queryByText("Event 1")).not.toBeInTheDocument();
  });

  it("displays error when event deletion fails", async () => {
    const events = [
      { id: "1", title: "Event 1", organizerName: "Test User", imageUrl: "", availableTickets: 50 },
    ];

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(events),
      })
      .mockResolvedValueOnce({ ok: false }); // DELETE fails

    console.error = jest.fn(); // Mock console.error

    await act(async () => {
      render(<EventManagementMainContent />);
    });

    expect(screen.getByText("Event 1")).toBeInTheDocument();

    const deleteButton = screen.getByTestId("management-deleteEvent");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://us-central1-witslivelycampus.cloudfunctions.net/app/events/1",
      { method: "DELETE" }
    );

    expect(console.error).toHaveBeenCalledWith("Failed to delete event");
  });

  it("navigates to edit event when edit button is clicked", async () => {
    const events = [
      { id: "1", title: "Event 1", organizerName: "Test User", imageUrl: "", availableTickets: 50 },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(events),
    });

    await act(async () => {
      render(<EventManagementMainContent />);
    });

    const editButton = screen.getByTestId("management-event-edit");
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith("/post-event/", {
      state: {
        editingEvent: events[0],
        isEditing: true,
      },
    });
  });

  it("opens the upload modal when the camera icon is clicked", async () => {
    const events = [
      { id: "1", title: "Event 1", organizerName: "Test User", imageUrl: "", availableTickets: 50 },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(events),
    });

    await act(async () => {
      render(<EventManagementMainContent />);
    });

    const cameraButton = screen.getByTestId("management-event-upload-image");
    fireEvent.click(cameraButton);

    expect(screen.getByText("Upload Image")).toBeInTheDocument();
  });

  // it("handles image upload", async () => {
  //   const events = [
  //     { id: "1", title: "Event 1", organizerName: "Test User", imageUrl: "", availableTickets: 50 },
  //   ];
  
  //   // Mock the upload image function to return a resolved value
  //   const mockUploadImage = jest.fn().mockResolvedValue("image-url");
  
  //   // Mock the useImageUpload hook
  //   mockUseImageUpload.mockReturnValueOnce({
  //     imagePreview: "preview-url",
  //     uploading: false,
  //     uploadImage: mockUploadImage,
  //     fileInputRef: { current: document.createElement("input") }, // mock file input
  //     handleFileChange: jest.fn(), // Ensure this function is also mocked
  //     handleDivClick: jest.fn(),
  //     setImagePreview: jest.fn(),
  //   });
  
  //   // Mock fetch calls
  //   fetch
  //     .mockResolvedValueOnce({
  //       ok: true,
  //       json: jest.fn().mockResolvedValue(events),
  //     })
  //     .mockResolvedValueOnce({ ok: true }); // PUT success for image upload
  
  //   // Render the component
  //   await act(async () => {
  //     render(<EventManagementMainContent />);
  //   });
  
  //   // Simulate clicking the camera button to trigger file input
  //   const cameraButton = screen.getByTestId("management-event-upload-image");
  //   fireEvent.click(cameraButton);
  
  //   // Check if modal opened
  //   expect(screen.getByText("Upload Image")).toBeInTheDocument();
  
  //   // Simulate selecting a file (this triggers handleFileChange)
  //   const fileInput = mockUseImageUpload().fileInputRef.current;
  //   fireEvent.change(fileInput, { target: { files: [new File([], "test-image.png")] } });
  
  //   // Ensure handleFileChange is called after file selection
  //   expect(mockUseImageUpload().handleFileChange).toHaveBeenCalled();
  
  //   // Simulate clicking the Upload button
  //   const uploadButton = screen.getByText("Upload");
  //   await act(async () => {
  //     fireEvent.click(uploadButton);
  //   });
  
  //   // Ensure uploadImage is called once after clicking the upload button
  //   expect(mockUploadImage).toHaveBeenCalledTimes(1);
  
  //   // Check if the fetch request is made with correct data
  //   expect(fetch).toHaveBeenCalledWith(
  //     "https://us-central1-witslivelycampus.cloudfunctions.net/app/events/1",
  //     {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ imageUrl: "image-url" }),
  //     }
  //   );
  // });
  
  
  // it("displays error when image upload fails", async () => {
  //   const events = [
  //     { id: "1", title: "Event 1", organizerName: "Test User", imageUrl: "", availableTickets: 50 },
  //   ];
  
  //   // Mock the upload image function to reject with an error
  //   const mockUploadImage = jest.fn().mockRejectedValue(new Error("Upload failed"));
  
  //   // Mock the useImageUpload hook
  //   mockUseImageUpload.mockReturnValueOnce({
  //     imagePreview: "preview-url",
  //     uploading: false,
  //     uploadImage: mockUploadImage,
  //     fileInputRef: { current: document.createElement('input') }, // mock file input
  //     handleFileChange: jest.fn(),
  //     handleDivClick: jest.fn(),
  //     setImagePreview: jest.fn(),
  //   });
  
  //   // Mock fetch call for fetching events
  //   fetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: jest.fn().mockResolvedValue(events),
  //   });
  
  //   // Render the component
  //   await act(async () => {
  //     render(<EventManagementMainContent />);
  //   });
  
  //   // Simulate clicking the camera button to open modal
  //   const cameraButton = screen.getByTestId("management-event-upload-image");
  //   fireEvent.click(cameraButton);
  
  //   // Ensure modal opened
  //   expect(screen.getByText("Upload Image")).toBeInTheDocument();
  
  //   // Simulate clicking the Upload button without selecting a file
  //   const uploadButton = screen.getByText("Upload Image");
  //   await act(async () => {
  //     fireEvent.click(uploadButton);
  //   });
  
  //   // Ensure uploadImage was called and failed
  //   expect(mockUploadImage).toHaveBeenCalledTimes(1);
  
  //   // Check that error message is displayed
  //   expect(screen.getByText("Failed to update event image")).toBeInTheDocument();
  // });
  
});