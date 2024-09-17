import React, { useState, useEffect } from 'react';
import TicketView from './ticketView';
import noTickets from './noTickets';
function TicketHistory() {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userID = sessionStorage.getItem('uid');

    fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/getTickets/${userID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setTicketDetails(data); // Set the array of tickets
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (ticketDetails.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {ticketDetails.map((ticket) => (
        <TicketView
          key={ticket.id}
          eventName={ticket.eventId || 'N/A'} // Adjust these fields based on your actual data
          ticketPrice={ticket.price}
          purchaseDate={ticket.purchaseDate}
          ticketCode={ticket.ticketCode}
        />
      ))}
    </div>
  );
}

export default TicketHistory;
