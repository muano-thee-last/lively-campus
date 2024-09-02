import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./styles.css";
import Lgoogle from '../../asserts/google.jpeg';
import Linsta from '../../asserts/instagram.jpeg';
import Lx from '../../asserts/twitter.png';
import Lface from '../../asserts/facebookLogo.png'; 
import { auth, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider } from "./config";
import { 
  signInWithPopup, 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  sendSignInLinkToEmail 
} from "firebase/auth";

const Authenticate = (platform, email = null, navigate) => {
  if (platform === "Google") {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        handleSignIn(result, "Google", navigate); // Pass navigate here
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error);
      });
  } else if (platform === "Instagram") {
    console.log("Instagram authentication is not yet implemented.");
  } else if (platform === "Twitter") {
    const provider = new TwitterAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        handleSignIn(result, "Twitter", navigate); // Pass navigate here
      })
      .catch((error) => {
        console.error("Error signing in with Twitter:", error);
      });
  } else if (platform === "Facebook") {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        handleSignIn(result, "Facebook", navigate); // Pass navigate here
      })
      .catch((error) => {
        console.error("Error signing in with Facebook:", error);
      });
  } else if (platform === "Email") {
    if (email && isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          handleSignIn(result, "Email", navigate); // Pass navigate here
        })
        .catch((error) => {
          console.error("Error signing in with email link:", error);
        });
    }
  }
};

const handleSignIn = async (result, platform, navigate) => {
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
      const createUserUrl = "https://us-central1-witslivelycampus.cloudfunctions.net/app/users";
      await fetch(createUserUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      alert("Account successfully created");
    } else {
      // Navigate to home page or dashboard
      navigate('/home'); //
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

function SignIn() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }
      if (emailForSignIn) {
        setEmail(emailForSignIn);
        Authenticate("Email", emailForSignIn, navigate);
      }
    }
  }, [navigate]);

  const handleEmailInput = (event) => {
    setEmail(event.target.value);
  };

  const sendEmailVerificationLink = () => {
    const actionCodeSettings = {
      url: `${window.location.origin}/verify-email`, 
      handleCodeInApp: true,
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
        setEmailSent(true);
        alert("Verification link sent to your email.");
      })
      .catch((error) => {
        console.error("Error sending email verification link:", error);
        alert("Failed to send email. Please try again.");
      });
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-box">
        <button
          className="sign-in-button google"
          onClick={() => Authenticate("Google", null, navigate)} // Pass navigate here
        >
          <img src={Lgoogle} alt="Google Icon" className="options" />
          Continue with Google
        </button>
        <button
          className="sign-in-button instagram"
          onClick={() => Authenticate("Instagram", null, navigate)} // Pass navigate here
        >
          <img src={Linsta} alt="Instagram Icon" className="options" />
          Continue with Instagram
        </button>
        <button
          className="sign-in-button twitter"
          onClick={() => Authenticate("Twitter", null, navigate)} // Pass navigate here
        >
          <img src={Lx} alt="Twitter Icon" className="options" />
          Continue with Twitter
        </button>
        <button
          className="sign-in-button facebook"
          onClick={() => Authenticate("Facebook", null, navigate)} // Pass navigate here
        >
          <img src={Lface} alt="Facebook Icon" className="options" />
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
            disabled={emailSent}
          />
        </div>

        <button
          className="sign-in-button email"
          onClick={sendEmailVerificationLink}
          disabled={emailSent}
        >
          {emailSent ? "Verification Email Sent" : "Send Verification Link"}
        </button>
      </div>
    </div>
  );
}

export default SignIn;
