import { act, renderHook } from "@testing-library/react-hooks";
import useImageUpload from "./useImageUpload";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Mock Firebase storage functions
jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

// Mock storage object
jest.mock("../Login/config", () => ({
  storage: {}, // Mocked storage object from config
}));

describe("useImageUpload", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test

    // Mock global URL.createObjectURL for image preview generation
    global.URL.createObjectURL = jest.fn(() => "mocked-url");
  });

  afterEach(() => {
    // Clean up the mock after all tests
    jest.restoreAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useImageUpload());

    expect(result.current.image).toBeNull();
    expect(result.current.imagePreview).toBeNull();
    expect(result.current.uploading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should set image and image preview on file selection", () => {
    const { result } = renderHook(() => useImageUpload());
    const fakeFile = new File(["image content"], "example.png", {
      type: "image/png",
    });

    const event = {
      target: {
        files: [fakeFile],
      },
    };

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(result.current.image).toBe(fakeFile); // Image should be set
    expect(result.current.imagePreview).toBe("mocked-url"); // Image preview should be set to mocked URL
  });

  it("should call Firebase storage methods on image upload", async () => {
    const { result } = renderHook(() => useImageUpload());
    const fakeFile = new File(["image content"], "example.png", {
      type: "image/png",
    });

    const imageRef = {}; // Mock the reference object
    ref.mockReturnValue(imageRef); // Mock ref function to return the image reference
    uploadBytes.mockResolvedValue({}); // Mock uploadBytes to resolve successfully
    getDownloadURL.mockResolvedValue("https://example.com/fake-url"); // Mock getDownloadURL to return a fake URL

    act(() => {
      result.current.handleFileChange({ target: { files: [fakeFile] } });
    });

    await act(async () => {
      const url = await result.current.uploadImage();
      expect(ref).toHaveBeenCalledWith({}, `images/${fakeFile.name}`); // Check ref is called with correct path
      expect(uploadBytes).toHaveBeenCalledWith(imageRef, fakeFile); // Check uploadBytes is called with the image reference and file
      expect(getDownloadURL).toHaveBeenCalledWith(imageRef); // Check getDownloadURL is called with the image reference
      expect(url).toBe("https://example.com/fake-url"); // The URL should match the mocked one
    });
  });

  it("should handle upload error", async () => {
    const { result } = renderHook(() => useImageUpload());
    const fakeFile = new File(["image content"], "example.png", {
      type: "image/png",
    });

    ref.mockReturnValue({}); // Mock the reference object
    uploadBytes.mockRejectedValue(new Error("Upload failed")); // Mock uploadBytes to throw an error

    act(() => {
      result.current.handleFileChange({ target: { files: [fakeFile] } });
    });

    await act(async () => {
      const url = await result.current.uploadImage();
      expect(url).toBeNull(); // Image upload should fail, so URL is null
      expect(result.current.error).toBe(
        "Failed to upload image. Please try again."
      ); // Error message should be set
    });
  });

  it("should update uploading state during image upload", async () => {
    const { result, waitFor } = renderHook(() => useImageUpload());
    const fakeFile = new File(["image content"], "example.png", {
      type: "image/png",
    });

    ref.mockReturnValue({}); // Mock the reference object
    uploadBytes.mockResolvedValue({}); // Mock uploadBytes to resolve successfully
    getDownloadURL.mockResolvedValue("https://example.com/fake-url"); // Mock getDownloadURL to return a fake URL

    act(() => {
      result.current.handleFileChange({ target: { files: [fakeFile] } });
    });

    await act(async () => {
      const uploadPromise = result.current.uploadImage();
      await waitFor(() => expect(result.current.uploading).toBe(true)); // Wait for uploading to be set to true
      await uploadPromise;
    });

    // Add this line to wait for state updates
    await waitFor(() => expect(result.current.uploading).toBe(false));
    expect(result.current.uploading).toBe(false); // Should set uploading to false after upload is complete
  });
});
