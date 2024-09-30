import React from 'react';
import Modal from 'react-modal';
import styles from './ticketModel.module.css'; // Import CSS module
Modal.setAppElement('#root');

const TicketModal = ({
  isOpen,
  onClose,
  eventImage,
  eventName,
  eventDate,
  eventLocation,
  studentNo,
  ticketNo,
  ticketDate,
  ticketTime,
  qrCode
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.ticketModal}
      overlayClassName={styles.overlay} // Apply styles from the CSS module
    >
      <div className={styles.contents}>
        <div className={styles.modalContent}>
          <img src={eventImage} alt="Event" className={styles.eventImage} />
          <div className={styles.ticketDetails}>
            <h2>{eventName}</h2>
            <p>{`${eventDate} ~ ${eventLocation}`}</p>
            <div className={styles.infoRow}>
              <span><strong>Student no:</strong> {studentNo}</span>
              <span><strong>Ticket Number:</strong> {ticketNo}</span>
            </div>
            <div className={styles.infoRow}>
              <span><strong>Date:</strong> {ticketDate}</span>
              <span><strong>Time:</strong> {ticketTime}</span>
            </div>
            <p>Scan QR code at the entrance</p>
            <div className={styles.qrCode}>
              <img src={qrCode} alt="QR Code" />
            </div>
            <button className={styles.closeBtn} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TicketModal;
