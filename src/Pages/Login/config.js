import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

async function getData() {
  const url = "https://us-central1-witslivelycampus.cloudfunctions.net/app/getEnvVar"; 
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json.value;
  } catch (error) {
    console.error(error.message);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

let app, auth, db;

async function initializeFirebase() {
  try {
    const key = await getData();
    console.log(key);

    const firebaseConfig = {
      apiKey: key,
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
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    // Handle the error appropriately (e.g., show an error message to the user)
  }
}

initializeFirebase();

export { auth, db, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider };