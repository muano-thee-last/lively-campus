import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './main-content.css';
import profile from './images-logos/profile-logo.jpg';
import comments from './images-logos/comments.jpeg';

function MainContent() {
  const [events, setEvents] = useState([]);
  const [liked, setLiked] = useState([]);
  const upcomingSlider = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

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
        // Optionally, handle error state here
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

  const handleViewDetails = (id) => {
    navigate(`/details/${id}`); // Navigate to the ViewMoreDetails page with event ID
  };

  return (
    <div id='main-content'>
      <div className='dashboard-events-section'>
        <h2>Upcoming Events</h2>
        <div className='slider-container'>
          <button className='arrow-button left' onClick={() => handleScroll(upcomingSlider, 'left')}>‹</button>
          <div className='slider'>
            <div className='dashboard-card-container' ref={upcomingSlider}>
              {events.map((event, index) => (
                <div className='dashboard-card' key={index}>
                  <div className='card-first-row'>
                    <h4 className='event-title'>{event.title}</h4>
                  </div>
                  <div className='card-second-row'>
                    <img src={profile} alt='Profile' className='profile-image' />
                    <p className='event-organizer'>{event.organizer}</p>
                  </div>
                  <div className='card-third-row'>
                    <img className='event-images' src={event.imageUrl} alt='Event' />
                  </div>
                  <div className='card-fourth-row'>
                    <div className='like-comment'>
                      <button 
                        className={`like-button ${liked[index] ? 'active' : ''}`} 
                        onClick={() => handleLike(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="like-icon">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                      <img src={comments} alt='Comments' className='comments-image' />
                      <p className='like-count'>likes {event.likes}</p>
                    </div>
                    <button className='details-button' onClick={() => handleViewDetails(event.id)}>View more details</button> {/* Pass event ID */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className='arrow-button right' onClick={() => handleScroll(upcomingSlider, 'right')}>›</button>
        </div>
      </div>
    </div>
  );
}

export default MainContent;

