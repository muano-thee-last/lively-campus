// TicketModal.js
import React from 'react';
import Modal from 'react-modal';
import './ticketModel.module.css'
// Set the app element for accessibility purposes
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
      className="ticket-modal"
      overlayClassName="overlay"
    >
      <div className='contents'>
      <div className="modal-content">
        <img src={eventImage} alt="Event" className="event-image" />
        <div className="ticket-details">
          <h2>{eventName}</h2>
          <p>{`${eventDate} ~ ${eventLocation}`}</p>
          <div className="info-row">
            <span><strong>Student no:</strong> {studentNo}</span>
            <span><strong>Ticket Number:</strong> {ticketNo}</span>
          </div>
          <div className="info-row">
            <span><strong>Date:</strong> {ticketDate}</span>
            <span><strong>Time:</strong> {ticketTime}</span>
          </div>  
          <p>Scan QR code at the entrance</p>
          <div className="qr-code">
            <img src={qrCode} alt="QR Code" />
          </div>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
      </div>
    </Modal>
  );
};

export default TicketModal;  // Default export
