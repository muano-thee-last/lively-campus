import React, { useState } from "react";
import TicketModal from "./ticketModal";
import styles from "./ticketView.module.css";
import locationSVG from "../EventCreation/images-logos/location.svg";
import calendar from "../EventCreation/images-logos/calendar.svg";

export default function TicketView({
  eventName,
  ticketPrice,
  purchaseDate,
  ticketCode,
  venue,
  time,
  date,
  imageUrl,
  eventID
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const url = 'https://witslivelycampus.web.app/ticketVerification?ticketCode'+ticketCode;

  return (
    <div className={styles.ticketContainer}>
      <img src={imageUrl} alt="event" className={styles.image} style={{height: "230px"}} />
      <h2 className={styles.eventName}>{eventName}</h2>
      <div className={styles.detailsContainer}>
        <div className="icon-title-container">
          <img src={locationSVG} alt="location" className="icons" style={{height: "35px", color: "white"}} />
          <p className={styles.eventNamex}> {venue}</p>
        </div>
        <div className="icon-title-container">
          <img src={calendar} alt="calendar" className="icons" style={{height: "35px"}} />
          <p className={styles.eventNamex}>
            {time} {formatDate(date)}
          </p>
        </div>

        <button onClick={handleOpenModal} className={styles.buttonTicket}>
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
        qrCode={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`}
        eventId={eventID}
      />
    </div>
  );
}
