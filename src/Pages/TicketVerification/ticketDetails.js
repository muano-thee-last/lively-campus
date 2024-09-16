import React from 'react';
import './TicketInfo.css'; 

const TicketInfo = ({ ticket }) => {
  return (
    <div className="ticket-info">
      <div className="ticket-item">
        <strong>Ticket Buyer</strong>
        <span>{ticket.beyer}</span>
      </div>     <div className="ticket-item">
        <strong>Event Name:</strong>
        <span>{ticket.name}</span>
      </div>
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
