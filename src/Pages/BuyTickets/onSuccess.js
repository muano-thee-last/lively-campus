import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SuccessPage.module.css';

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 4000);

    return () => clearTimeout(timer); // Clean up
  }, [navigate]);

  return (
    <div className={styles.successContainer}>
      <div className={styles.successMessage}>
        <h1>🎉 Purchase Successful!</h1>
        <p>Thank you for purchasing your ticket. You will be redirected to your dashboard shortly.</p>
      </div>
    </div>
  );
};

export default SuccessPage;
