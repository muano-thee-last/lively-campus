/* eslint-disable */

import React, { useState, useEffect } from 'react';
import './BuyTickets.css';
import applePayLogo from '../../asserts/apple-pay.jpg';
import googlePayLogo from '../../asserts/google-pay.webp';
import samsungPayLogo from '../../asserts/samsung-pay.webp';
import cardPaymentLogo from '../../asserts/card-payment.png';
import kuduBucksLogo from '../../asserts/logo.png';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, update } from 'firebase/database';

var ticketCode;

function updateTicketsAvailable(eventId){

  fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/decrementAvailableTickets', {
    method : 'PUT',
    headers : {
      'Content-Type' : 'application/json',
    },
    body : JSON.stringify({'eventId' :eventId})
  })

  //after increment ticket purchases for the event

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
    purchaseDate: "17 September 2024",
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

    




function BuyTickets({ event, onClose }) {
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Google Pay');
  const [devicePaymentMethod, setDevicePaymentMethod] = useState('Google Pay');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [icamNumber, setIcamNumber] = useState('');
  const [googleInfo, setGoogleInfo] = useState('');
  const [email, setEmail] = useState('');
  const [availableTickets, setAvailableTickets] = useState(event?.availableTickets || 0);


  useEffect(() => {
    // Set device-specific payment method
    if (window.ApplePaySession) {
      setDevicePaymentMethod('Apple Pay');
    } else if (window.SamsungPay) {
      setDevicePaymentMethod('Samsung Pay');
    } else {
      setDevicePaymentMethod('Google Pay');
    }

    // Fetch current user's email
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        setGoogleInfo('Google Pay linked');
      }
    });

    // Update available tickets if event data changes
    if (event) {
      setAvailableTickets(event.availableTickets);
    }
  }, [event]);

  const handlePaymentMethodClick = (method) => {
    setPaymentMethod(method);
  };

  const sendConfirmationEmail = (paymentDetails) => {
    if (!email) {
      alert('Email is not available.');
      return;
    }


    fetch('http://localhost:3001/send-confirmation-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        ticketCode: ticketCode,
        paymentDetails: {
          ...paymentDetails,
          eventTitle: event.title, 
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('There was an error sending the confirmation email.');
      });
  };




  const handleBuyTickets = async () => {
    if (paymentMethod === 'Card Payment') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
        alert('Please fill in all card details');
        return;
      }
    } else if (paymentMethod === 'KuduBucks') {
      if (!icamNumber) {
        alert('Please enter your ICAM number');
        return;
      }
    } else if (paymentMethod === 'Google Pay') {
      if (!googleInfo) {
        alert('Google Pay information missing.');
        return;
      }
    } else if (paymentMethod !== devicePaymentMethod) {
      alert('Please select a valid payment method');
      return;
    }

    if (ticketCount > availableTickets) {
      alert('Not enough tickets available');
      return;
    }

    <img src={kuduBucksLogo} alt="KuduBucks" className="payment-logo" />


    const paymentDetails = {
      amount: `R${ticketCount * event.ticketPrice}`,
      date: new Date().toLocaleString(),
      method: paymentMethod,
    };

    const db = getDatabase();
    const eventRef = ref(db, `events/${event.id}`);
    const newAvailableTickets = availableTickets - ticketCount;

    update(eventRef, {
      availableTickets: newAvailableTickets,
    }).then(() => {
      setAvailableTickets(newAvailableTickets);
      alert('Payment processed successfully! Tickets have been purchased.');

      sendConfirmationEmail(paymentDetails);
      console.log(event);
      updateTicketsAvailable(event.id);
      incrementTicketSalse(event.id);
      uploadTicketInformation(event.id, event.ticketPrice);
      uploadTicketInformation("userif", event.id, )
      onClose(); 
    }).catch((error) => {
      console.error('Error updating available tickets:', error);
    });
  };

  if (!event) {
    return <p>Loading event details...</p>;
  }

//  function uploadTicketInformation(userId, eventId, ticketCode, purchaseDate, price){



  return (
    <div className="buy-tickets-modal">
      <h2>Purchase Tickets for {event.title}</h2>

      <div className="ticket-selection">
        <label htmlFor="ticketCount">Number of Tickets:</label>
        <input
          type="number"
          id="ticketCount"
          value={ticketCount}
          min="1"
          max={availableTickets}
          onChange={(e) => setTicketCount(Math.max(1, Math.min(parseInt(e.target.value) || 1, availableTickets)))}
        />
      </div>

      <div className="payment-method-selection">
        <label>Select Payment Method:</label>
        <ul className="payment-method-options">
          <li
            className={`payment-option ${paymentMethod === 'Card Payment' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodClick('Card Payment')}
          >
            <img src={cardPaymentLogo} alt="Card Payment" className="payment-logo" />
            <span>Card Payment</span>
          </li>
          <li
            className={`payment-option ${paymentMethod === 'KuduBucks' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodClick('KuduBucks')}
          >
            <img src={kuduBucksLogo} alt="KuduBucks" className="payment-logo" />
            <span>KuduBucks</span>
          </li>
          {devicePaymentMethod === 'Apple Pay' && (
            <li
              className={`payment-option ${paymentMethod === 'Apple Pay' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodClick('Apple Pay')}
            >
              <img src={applePayLogo} alt="Apple Pay" className="payment-logo" />
              <span>Apple Pay</span>
            </li>
          )}
          {devicePaymentMethod === 'Samsung Pay' && (
            <li
              className={`payment-option ${paymentMethod === 'Samsung Pay' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodClick('Samsung Pay')}
            >
              <img src={samsungPayLogo} alt="Samsung Pay" className="payment-logo" />
              <span>Samsung Pay</span>
            </li>
          )}
          {devicePaymentMethod === 'Google Pay' && (
            <li
              className={`payment-option ${paymentMethod === 'Google Pay' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodClick('Google Pay')}
            >
              <img src={googlePayLogo} alt="Google Pay" className="payment-logo" />
              <span>Google Pay</span>
            </li>
          )}
        </ul>
      </div>

      {paymentMethod === 'Card Payment' && (
        <div className="card-details">
          <input
            type="text"
            placeholder="Card Number"
            value={cardDetails.number}
            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
          />
          <input
            type="text"
            placeholder="Expiry Date"
            value={cardDetails.expiry}
            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
          />
          <input
            type="text"
            placeholder="CVC"
            value={cardDetails.cvc}
            onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
          />
        </div>
      )}

      {paymentMethod === 'KuduBucks' && (
        <div className="kudubucks-details">
          <input
            type="text"
            placeholder="ICAM Number"
            value={icamNumber}
            onChange={(e) => setIcamNumber(e.target.value)}
          />
        </div>
      )}

      {paymentMethod === 'Google Pay' && (
        <div className="google-pay-details">
          <input
            type="text"
            placeholder="Google Pay Information"
            value={googleInfo}
            onChange={(e) => setGoogleInfo(e.target.value)}
          />
        </div>
      )}

      <p className="total-price">Total: R{ticketCount * event.ticketPrice}</p>

      <button
        className="confirm-purchase-button"
        onClick={handleBuyTickets}
        disabled={!paymentMethod || !email}
      >
        Confirm Purchase
      </button>
    </div>
  );
}

export default BuyTickets;
