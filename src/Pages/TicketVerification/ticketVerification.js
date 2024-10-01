import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import "./ticketVerification.css";

export default function TicketVerification() {
  const [ticket, setTicket] = useState(null);
  const [ticketNum, setTicketNum] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleInputChange = (event) => {
    setTicketNum(event.target.value);
  };

  const verifyTicket = (code) => {
    setIsLoading(true);
    setError("");

    fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/verifyTicket?ticketCode=${code}`)
      .then((response) => {
        setIsLoading(false);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const ticketData = {
          price: `R${data.price}`,
          purchaseDate: data.purchaseDate,
          code: data.ticketCode,
        };
        setTicket(ticketData);
      })
      .catch((error) => {
        console.error("Error fetching ticket:", error);
        setError("Unable to verify ticket. Please try again.");
        setTicket(null);
        setIsLoading(false);
      });
  };

  const handleScan = (data) => {
    if (data) {
      setTicketNum(data);
      verifyTicket(data);
      setIsCameraActive(false);
    }
  };

  const handleError = (error) => {
    console.error(error);
    setError("Error accessing camera. Please try manual input.");
  };

  return (
    <div className="ticket-verification-container">
      <h2>Ticket Verification</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter ticket code"
          value={ticketNum}
          onChange={handleInputChange}
          className="input"
        />
        <button
          onClick={() => verifyTicket(ticketNum)}
          disabled={isLoading}
          className="button"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
        <button
          onClick={() => setIsCameraActive(!isCameraActive)}
          className="button camera-button"
        >
          📷
        </button>
      </div>

      {isCameraActive && (
        <div className="camera-container">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {ticket && (
        <div className="ticket-info">
          <h3>Ticket Information</h3>
          <p>Price: {ticket.price}</p>
          <p>Purchase Date: {ticket.purchaseDate}</p>
          <p>Code: {ticket.code}</p>
        </div>
      )}
    </div>
  );
}