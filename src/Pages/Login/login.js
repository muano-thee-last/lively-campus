import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        handleSignIn(result, "Google", navigate); 
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
        handleSignIn(result, "Twitter", navigate); 
      })
      .catch((error) => {
        console.error("Error signing in with Twitter:", error);
      });
  } else if (platform === "Facebook") {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        handleSignIn(result, "Facebook", navigate); 
      })
      .catch((error) => {
        console.error("Error signing in with Facebook:", error);
      });
  } else if (platform === "Email") {
    if (email && isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.setItem("res", JSON.stringify(result));
          console.log(result);
          handleSignIn(result, "Email", navigate);
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
      navigate('/home');
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

function SignIn() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      setIsVerifying(true);
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }
      if (emailForSignIn) {
        setEmail(emailForSignIn);
        Authenticate("Email", emailForSignIn, navigate);
      }
      setIsVerifying(false);
    }
  }, [navigate]);

  const handleEmailInput = (event) => {
    setEmail(event.target.value);
  };


  //goes to verify email
  const sendEmailVerificationLink = () => {
    setError(null);
    setIsSendingEmail(true);
    const actionCodeSettings = {
      url: `${window.location.origin}/verify-email`,
      handleCodeInApp: true,
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
        setEmailSent(true);
      })
      .catch((error) => {
        console.error("Error sending email verification link:", error);
        setError("Failed to send email. Please try again.");
      })
      .finally(() => {
        setIsSendingEmail(false);
      });
  };

  if (isVerifying) {
    return (
      <div className="sign-in-container">
        <div className="sign-in-box">
          <p>Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sign-in-container">
      <div className="sign-in-box">
        <button
          className="sign-in-button google"
          onClick={() => Authenticate("Google", null, navigate)} 
        >
          <img src={Lgoogle} alt="Google Icon" className="options" />
          Continue with Google
        </button>
        <button
          className="sign-in-button instagram"
          onClick={() => Authenticate("Instagram", null, navigate)} 
        >
          <img src={Linsta} alt="Instagram Icon" className="options" />
          Continue with Instagram
        </button>
        <button
          className="sign-in-button twitter"
          onClick={() => Authenticate("Twitter", null, navigate)} 
        >
          <img src={Lx} alt="Twitter Icon" className="options" />
          Continue with Twitter
        </button>
        <button
          className="sign-in-button facebook"
          onClick={() => Authenticate("Facebook", null, navigate)} 
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
            disabled={emailSent || isSendingEmail}
          />
        </div>

        <button
          className="sign-in-button email"
          onClick={sendEmailVerificationLink}
          disabled={emailSent || isSendingEmail}
        >
          {isSendingEmail ? "Sending..." : emailSent ? "Verification Email Sent" : "Send Verification Link"}
        </button>

        {error && <p className="error-message">{error}</p>}
        {emailSent && (
          <p className="success-message">
            A verification link has been sent to your email. Please check your inbox and click the link to sign in.
          </p>
        )}
      </div>
    </div>
  );
}

export default SignIn;