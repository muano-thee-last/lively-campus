import React from 'react';
import Modal from 'react-modal';
import './eventCard.module.css'; // Custom CSS for styling the modal

// Set the app element for accessibility purposes
Modal.setAppElement('#root');

const TicketModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="ticket-modal"
      overlayClassName="overlay"
    >
      <div className="modal-content">
        <img
          src="https://example.com/event-image.jpg" 
          alt="Event"
          className="event-image"
        />
        <div className="ticket-details">
          <h2>BEER GARDEN</h2>
          <p>03 February 2025 ~ Wits Sturrock Park</p>

          <div className="info-row">
            <span><strong>Student no:</strong> 2583003</span>
            <span><strong>Ticket Number:</strong> 213463CS2</span>
          </div>

          <div className="info-row">
            <span><strong>Date:</strong> 03/02/2025</span>
            <span><strong>Time:</strong> 17:00</span>
          </div>

          <p>Scan QR code at the entrance</p>
          <div className="qr-code">
            <img
              src="https://example.com/qr-code.png" // replace with your QR code link
              alt="QR Code"
            />
          </div>

          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default TicketModal;
