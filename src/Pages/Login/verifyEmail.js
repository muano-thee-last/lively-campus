import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./config";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import createNewUser from "./createNewUser";

async function checkUserExistsAlready(email) {
  const url = `https://us-central1-witslivelycampus.cloudfunctions.net/app/verifyUserEmail/?email=${encodeURIComponent(
    email
  )}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    return !json.message;
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
}

function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] = useState(
    "Verifying your email..."
  );
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");

        // Check if email exists in the database
        if (!email) {
          email = window.prompt("Please provide your email for confirmation");
        }

        if (email) {
          try {
            const result = await signInWithEmailLink(
              auth,
              email,
              window.location.href
            );
            const myUID = result.user.uid;

            sessionStorage.setItem("uid", myUID);

            const userExists = await checkUserExistsAlready(email);
            if (!userExists) {
              const userResponse = window.confirm(
                "You don't have an account yet, press okay to create a new one"
              );

              if (userResponse) {
                createNewUser(result);
                navigate("/dashboard");
              } else {
                // Go back to the landing page
                navigate("/");
              }
            }

            window.localStorage.removeItem("emailForSignIn");
            setVerificationStatus(
              "Email verified successfully! Redirecting..."
            );

            setTimeout(() => navigate("/Dashboard"), 2000);
          } catch (error) {
            console.error("Error signing in with email link:", error);
            setVerificationStatus("Verification failed. Please try again.");
          }
        } else {
          setVerificationStatus("No email provided. Verification failed.");
        }
      } else {
        setVerificationStatus("Invalid verification link.");
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-box">
        <h1>Email Verification</h1>
        <p>{verificationStatus}</p>
        {verificationStatus.includes("failed") && (
          <button onClick={() => navigate("/signin")} className="retry-button">
            Return to Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
