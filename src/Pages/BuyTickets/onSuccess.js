/* eslint-disable */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SuccessPage.module.css';
import { useSearchParams } from "react-router-dom";


var ticketCode;

function updateTicketsAvailable(eventId){

  fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/decrementAvailableTickets', {
    method : 'PUT',
    headers : {
      'Content-Type' : 'application/json',
    },
    body : JSON.stringify({'eventId' :eventId})
  })


}

function incrementTicketSalse(eventId){

  fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/incrementTicketSales', {
    method : 'POST',
    headers : {
      'Content-Type': 'application/json'
    }, 
    body : JSON.stringify({'eventId' : eventId})
})
}


async function setTicketCode() {
  try {
      const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/uniqueCode');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      //console.log('Unique Code:', data.uniqueString);
      return data.uniqueString;
  } catch (error) {
      console.error('Error fetching unique code:', error);
  }
}


async function uploadTicketInformation(eventId, price) {
    ticketCode = await setTicketCode();
    const userId = sessionStorage.getItem("uid");
  
    const data = {
      userId: userId,
      eventId: eventId,
      ticketCode: ticketCode,
      purchaseDate: "27 September 2024",
      price: price
    };
    try {
      const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/addTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

    }catch(e){
      console.log(e);
    }
  
  }
  


const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const externalId = searchParams.get("externalId");  // Retrieve externalId from URL
  console.log(externalId)
  alert(externalId);


  const id = externalId.uid;


  console.log(JSON.parse(externalId).id)

  uploadTicketInformation(id, 200);

  updateTicketsAvailable(id);
  incrementTicketSalse(id);


//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigate('/ticket-history');
//     }, 4000);

//     return () => clearTimeout(timer); // Clean up
//   }, [navigate]);

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
