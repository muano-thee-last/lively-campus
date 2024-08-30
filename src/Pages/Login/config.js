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
  }
}


const key =  await getData();


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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider };
