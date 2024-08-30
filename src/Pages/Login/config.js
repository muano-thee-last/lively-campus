import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let app, auth, db;
const apiUrl = process.env.REACT_APP_API_URL; 

async function initializeFirebase() {
  try {

    const firebaseConfig = {
      apiKey: apiUrl, 
      authDomain: "witslivelycampus.firebaseapp.com",
      databaseURL: "https://witslivelycampus-default-rtdb.firebaseio.com",
      projectId: "witslivelycampus",
      storageBucket: "witslivelycampus.appspot.com",
      messagingSenderId: "61229245877",
      appId: "1:61229245877:web:44c304d1f7eed94b9065fc"
    };

    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    // You might want to handle the error more gracefully here, like showing a UI message
  }
}

// Call the function to initialize Firebase
initializeFirebase();

export { auth, db, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider };
