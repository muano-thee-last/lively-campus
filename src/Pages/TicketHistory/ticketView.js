import React from 'react';

function TicketView({ eventName, ticketPrice, purchaseDate, ticketCode }) {
  return (
    <div style={styles.ticketContainer}>
      <h2 style={styles.eventName}>{eventName}</h2>
      <div style={styles.detailsContainer}>
        <p style={styles.ticketDetail}><strong>Price:</strong> R{ticketPrice}</p>
        <p style={styles.ticketDetail}>
          <strong>Purchase Date:</strong> {new Date(purchaseDate).toLocaleDateString()}
        </p>
        <p style={styles.ticketDetail}><strong>Ticket Code:</strong> {ticketCode}</p>
        <div style={styles.qrCodeContainer}>
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketCode}`} 
            alt={`QR code for ticket ${ticketCode}`}
            style={styles.qrCode}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  ticketContainer: {
    border: '1px solid #ddd',
    borderRadius: '15px',
    padding: '25px',
    maxWidth: '400px',
    width : '100%',
    margin: '30px auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fdfdfd',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  },
  eventName: {
    fontSize: '1.75rem',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0056b3', // Blue text for event name
    fontWeight: 'bold',
  },
  detailsContainer: {
    fontSize: '1rem',
    color: '#333',
    lineHeight: '1.6',
  },
  ticketDetail: {
    marginBottom: '15px',
    color: '#333',
  },
  qrCodeContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  qrCode: {
    width: '150px',
    height: '150px',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
};

export default TicketView;
