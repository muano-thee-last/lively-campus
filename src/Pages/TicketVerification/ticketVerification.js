import React, { useState } from "react";
import "./ticketVerification.css";
import Header from "../dashboard/header";
import TicketInfo from "./ticketDetails";

function TicketVerification() {
  const [ticket, setTicket] = useState(null);
  const [ticketNum, setTicketNum] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    setTicketNum(event.target.value);
  };

  const verifyTicket = () => {
    setIsLoading(true); 
    setError("");        

    fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/verifyTicket?ticketCode=${ticketNum}`)
      .then((response) => {
        setIsLoading(false); 
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response.json)
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

  return (
    <div>
      <Header />
      <div className="main-container">
        <div className="container">
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
          {error && <div className="error-message">{error}</div>} 
          <TicketInfo ticket={ticket} />
        </div>
      </div>
    </div>
  );
}

export default TicketVerification;
