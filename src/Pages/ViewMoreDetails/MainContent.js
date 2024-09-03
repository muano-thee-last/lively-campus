import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For accessing route parameters
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaTicketAlt } from 'react-icons/fa'; // Icons
import './MainContent.css'; // Add CSS file for styling

function MainContent() {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null);

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
        // Optionally, handle error state here
      });
  }, [id]);

  if (!event) {
    return <p>Loading...</p>; // Show loading state while fetching data
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
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyC4TJvgsFeWfyDV2DNX6Im0BH6_CpDX4XI&q=${encodeURIComponent(event.location)}`}
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="event-footer">
        <p><strong>Ticket Price:</strong> {event.ticketPrice}</p>
        <button className="buy-ticket-button">Buy Ticket</button>
      </div>
    </div>
  );
}

export default MainContent;

