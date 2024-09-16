import React from 'react';
import './TicketInfo.css'; 

const TicketInfo = ({ ticket }) => {
  // Check if ticket exists before rendering
  if (!ticket) {
    return <div className="ticket-info">No ticket information available</div>;
  }

  return (
    <div className="ticket-info">
      <div className="ticket-item">
        <strong>Ticket Price:</strong>
        <span>{ticket.price}</span>
      </div>
      <div className="ticket-item">
        <strong>Purchase Date:</strong>
        <span>{ticket.purchaseDate}</span>
      </div>
      <div className="ticket-item">
        <strong>Ticket Code:</strong>
        <span>{ticket.code}</span>
      </div>
    </div>
  );
};

export default TicketInfo;
