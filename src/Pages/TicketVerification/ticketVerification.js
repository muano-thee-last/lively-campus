import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLocation } from "react-router-dom";
import "./ticketVerification.css";

export default function TicketVerification() {
  const [ticket, setTicket] = useState(null);
  const [ticketNum, setTicketNum] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [ticketUsed, setTicketUsed] = useState(false);
  const scannerRef = useRef(null);
  const location = useLocation();

  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      ticketCode: searchParams.get("ticketCode") || "",
    };
  };

  useEffect(() => {
    const { ticketCode } = getQueryParams();
    if (ticketCode) {
      setTicketNum(ticketCode);
      verifyTicket(ticketCode);
    }
  }, [location.search]);

  useEffect(() => {
    return () => {
      if (scannerRef.current) scannerRef.current.clear();
    };
  }, []);

  const startScanner = () => {
    setIsCameraActive(true);
  
    setTimeout(() => {
      const readerElement = document.getElementById("reader");
      if (readerElement) {
        const scanner = new Html5QrcodeScanner("reader", {
          qrbox: { width: 250, height: 250 },
          fps: 5,
        });
        scannerRef.current = scanner;
        scanner.render(onScanSuccess, onScanError);
      } else {
        console.error("Element with id 'reader' not found");
      }
    }, 0); // Adjust the delay if necessary
  };
  
  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      setIsCameraActive(false);
    }
  };

  const onScanSuccess = (decodedText) => {
    stopScanner();
    setTicketNum(decodedText);
    verifyTicket(decodedText);
  };

  const onScanError = (error) => console.warn("QR Code scanning error:", error);

  const handleInputChange = (event) => setTicketNum(event.target.value);

  const verifyTicket = async (code) => {
    setIsLoading(true);
    setStatusMessage("");
    setTicket(null);

    try {
      const response = await fetch(
        `https://us-central1-witslivelycampus.cloudfunctions.net/app/verifyTicket?ticketCode=${code}`
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data && data.ticketCode === code) {
        if (data.isUsed) {
          setTicketUsed(true);
        } else {
          await markTicketAsUsed(data.ticketCode);
        }
        setTicket({
          price: `R${data.price}`,
          purchaseDate: new Date(data.purchaseDate).toLocaleString(),
          code: data.ticketCode,
          event: data.eventTitle,
        });
        setStatusMessage("Valid");
      } else {
        setStatusMessage("Not valid");
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
      setStatusMessage("Unable to verify ticket. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const markTicketAsUsed = async (ticketCode) => {
    try {
      const response = await fetch(
        "https://us-central1-witslivelycampus.cloudfunctions.net/app/changeTicketStatus",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketCode }),
        }
      );

      if (!response.ok) throw new Error("Failed to update ticket status");
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
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
        <button onClick={() => verifyTicket(ticketNum)} disabled={isLoading} className="verify-button">
          {isLoading ? "Verifying..." : "Verify"}
        </button>
        <button onClick={() => (isCameraActive ? stopScanner() : startScanner())} className="camera-button">
          {isCameraActive ? "Stop Camera" : "📷"}
        </button>
      </div>

      {isCameraActive && <div id="reader" className="camera-container"></div>}

      {statusMessage && (
        <div className={`alert ${statusMessage === "Valid" ? "success" : "error"}`}>
          <strong>{statusMessage === "Valid" ? "Success:" : "Error:"}</strong> {statusMessage}
        </div>
      )}

      {ticketUsed && (
        <div className="alert error">
          <p>Ticket already used</p>
        </div>
      )}

      {ticket && statusMessage === "Valid" && (
        <div className="ticket-info">
          <h3>Ticket Information</h3>
          <p><strong>Event:</strong> {ticket.event}</p>
          <p><strong>Price:</strong> {ticket.price}</p>
          <p><strong>Purchase Date:</strong> {ticket.purchaseDate}</p>
          <p><strong>Code:</strong> {ticket.code}</p>
        </div>
      )}
    </div>
  );
}
