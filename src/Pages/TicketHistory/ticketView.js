import React from 'react';

function TicketView({ eventName, ticketPrice, purchaseDate, ticketCode }) {
  return (
    <div style={styles.ticketContainer}>
      <h2 style={styles.eventName}>{eventName}</h2>
      <div style={styles.detailsContainer}>
        <p style={styles.eventName}>R{ticketPrice}</p>
        <p style={styles.eventName}><strong>Purchase Date:</strong> {new Date(purchaseDate).toLocaleDateString()}</p>
        <p style={styles.eventName}><strong>Ticket Code:</strong> {ticketCode}</p>
        <img 
          style={styles.image}
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketCode}`} 
          alt={`QR code for ticket ${ticketCode}`}
        />
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
    color: 'black', 
  },
  detailsContainer: {
    fontSize: '1rem',
    marginBottom: '20px',
    color: 'black', 
  },
  image: {
    display: 'block',
    margin: '30px auto', // Centers the image horizontally
  }
};

export default TicketView;
