import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider } from "./config";
import { 
  signInWithPopup, 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  sendSignInLinkToEmail 
} from "firebase/auth";

  

function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] = useState('Verifying your email...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        
        if (email) {
          try {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            setVerificationStatus('Email verified successfully! Redirecting...');
            setTimeout(() => navigate('/home'), 2000); 
          } catch (error) {
            console.error("Error signing in with email link:", error);
            setVerificationStatus('Verification failed. Please try again.');
          }
        } else {
          setVerificationStatus('No email provided. Verification failed.');
        }
      } else {
        setVerificationStatus('Invalid verification link.');
      }
    };

    verifyEmail();
  }, [navigate, location]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-box">
        <h1>Email Verification</h1>
        <p>{verificationStatus}</p>
        {verificationStatus.includes('failed') && (
          <button onClick={() => navigate('/signin')} className="retry-button">
            Return to Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;