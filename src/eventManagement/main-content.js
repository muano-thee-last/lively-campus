import React, { useRef, useEffect, useState } from 'react';
import './main-content.css';
import profile from './images-logos/profile-logo.jpg';
import media from './images-logos/media.jpg';
import { FaSearch, FaEdit, FaTrash, FaCamera, FaUsers } from 'react-icons/fa';

function MainContent() {
  const [events, setEvents] = useState([]);
  const [liked, setLiked] = useState([]);
  const upcomingSlider = useRef(null);

  useEffect(() => {
    fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/events')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setEvents(data);
        setLiked(new Array(data.length).fill(false));
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        // You might want to set an error state here to display a message to users
      });
  }, []);

  const handleScroll = (slider, direction) => {
    if (slider.current) {
      const cardWidth = slider.current.querySelector('.card').offsetWidth + 20; // Card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      slider.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleLike = (index) => {
    setLiked(prev => {
      const updatedLiked = [...prev];
      updatedLiked[index] = !updatedLiked[index];
      return updatedLiked;
    });
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter(event => event.id !== eventId)); // Remove the event from the state
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div id='main-content'>
      <div className='events-section'>
        <header className='event-management-header'>
          <p className='eventManagement2'>EVENT MANAGEMENT</p>
          <input type="text" placeholder="search your events" className="search-bar" />
          <span className="search-icon">
            <FaSearch />
          </span>
        </header>
        <div className='slider-container'>
          <button className='arrow-button left' onClick={() => handleScroll(upcomingSlider, 'left')} role='button'>‹</button>
          <div className='slider'>
            <div className='card-container' ref={upcomingSlider}>
              {events.map((event, index) => (
                <div className='card' key={event.id}>
                  <div className='card-first-row'>
                    <h4 className='event-title'>{event.title}</h4>
                  </div>
                  <div className='card-second-row'>
                    <img src={profile} alt='Profile' className='profile-image' />
                    <p className='event-organizer'>{event.organizer}</p>
                  </div>
                  <div className='card-third-row'>
                    <img className='event-images' src={event.image} alt='Event' />
                  </div>
                  <div className='card-fourth-row'>
                    <div className='EventCapacity'>
                      <FaUsers className="attendance-icon" size={24} title="Attendance" />
                      <p className='Capacity'>{event.availableTickets}</p>
                    </div>

                    <div className="event-actions">
                      <FaEdit size={24} />
                      <FaCamera size={24} />
                      <FaTrash
                        className='deleteEvent'
                        size={24}
                        onClick={() => handleDelete(event.id)}
                      />
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className='arrow-button right' onClick={() => handleScroll(upcomingSlider, 'right')} role='button'>›</button>
        </div>
      </div>
    </div>
  );
}

export default MainContent;

