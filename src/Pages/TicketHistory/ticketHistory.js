import React, { useState, useEffect } from 'react';
import TicketView from './ticketView'; // Adjust the import path as needed
import './TicketHistory.css'; // Import the CSS file
import Header from "../dashboard/header"

function TicketHistory() {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userID = sessionStorage.getItem('uid');

    fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/getTicketsx/${userID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTicketDetails(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter tickets to exclude those with "Title not found"

  const validTickets = ticketDetails.filter(ticket => ticket.eventTitle !== 'Title not found');
  console.log(validTickets)

return (
  <div>
    <Header/>
    <div className="ticket-history">
      {validTickets.length > 0 ? (
        validTickets.map(ticket => (
          <div key={ticket.id}>
            <TicketView
              eventName={ticket.eventTitle || 'N/A'}
              ticketPrice={ticket.price}
              purchaseDate={ticket.purchaseDate}
              ticketCode={ticket.ticketCode}
            />
    
          </div>
        ))
      ) : (
        <h1>No tickets</h1>
      )}
    </div>
  </div>
);
}
export default TicketHistory;
