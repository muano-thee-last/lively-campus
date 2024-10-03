import React from "react";
import Modal from "react-modal";
import styles from "./ticketModel.module.css"; // Import CSS module
//Modal.setAppElement("#root");

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
  qrCode,
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
            <div className={styles.ticketHeader}>
              <h2>{eventName}</h2>
              <p>{`${new Date(eventDate).toLocaleDateString("en-UK", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })} ~ ${eventLocation}`}</p>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.titleInput}>
                <p>Student No</p> <h3>{studentNo}</h3>
              </div>
              <div className={styles.titleInput}>
                <p>Ticket Code</p> <h3>{ticketNo}</h3>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.titleInput}>
                <p>Date</p> <h3>{ticketDate}</h3>
              </div>
              <div className={styles.titleInput}>
                <p>Time</p> <h3>{ticketTime}</h3>
              </div>
            </div>

            <p>Scan QR code at the entrance</p>
            <div className={styles.qrCodeContainer}>
              <div className={styles.qrCode}>
                <img src={qrCode} alt="QR Code" />
              </div>
              <button className={styles.closeBtn} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TicketModal;
