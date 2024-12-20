import React from 'react';
import { Link } from 'react-router-dom';
import './CalendarPopUpCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faUsers, faTicketAlt, faStar, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import coolImage from './cool.png';

const CalendarPopUpCard = ({ date, events, onClose, currentUser }) => {
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
                  to={`/view-more-details/${event.id}`}
                  className={`calendar-popup-event ${event.isTicketed ? 'ticketed-event' : ''} ${event.isUserEvent ? 'user-event' : ''}`}
                  onClick={onClose}
                >
                  <img src={event.imageUrl} alt={event.title} className="event-image" />
                  <div className="pop-up-details">
                    <h5>{event.title}</h5>
                    <p><FontAwesomeIcon icon={faMapMarkerAlt} /> <strong>Location:</strong> {event.venue}</p>
                    <p><FontAwesomeIcon icon={faClock} /> <strong>Time:</strong> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p><FontAwesomeIcon icon={faUsers} /> <strong>Capacity:</strong> {event.capacity}</p>
                    <p><FontAwesomeIcon icon={faTicketAlt} /> <strong>Available Tickets:</strong> {event.availableTickets}</p>
                    {event.isTicketed && (
                      <p className="event-status ticketed">
                        <FontAwesomeIcon icon={faStar} /> You have a ticket for this event
                      </p>
                    )}
                    {event.isUserEvent && (
                      <p className="event-status user-event">
                        <FontAwesomeIcon icon={faUserEdit} /> You created this event
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <div className="no-events-container">
              <img src={coolImage} alt="No events" className="no-events-image" />
              <p className="no-events-message">Oops!! It looks like there's nothing scheduled for this date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPopUpCard;
