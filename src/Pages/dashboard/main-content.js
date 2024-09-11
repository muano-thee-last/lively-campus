import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main-content.css';
import profile from './images-logos/profile-logo.jpg';
import comments from './images-logos/comments.jpeg';

function MainContent() {
  const [events, setEvents] = useState([]);
  const [liked, setLiked] = useState([]);
  const upcomingSlider = useRef(null);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('uid');

  useEffect(() => {
    // Fetch events and user's liked events
    fetchEvents();
  }, []);

  useEffect(() => {
    // Fetch user's liked events after events are fetched
    if (events.length > 0) {
      fetchUserLikedEvents();
    }
  }, [events]);

  const fetchEvents = () => {
    fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/events')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setEvents(data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  };

  const fetchUserLikedEvents = () => {
    if (!userId) return;

    fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/users/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user liked events');
        }
        return response.json();
      })
      .then(data => {
        if (data && Array.isArray(data.likedEvents)) {
          const likedEvents = data.likedEvents;
          const likedStatuses = events.map(event => likedEvents.includes(event.id));
          setLiked(likedStatuses);
        } else {
          console.error('Invalid data structure:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching user liked events:', error);
      });
  };

  const handleScroll = (slider, direction) => {
    if (slider.current) {
      const cardWidth = slider.current.querySelector('.dashboard-card').offsetWidth + 20; // Card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      slider.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleLike = (index) => {
    const eventId = events[index].id;
    const isLiked = !liked[index];
    
    // Toggle like status locally
    const updatedLiked = [...liked];
    updatedLiked[index] = isLiked;
    setLiked(updatedLiked);
  
    // Increment or decrement like count locally
    const updatedEvents = [...events];
    if (isLiked) {
      updatedEvents[index].likes += 1;
    } else {
      updatedEvents[index].likes -= 1;
    }
    setEvents(updatedEvents);
  
    // Update liked events in backend for the user
    updateUserLikedEvents(eventId, isLiked)
      .then(() => {
        // After updating backend, re-fetch liked events to sync with backend
        fetchUserLikedEvents();
      });
  
    // Update like count on the event in backend (using your previous logic)
    updateEventLikeCount(index, updatedEvents);
  };
  
  // Function to update liked events for the user (unchanged)
  const updateUserLikedEvents = (eventId, isLiked) => {
    if (!userId) {
      console.error("User is not logged in");
      return Promise.reject("User is not logged in");
    }
  
    // First, fetch the current liked events from the backend
    return fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/users/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user liked events');
        }
        return response.json();
      })
      .then(data => {
        const currentLikedEvents = data.likedEvents || [];
  
        // Determine the new liked events array
        let updatedLikedEvents;
        if (isLiked) {
          // If liking the event, add it to the array
          updatedLikedEvents = [...currentLikedEvents, eventId];
        } else {
          // If unliking, remove the event from the array
          updatedLikedEvents = currentLikedEvents.filter(id => id !== eventId);
        }
  
        // Now, update the liked events in the backend with the updated array
        return fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/users/${userId}/liked-events`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ likedEvents: updatedLikedEvents }),
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update liked events');
        }
        return response.json();
      })
      .then(data => {
        console.log('Liked events updated successfully:', data);
      })
      .catch(error => {
        console.error('Error updating liked events:', error);
      });
  };
  
  
  // Updated function to update event like count (based on your existing logic)
  const updateEventLikeCount = (index, updatedEvents) => {
    return fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${updatedEvents[index].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ likes: updatedEvents[index].likes }), // Send the updated likes count
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update likes');
      }
      return response.json();
    })
    .then(data => {
      console.log('Likes updated successfully:', data);
    })
    .catch(error => {
      console.error('Error updating likes:', error);
    });
  };
  
  

  const handleViewDetails = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div id='dashboard-main-content'>
      <div className='dashboard-events-section'>
        <h2>Upcoming Events</h2>
        <div className='dashboard-slider-container'>
          <button className='arrow-button left' onClick={() => handleScroll(upcomingSlider, 'left')}>‹</button>
          <div className='dashboard-slider'>
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
                    <button className='details-button' onClick={() => handleViewDetails(event.id)}>View more details</button>
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
