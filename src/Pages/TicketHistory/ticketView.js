import React, { useState } from 'react';
import TicketModal from './ticketModal';
import styles from './ticketView.module.css';

export default function TicketView({ eventName, ticketPrice, purchaseDate, ticketCode, venue, time, date, imageUrl }) {
  const [isModalOpen, setModalOpen] = useState(false);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.ticketContainer}>
      <img 
        src={imageUrl} 
        alt="event" 
        className={styles.image} 
      />
      <h2 className={styles.eventName}>{eventName}</h2>
      <div className={styles.detailsContainer}>
        <p className={styles.eventNamex}><strong>Location:</strong> {venue}</p>
        <p className={styles.eventNamex}><strong>Time:</strong> {time} {formatDate(date)}</p>
        <button onClick={handleOpenModal} className={styles.button}>
          View Ticket
        </button>
      </div>

      <TicketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        eventImage={imageUrl}
        eventName={eventName}
        eventDate={date}
        eventLocation={venue}
        studentNo="12345678"
        ticketNo={ticketCode}
        ticketDate={date}
        ticketTime={time}
        qrCode={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketCode}`}
      />
    </div>
  );
}