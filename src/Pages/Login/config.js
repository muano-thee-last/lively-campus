  import { initializeApp } from "firebase/app";
  import { getAuth, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider } from "firebase/auth";
  import { getFirestore } from "firebase/firestore";

  let app, auth, db;

  async function initializeFirebase() {
    try {

      const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY , 
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
    }
  }

  initializeFirebase();

  export { auth, db, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider };
