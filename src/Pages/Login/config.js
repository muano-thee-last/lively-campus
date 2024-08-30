  import { initializeApp } from "firebase/app";
  import { getAuth, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider } from "firebase/auth";
  import { getFirestore } from "firebase/firestore";

  let app, auth, db;
  const apiUrl = process.env.REACT_APP_FIREBASE_API_KEY; 
  const domain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN; 

  async function initializeFirebase() {
    try {

      const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
      };
      // Initialize Firebase
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      console.log("Firebase initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
    }
  }

  initializeFirebase();

  export { auth, db, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider };
