import { renderHook, act } from '@testing-library/react-hooks';
import useImageUpload from './useImageUpload';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

describe('useImageUpload', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useImageUpload());

    expect(result.current.image).toBeNull();
    expect(result.current.imagePreview).toBeNull();
    expect(result.current.uploading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  it('should handle file change', () => {
    const { result } = renderHook(() => useImageUpload());

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } };

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(result.current.image).toBe(file);
    expect(result.current.imagePreview).toBeTruthy();
  });

  it('should upload image successfully', async () => {
    const mockUrl = 'https://example.com/image.jpg';
    ref.mockReturnValue({});
    uploadBytes.mockResolvedValue({});
    getDownloadURL.mockResolvedValue(mockUrl);

    const { result } = renderHook(() => useImageUpload());

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    act(() => {
      result.current.handleFileChange({ target: { files: [file] } });
    });

    let uploadedUrl;
    await act(async () => {
      uploadedUrl = await result.current.uploadImage();
    });

    expect(uploadedUrl).toBe(mockUrl);
    expect(result.current.uploading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  it('should handle upload error', async () => {
    const mockError = new Error('Upload failed');
    ref.mockReturnValue({});
    uploadBytes.mockRejectedValue(mockError);

    const { result } = renderHook(() => useImageUpload());

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    act(() => {
      result.current.handleFileChange({ target: { files: [file] } });
    });

    let uploadedUrl;
    await act(async () => {
      uploadedUrl = await result.current.uploadImage();
    });

    expect(uploadedUrl).toBeNull();
    expect(result.current.uploading).toBeFalsy();
    expect(result.current.error).toBe('Failed to upload image. Please try again.');
  });
});
