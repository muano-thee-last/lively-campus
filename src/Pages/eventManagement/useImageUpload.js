import { useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Pages/Login/config";

// Firebase configuration

const useImageUpload = () => {
  const [image, setImage] = useState(null); // State for the selected image file
  const [imagePreview, setImagePreview] = useState(null); // State for image preview URL
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  const uploadImage = async () => {
    if (!image) return null;

    const imageRef = ref(storage, `images/${image.name}`);
    setUploading(true);
    setError(null);

    try {
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);
      setError("Failed to upload image. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    image,
    imagePreview,
    uploading,
    error,
    setImagePreview,
    fileInputRef,
    handleFileChange,
    handleDivClick,
    uploadImage,
  };
};

export default useImageUpload;
