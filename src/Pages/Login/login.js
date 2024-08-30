import React, { useEffect, useState } from "react";
import "./styles.css";
import Lgoogle from "../../asserts/google.jpeg";
import Linsta from "../../asserts/instagram.jpeg";
import Lx from "../../asserts/twitter.png";
import Lface from "../../asserts/facebookLogo.png"

import { auth, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider } from "./config";
import { signInWithPopup, isSignInWithEmailLink, signInWithEmailLink, sendSignInLinkToEmail } from "firebase/auth";

console.log("API URL:", process.env.REACT_APP_FIREBASE_API_KEY);
console.log("Environment Variables:", process.env);


const Authenticate = (platform, email = null) => {
  if (platform === "Google") {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        handleSignIn(result, "Google");
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error);
      });
  } else if (platform === "Instagram") {
    console.log("Instagram sign-in logic not implemented.");
  } else if (platform === "Twitter") {
    const provider = new TwitterAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        handleSignIn(result, "Twitter");
      })
      .catch((error) => {
        console.error("Error signing in with Twitter:", error);
      });
  } else if (platform === "Facebook") {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        handleSignIn(result, "Facebook");
      })
      .catch((error) => {
        console.error("Error signing in with Facebook:", error);
      });
  } else if (platform === "Email") {
    if (email && isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          handleSignIn(result, "Email");
        })
        .catch((error) => {
          console.error("Error signing in with email link:", error);
        });
    } else {
      console.log("Email sign-in link not detected.");
    }
  }
};

const handleSignIn = async (result, platform) => {
  const userID = result.user.uid;
  const user = {
    UserID: userID,
    FirstName: result.user.displayName,
    LastName: result.user.displayName,
    profile_picture: result.user.photoURL,
    Email: result.user.email,
  };

  const url = `https://us-central1-witslivelycampus.cloudfunctions.net/app/users/${userID}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const existingUser = await response.json();

    if (existingUser.error) {
      const createUserUrl =
        "https://us-central1-witslivelycampus.cloudfunctions.net/app/users";
      await fetch(createUserUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      alert("Account successfully created");
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

function SignIn() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }
      setEmail(emailForSignIn);
      Authenticate("Email", emailForSignIn);
    }
  }, []);

  const handleEmailInput = (event) => {
    setEmail(event.target.value);
  };

  const handleEmailSignIn = () => {
    const actionCodeSettings = {
      url: 'https://witslivelycampus.firebaseapp.com',
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.example.ios'
      },
      android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
      },
      dynamicLinkDomain: 'witslivelycampus.firebaseapp.com'
    };
    
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
        console.log("Email sign-in link sent!");
        alert("A sign-in link has been sent to your email address.");
      })
      .catch((error) => {
        console.error("Error sending email sign-in link:", error);
        alert("There was an error sending the sign-in link. Please try again.");
      });
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-box">
        <button
          className="sign-in-button google"
          onClick={() => Authenticate("Google")}
        >
          <img src={Lgoogle} alt="Google Icon" className="options" />
          Continue with Google
        </button>
        <button
          className="sign-in-button instagram"
          onClick={() => Authenticate("Instagram")}
        >
          <img src={Linsta} alt="Instagram Icon" className="options" />
          Continue with Instagram
        </button>
        <button
          className="sign-in-button twitter"
          onClick={() => Authenticate("Twitter")}
        >
          <img src={Lx} alt="Twitter Icon" className="options" />
          Continue with Twitter
        </button>

        <button
          className="sign-in-button facebook"
          onClick={() => Authenticate("Facebook")}
        >
          <img src={Lface} alt="Facebook" className="options" />
          Continue with Facebook
        </button>

        <div className="or-divider">OR</div>

        <div className="EmailSignin">
          <p>Sign in with email</p>
          <input
            type="email"
            className="email-input"
            value={email}
            onChange={handleEmailInput}
          />
        </div>

        <button
          className="sign-in-button email"
          onClick={handleEmailSignIn}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

export default SignIn;