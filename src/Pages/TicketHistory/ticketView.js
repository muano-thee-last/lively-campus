import React, { useState } from 'react';

import TicketModal from './ticketModal';

function TicketView({ eventName, ticketPrice, purchaseDate, ticketCode, location, time, date, imageUrl }) {
  const [isModalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  console.log("location is ", location);
  console.log("date is ", date);

  const handleOpenModal = () => {
    setModalOpen(true);  // Open the modal when the button is clicked
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  return (
    <div style={styles.ticketContainer}>
      <img 
        src={imageUrl} 
        alt="event" 
        style={styles.image} // Added image styling if needed
      />
      <h2 style={styles.eventName}>{eventName}</h2>
      <div style={styles.detailsContainer}>
        <p style={styles.eventNamex}><strong>Location:</strong> {location}</p>
        <p style={styles.eventNamex}><strong>Time:</strong> {time} {date}</p>
        <button onClick={handleOpenModal} style={styles.button}>
          View Ticket
        </button>
      </div>

      {/* Render the TicketModal */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        eventImage={imageUrl}
        eventName={eventName}
        eventDate={date}
        eventLocation={location}
        studentNo="12345678"  // Replace with actual student number if needed
        ticketNo={ticketCode}
        ticketDate={date}
        ticketTime={time}
        qrCode={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketCode}`} // QR code
      />
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
    color: 'blue',
  },
  eventNamex: {
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
    width: '100%',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  button:{
    background: 'blue',
    color : 'white',   
    minWidth : '50px'
  }
};

export default TicketView;
