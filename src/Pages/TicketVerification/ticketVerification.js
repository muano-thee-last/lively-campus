import React, { useState } from "react";
import "./ticketVerification.css";
import Header from "../dashboard/header";
import TicketInfo from "./ticketDetails";

function TicketVerification() {
  const [ticket, setTicket] = useState(null);
  const [ticketNum, setTicketNum] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleInputChange = (event) => {
    setTicketNum(event.target.value);
  };

  // Verify ticket function
  const verifyTicket = () => {
    setIsLoading(true);  // Start loading
    setError("");        // Clear any previous error

    fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/verifyTicket?ticketCode=${ticketNum}`)
      .then((response) => {
        setIsLoading(false); // Stop loading after getting a response
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const ticketData = {
          price: `$${data.price}`,       // Format price with $
          purchaseDate: data.purchaseDate,
          code: data.ticketCode,
        };
        setTicket(ticketData); // Update ticket state with fetched data
      })
      .catch((error) => {
        console.error("Error fetching ticket:", error);
        setError("Unable to verify ticket. Please try again.");
        setTicket(null); // Reset ticket data if error occurs
        setIsLoading(false); // Stop loading in case of an error
      });
  };

  return (
    <div>
      <Header />

      <input
        placeholder="Enter ticket code"
        className="input"
        id="ticketCode"
        value={ticketNum}
        onChange={handleInputChange}
      />
      
      <button 
        className="button" 
        onClick={verifyTicket} 
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>

      {error && <div className="error-message">{error}</div>} {/* Error message */}
      
      <TicketInfo ticket={ticket} />
    </div>
  );
}

export default TicketVerification;
