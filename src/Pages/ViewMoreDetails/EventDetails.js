import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaTicketAlt } from 'react-icons/fa'; 
import './EventDetails.css';
import '../EventCreation/styles/EventCreationStyles.css'; 
import BuyTickets from '../BuyTickets/BuyTickets';
import { Modal, Button } from '@mui/material'; 

export default function EventDetails(){
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${id}`).then(response => {
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
  let [colors, setColors] = React.useState({});

  function randomColor(tagName) {
    const letters = "0123456789ABCDEF";
    let color = "#";
    if (tagName in colors) {
      return colors[tagName];
    }
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 11)];
    }
    setColors({ ...colors, [tagName]: color });
    return color;
  }

  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (!event || !googleMapsApiKey) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="event-creation-container">
      <div className="upload-image-section" style={{ backgroundImage: `url(${event.imageUrl})` }}>
      </div>

      <div className="event-header">
        <h1 className='event-name-view'>{event.title}</h1>
        <div className="eventTags chosenTags">
                  {
                    event.tags.map((tagName) => {
                      return (
                        <div
                          className="chosenTag"
                          style={{ backgroundColor: randomColor(tagName) }}
                        >
                          <p>{tagName}</p>
                        </div>
                      );
                    })}
                </div>
      </div>

      <div className="event-info">
        <div className="info-item">
          <FaMapMarkerAlt className="icon"/>   {event.venue}
        </div>
        <div className="info-item">
          <FaCalendarAlt className="icon"/> {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}
        </div>
        <div className="info-item">
          <FaUsers className="icon"/> Capacity: {event.capacity}
        </div>
        <div className="info-item">
          <FaTicketAlt className="icon"/> Available Tickets: {event.availableTickets}
        </div>
      </div>

      <div className="event-description">
        <h3>Description</h3>
        <p>{event.description}</p>
      </div>
      <div className="event-venue-location">
        <h3>Venue and Location</h3>
        <div className="map-container">
          <iframe
            title={`Map showing location of ${event.venue}`}
            src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(event.location)}`}
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="event-buy-tickets">
        <p><strong>Ticket Price: <span >R</span> {event.ticketPrice} </strong></p>
        <button className="create-button" onClick={handleOpenModal}>Buy Ticket</button>
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


