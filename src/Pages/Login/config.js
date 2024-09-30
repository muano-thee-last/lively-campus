/* eslint-disable */
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { TextEncoder, TextDecoder } from 'text-encoding';

let auth, db, storage;

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
  }
}

async function initializeFirebase() {
  const apiKey = await getData();
  if (!apiKey) {
    console.error("API key could not be fetched.");
    return;
  }

  const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "witslivelycampus.firebaseapp.com",
    databaseURL: "https://witslivelycampus-default-rtdb.firebaseio.com",
    projectId: "witslivelycampus",
    storageBucket: "witslivelycampus.appspot.com",
    messagingSenderId: "61229245877",
    appId: "1:61229245877:web:44c304d1f7eed94b9065fc"
  };

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  console.log('Firebase initialized successfully');
}

initializeFirebase();

export { auth, db, GoogleAuthProvider, TwitterAuthProvider, storage };
