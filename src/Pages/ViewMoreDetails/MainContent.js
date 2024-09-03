import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For accessing route parameters
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
        <img src={event.image} alt={event.title} />
      </div>
      <div className="event-details">
        <h1>{event.title}</h1>
        <p className="event-description">{event.description}</p>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Capacity:</strong> {event.capacity}</p>
        <p><strong>Available Tickets:</strong> {event.availableTickets}</p>
      </div>
    </div>
  );
}

export default MainContent;
