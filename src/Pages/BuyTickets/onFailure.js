import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FailurePage.module.css';

const FailurePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 4000);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.failureContainer}>
      <div className={styles.failureMessage}>
        <h1>😞 Purchase Failed!</h1>
        <p>Something went wrong. You will be redirected to your dashboard shortly.</p>
      </div>
    </div>
  );
};

export default FailurePage;
