import { useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "witslivelycampus.firebaseapp.com",
  databaseURL: "https://witslivelycampus-default-rtdb.firebaseio.com",
  projectId: "witslivelycampus",
  storageBucket: "witslivelycampus.appspot.com",
  messagingSenderId: "61229245877",
  appId: "1:61229245877:web:44c304d1f7eed94b9065fc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

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
      console.error('Error uploading image:', uploadError);
      setError('Failed to upload image. Please try again.');
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
    uploadImage
  };
};
  
  export default useImageUpload;