import React from 'react';

function EventView({ eventName,organizerName, eventDate, eventDescription, eventImageUrl }) {
  return (
    <div style={styles.eventContainer}>
      <h2 style={styles.eventName}>{eventName}</h2>
      <div style={styles.detailsContainer}>
        <h4 style={styles.organizerName}>{organizerName}</h4>
        <p style={styles.eventDate}><strong>Date:</strong> {new Date(eventDate).toLocaleDateString()}</p>
        <p style={styles.eventDescription}>{eventDescription}</p>
        {eventImageUrl && (
          <img 
            src={eventImageUrl} 
            alt={`Event ${eventName}`}
            style={styles.eventImage}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  eventContainer: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '400px',
    margin: '20px auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  eventName: {
    fontSize: '1.5rem',
    textAlign: 'center',
    marginBottom: '10px',
    color: 'black',
  },
  organizerName: {
    fontSize: '1rem',
    textAlign: 'center',
    marginBottom: '10px',
    color: 'black',
  },
  eventDate: {
    fontSize: '1rem',
    marginBottom: '10px',
    color: 'black',
  },
  eventDescription: {
    fontSize: '1rem',
    marginBottom: '10px',
    color: 'black',
  },
  eventImage: {
    width: '100%',
    borderRadius: '5px',
    marginTop: '10px',
  },
};

export default EventView;
