import React from 'react';
import './CalendarPopUpCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faUsers, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const CalendarPopUpCard = ({ date, events, onClose }) => {
  const navigate = useNavigate();

  const handleEventClick = (eventId) => {
    navigate(`/view-more-details/${eventId}`);
  };

  return (
    <div className="calendar-popup-overlay">
      <div className="calendar-popup-card">
        <div className="calendar-popup-header">
          <h3>{date}</h3>
          <button onClick={onClose} className="close-button">X</button>
        </div>
        <div className="calendar-popup-content">
          <h4>Available Events</h4>
          {events.length > 0 ? (
            events.map(event => (
              <div key={event.id} className="calendar-popup-event" onClick={() => handleEventClick(event.id)}>
                <img src={event.imageUrl} alt={event.title} className="event-image" />
                <div className="pop-up-details">
                  <h5>{event.title}</h5>
                  <p><FontAwesomeIcon icon={faMapMarkerAlt} /> <strong>Location:</strong> {event.venue}</p>
                  <p><FontAwesomeIcon icon={faClock} /> <strong>Time:</strong> {event.time}</p>
                  <p><FontAwesomeIcon icon={faUsers} /> <strong>Capacity:</strong> {event.capacity}</p>
                  <p><FontAwesomeIcon icon={faTicketAlt} /> <strong>Available Tickets:</strong> {event.availableTickets}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No events available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPopUpCard;
