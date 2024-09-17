import React from 'react';

function TicketView({ eventName, ticketPrice, purchaseDate, ticketCode }) {
  return (
    <div style={styles.ticketContainer}>
      <h2 style={styles.eventName}>{eventName}</h2>
      <div style={styles.detailsContainer}>
        <p><strong>Ticket Price:</strong> ${ticketPrice}</p>
        <p><strong>Purchase Date:</strong> {new Date(purchaseDate).toLocaleDateString()}</p>
        <p><strong>Ticket Code:</strong> {ticketCode}</p>
      </div>
    </div>
  );
}

const styles = {
  ticketContainer: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '400px',
    margin: '20px auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  eventName: {
    fontSize: '1.5rem',
    textAlign: 'center',
    marginBottom: '20px',
  },
  detailsContainer: {
    fontSize: '1rem',
    marginBottom: '20px',
  }
};

export default TicketView;
