import './BuyTickets.css';
import React, { useState, useEffect } from 'react';
import applePayLogo from '../../asserts/apple-pay.jpg';
import googlePayLogo from '../../asserts/google-pay.webp';
import samsungPayLogo from '../../asserts/samsung-pay.webp';
import cardPaymentLogo from '../../asserts/card-payment.png';
import kuduBucksLogo from '../../asserts/logo.png';

function BuyTickets() {
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [devicePaymentMethod, setDevicePaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [icamNumber, setIcamNumber] = useState('');
  const [googleInfo, setGoogleInfo] = useState('');

  useEffect(() => {
    // Detect device payment method
    if (window.ApplePaySession) {
      setDevicePaymentMethod('Apple Pay');
    } else if (window.SamsungPay) {
      setDevicePaymentMethod('Samsung Pay');
    } else {
      setDevicePaymentMethod('Google Pay');
    }
  }, []);

  const handlePaymentMethodClick = (method) => {
    setPaymentMethod(method);
  };

  const handleBuyTickets = async () => {
    if (paymentMethod === 'Card Payment') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
        alert('Please fill in all card details');
        return;
      }
      // Process card payment
      alert('Processing card payment...');
    } else if (paymentMethod === 'KuduBucks') {
      if (!icamNumber) {
        alert('Please enter your ICAM number');
        return;
      }
      // Process KuduBucks payment
      alert(`Processing KuduBucks payment for ICAM: ${icamNumber}`);
    } else if (paymentMethod === 'Google Pay') {
      if (!googleInfo) {
        alert('Please enter your Google Pay information');
        return;
      }
      // Process Google Pay payment
      alert(`Processing Google Pay payment with info: ${googleInfo}`);
    } else if (paymentMethod === devicePaymentMethod) {
      // Handle device-specific payment logic here
      alert(`${devicePaymentMethod} selected`);
    } else {
      alert('Please select a payment method');
    }
  };

  return (
    <div className="buy-tickets-modal">
      <h2>Purchase Tickets</h2>

      <div className="ticket-selection">
        <label htmlFor="ticketCount">Number of Tickets:</label>
        <input
          type="number"
          id="ticketCount"
          value={ticketCount}
          min="1"
          onChange={(e) => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
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
            onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
          />
          <input
            type="text"
            placeholder="Expiry Date"
            value={cardDetails.expiry}
            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
          />
          <input
            type="text"
            placeholder="CVC"
            value={cardDetails.cvc}
            onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
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

      <button 
        className="confirm-purchase-button" 
        onClick={handleBuyTickets}
        disabled={!paymentMethod}
      >
        Confirm Purchase
      </button>

      <p className="total-price">Total: ${ticketCount * 100}</p>
    </div>
  );
}

export default BuyTickets;