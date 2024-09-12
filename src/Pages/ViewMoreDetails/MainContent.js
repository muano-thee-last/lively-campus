import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaTicketAlt } from 'react-icons/fa'; 
import './MainContent.css';
import BuyTickets from '../BuyTickets/BuyTickets';
import { Modal, Button } from '@mui/material'; 

function MainContent() {
  const { id } = useParams(); 
  const [event, setEvent] = useState(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setEvent(data);
      })
      .catch(error => {
        console.error('Error fetching event details:', error);
      });
  }, [id]);

  useEffect(() => {
    const getGoogleKey = async () => {
      const url = "https://us-central1-witslivelycampus.cloudfunctions.net/app/getEnvgoogle"; 
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setGoogleMapsApiKey(json.value);
      } catch (error) {
        console.error('Error fetching Google Maps API key:', error);
      }
    };

    getGoogleKey();
  }, []); 
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!event || !googleMapsApiKey) {
    return <p>Loading...</p>; 
  }

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
        <div className="info-item">
          <FaMapMarkerAlt /> {event.location}
        </div>
        <div className="info-item">
          <FaCalendarAlt /> {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}
        </div>
        <div className="info-item">
          <FaUsers /> Capacity: {event.capacity}
        </div>
        <div className="info-item">
          <FaTicketAlt /> Available Tickets: {event.availableTickets}
        </div>
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
        <p><strong>Ticket Price:</strong> {event.ticketPrice}</p>
        <Button class="buy-ticket-button" variant="contained" color="primary" onClick={handleOpenModal}>
          Buy Ticket
        </Button>
      </div>

      {/* Modal for Buy Tickets */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="buy-ticket-modal"
        aria-describedby="buy-ticket-form"
      >
        <div className="modal-content">
          <BuyTickets />
          <Button variant="contained" color="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default MainContent;


