import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaTicketAlt } from 'react-icons/fa'; 
import './MainContent.css';
import BuyTickets from '../BuyTickets/BuyTickets';
import { Modal, Button } from '@mui/material'; 

function MainContent() {
  const { id } = useParams();  // Get event ID from URL parameters
  const [event, setEvent] = useState(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Fetch event details using Cloud Function
  useEffect(() => {
    fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${id}`)
      .then(response => response.json())
      .then(data => setEvent(data))
      .catch(error => console.error('Error fetching event details:', error));
  }, [id]);

  // Fetch Google Maps API key
  useEffect(() => {
    fetch("https://us-central1-witslivelycampus.cloudfunctions.net/app/getEnvgoogle")
      .then(response => response.json())
      .then(json => setGoogleMapsApiKey(json.value))
      .catch(error => console.error('Error fetching Google Maps API key:', error));
  }, []); 

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (!event || !googleMapsApiKey) return <p>Loading...</p>;

  return (
    <div className="view-more-details">
      <div className="event-image">
        <img src={event.imageUrl} alt={event.title} />
      </div>

      <div className="event-header">
        <h1>{event.title}</h1>
        <div className="event-tags">
          <span className="tag music">Music</span>
          <span className="tag age-restriction">18+</span>
        </div>
      </div>

      <div className="event-info">
        <div className="info-item"><FaMapMarkerAlt /> {event.location}</div>
        <div className="info-item"><FaCalendarAlt /> {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}</div>
        <div className="info-item"><FaUsers /> Capacity: {event.capacity}</div>
        <div className="info-item"><FaTicketAlt /> Available Tickets: {event.availableTickets}</div>
      </div>

      <div className="event-description">
        <h2>Description</h2>
        <p>{event.description}</p>
      </div>

      <div className="event-venue-location">
        <h2>Venue and Location</h2>
        <div className="map-container">
          <iframe
            title={`Map showing location of ${event.location}`}
            src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(event.location)}`}
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="event-footer">
        <p><strong>Ticket Price:</strong> R{event.ticketPrice}</p>
        <Button class="buy-ticket-button" variant="contained" color="primary" onClick={handleOpenModal}>
          Buy Ticket
        </Button>
      </div>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="modal-content">
          <BuyTickets event={event} onClose={handleCloseModal} />
          <Button variant="contained" color="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default MainContent;
