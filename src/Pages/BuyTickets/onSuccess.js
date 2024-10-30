/* eslint-disable */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SuccessPage.module.css';
import { useSearchParams } from "react-router-dom";

var ticketCode;

async function updateTicketsAvailable(eventId) {
  try {
    await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/decrementAvailableTickets', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId })
    });
  } catch (error) {
    console.error('Error updating tickets:', error);
  }
}

async function incrementTicketSalse(eventId) {
  try {
    await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/incrementTicketSales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId })
    });
  } catch (error) {
    console.error('Error incrementing ticket sales:', error);
  }
}

async function setTicketCode() {
  try {
    const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/uniqueCode');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.uniqueString;
  } catch (error) {
    console.error('Error fetching unique code:', error);
  }
}

async function uploadTicketInformation(eventId, price) {
  try {
    ticketCode = await setTicketCode();
    const userId = sessionStorage.getItem("uid");
  
    const data = {
      userId,
      eventId,
      ticketCode,
      purchaseDate: new Date().toLocaleDateString(),
      price
    };

    const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/addTicket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error uploading ticket info:', error);
  }
}

const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const externalId = searchParams.get("externalId");

  let id;
  try {
    id = JSON.parse(externalId).id;
  } catch (error) {
    console.error("Invalid externalId format:", error);
    return null;
  }

  useEffect(() => {
    const handlePurchase = async () => {
      await uploadTicketInformation(id, 200);
      await updateTicketsAvailable(id);
      await incrementTicketSalse(id);
      navigate('/ticket-history'); 
    };

    if (id) {
      handlePurchase();
    }
  }, [id, navigate]); 

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
