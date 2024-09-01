import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from "./config";
import {

    isSignInWithEmailLink,
    signInWithEmailLink
} from "firebase/auth";
import createNewUser from "./createNewUser";

async function checkUserExistsAlready(email) {
    const url = `https://example.org/verifyUserEmail?email=${encodeURIComponent(email)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

        //if json.message doesnt exist, that means there's no user with corresponding email.
        //create a new user
        if (json.message) {
            return false;
        } else {
            return true;
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}



function VerifyEmail() {
    const [verificationStatus, setVerificationStatus] = useState('Verifying your email...');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyEmail = async () => {
            if (isSignInWithEmailLink(auth, window.location.href)) {
                let email = window.localStorage.getItem('emailForSignIn');


                //check if email exists in the database

                if (!email) {
                    email = window.prompt('Please provide your email for confirmation');
                }




                if (email) {
                    try {
                        await signInWithEmailLink(auth, email, window.location.href).then((result) => {

                            console.log(result);


                            console.log("check not existing users is ",!checkUserExistsAlready(email));
                            console.log("check existing users is ",checkUserExistsAlready(email));
                            let res = checkUserExistsAlready(email);
                            if (res) {
                                const userResponse = window.confirm("You dont have an account yet, press okay to create a new one");

                                if (userResponse) {

                                    //create a new user
                                    createNewUser(result);

                                } else {
                                    //goback to landing page
                                    navigate('/');
                                }


                            };


                        }

                        );
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