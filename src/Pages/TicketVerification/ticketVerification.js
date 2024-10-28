/* eslint-disable */
import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { useLocation } from "react-router-dom";
import "./ticketVerification.css";

export default function TicketVerification() {
  const [ticket, setTicket] = useState(null);
  const [ticketNum, setTicketNum] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [ticketUsed, setTicketused] = useState(false);
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

  const handleInputChange = (event) => {
    setTicketNum(event.target.value);
  };

  const verifyTicket = async (code) => {
    setIsLoading(true);
    setError("");
    setResult("");
    setTicket(null);

    try {
      const response = await fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/verifyTicket?ticketCode=${code}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();


      if (data && data.ticketCode === code) {

        if (data.isUsed == true) {
          setTicketused(true);
        }

        else{
          // call the api to mark it as used, so it cant be used twice  https://us-central1-witslivelycampus.cloudfunctions.net/app/changeTicketStatus
          // 
          /*  
        
            @params {
                ticketCode
              }

        */

              const changeStatus = fetch("https://us-central1-witslivelycampus.cloudfunctions.net/app/changeTicketStatus", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  "ticketCode": data.ticketCode
                })
              })
              .then(response => response.json())
              .then(data => console.log(data))
              .catch(error => console.error("Error:", error));
              

        }

        const ticketData = {
          price: `R${data.price}`,
          purchaseDate: new Date(data.purchaseDate).toLocaleString(),
          code: data.ticketCode,
          event: data.eventTitle,
        };
        setTicket(ticketData);
        setResult("Valid");
      } else {
        setResult("Not valid");
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
      setError("Unable to verify ticket. Please try again.");
      setResult("Not valid");
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

      {(result && !ticketUsed) && (
        <div className={`alert ${result === "Valid" ? "success" : "error"}`}>
          <strong>{result === "Valid" ? "Success:" : "Error:"}</strong> {result}
        </div>
      )}


      {(result && ticketUsed == true) && (
        <div className={`alert ${result === "Valid" ? "success" : "error"}`}>
          <p1>
            Ticket already used
          </p1>
        </div>
      )}


      {ticket && result === "Valid" && (
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
