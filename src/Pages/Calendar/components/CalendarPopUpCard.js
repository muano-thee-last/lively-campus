import React from 'react';
import './CalendarPopUpCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faUsers, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const CalendarPopUpCard = ({ date, events, onClose }) => {
  return (
    <div className="calendar-popup-overlay">
      <div className="calendar-popup-card">
        <div className="calendar-popup-header">
          <h3>{date}</h3>
          <button onClick={onClose} className="close-button">X</button>
        </div>
        <div className="calendar-popup-content">
          {events.length > 0 ? (
            <>
              <h4>Available Events</h4>
              {events.map(event => (
                <Link 
                  key={event.id} 
                  to={`/details/${event.id}`}
                  className="calendar-popup-event" 
                  onClick={onClose}
                >
                  <img src={event.imageUrl} alt={event.title} className="event-image" />
                  <div className="pop-up-details">
                    <h5>{event.title}</h5>
                    <p><FontAwesomeIcon icon={faMapMarkerAlt} /> <strong>Location:</strong> {event.venue}</p>
                    <p><FontAwesomeIcon icon={faClock} /> <strong>Time:</strong> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p><FontAwesomeIcon icon={faUsers} /> <strong>Capacity:</strong> {event.capacity}</p>
                    <p><FontAwesomeIcon icon={faTicketAlt} /> <strong>Available Tickets:</strong> {event.availableTickets}</p>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <p className="no-events-message">Oops!! It looks like there's nothing scheduled for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPopUpCard;
