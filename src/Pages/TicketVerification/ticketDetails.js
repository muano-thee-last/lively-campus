import React from 'react';
import './TicketInfo.css'; 

const TicketInfo = ({ ticket }) => {
  if (!ticket) {
    return <div className="ticket-info empty">No ticket information available</div>;
  }


  return (
    <div className="ticket-info">
      <h2 className="ticket-header">Ticket Details</h2>
      <div className="ticket-item">
        <strong>Bought By:</strong>
        <span>{ticket.userName}</span>
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
