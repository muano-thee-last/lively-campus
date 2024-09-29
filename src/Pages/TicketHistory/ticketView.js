/* eslint-disable */

import React, { useState } from 'react';
import TicketModal from './ticketModal';
import styles from './ticketView.module.css'; // Import the CSS module
import location_icon from '../../asserts/location_icon.jpg'
import calender_icon from '../../asserts/calender_icon.jpg'
function TicketView({ eventName, ticketPrice, purchaseDate, ticketCode, venue, time, date, imageUrl }) {
  const [isModalOpen, setModalOpen] = useState(false);

  function formatDate(dateString) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Parse the date string into a Date object
    const date = new Date(dateString);
  
    // Extract the day, month, and year
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    // Return the formatted date
    return `${day} ${month} ${year}`;
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
        <div className='line'>
        <p className={styles.eventNamex}><strong>Location:</strong> {venue}</p>
        </div>
        <div className='line'>
        <p className={styles.eventNamex}><strong>Time:</strong> {time} {formatDate(date)}</p>

        </div>
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

export default TicketView;
