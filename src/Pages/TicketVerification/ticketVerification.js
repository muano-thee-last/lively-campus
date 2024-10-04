
import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import "./ticketVerification.css";

export default function TicketVerification() {
  const [ticket, setTicket] = useState(null);
  const [ticketNum, setTicketNum] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => setSuccess(""), 5000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  const handleInputChange = (event) => {
    setTicketNum(event.target.value);
  };

  const verifyTicket = async (code) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/verifyTicket?ticketCode=${code}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const ticketData = {
        price: `R${data.price}`,
        purchaseDate: new Date(data.purchaseDate).toLocaleString(),
        code: data.ticketCode,
      };
      setTicket(ticketData);
      setSuccess("Ticket verified successfully!");
    } catch (error) {
      console.error("Error fetching ticket:", error);
      setError("Unable to verify ticket. Please try again.");
      setTicket(null);
    } finally {
      setIsLoading(false);
    }
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
      <h2 className="title">Ticket Verification</h2>
      
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter ticket code"
          value={ticketNum}
          onChange={handleInputChange}
          className="input-field"
        />
        <button 
          onClick={() => verifyTicket(ticketNum)} 
          disabled={isLoading}
          className="verify-button"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
        <button 
          onClick={() => setIsCameraActive(!isCameraActive)}
          className="camera-button"
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
            constraints={{ facingMode: "environment" }}
          />
        </div>
      )}

      {error && (
        <div className="alert error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="alert success">
          <strong>Success:</strong> {success}
        </div>
      )}

      {ticket && (
        <div className="ticket-info">
          <h3>Ticket Information</h3>
          <p><strong>Price:</strong> {ticket.price}</p>
          <p><strong>Purchase Date:</strong> {ticket.purchaseDate}</p>
          <p><strong>Code:</strong> {ticket.code}</p>
        </div>
      )}
    </div>
  );
}