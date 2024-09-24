import React, { useRef, useEffect, useState } from 'react';
import './event-management-main-content.css';
import profile from './images-logos/profile-logo.jpg';
import { FaSearch, FaEdit, FaTrash, FaCamera, FaUsers } from 'react-icons/fa';
import useImageUpload from './useImageUpload';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function EventManagementMainContent() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null); 
  const upcomingSlider = useRef(null);
  const [error, setError] = useState(null);

  const {
    imagePreview,
    uploading,
    uploadImage,
    fileInputRef,
    handleFileChange,
    handleDivClick,
    setImagePreview,
  } = useImageUpload();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const auth = getAuth();

        // Fetch current user's information from Firebase Auth
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setCurrentUserName(user.displayName);
          } else {
            setCurrentUserName('');
          }
        });

        // Fetch all events from the API
        try {
          const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/events/');
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setEvents(data);
        } catch (fetchError) {
          setError(fetchError.message);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEvents();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter events to include only those where organizerName matches the currentUserName
  const validEvents = events.filter(
    (event) => event.title !== 'Title not found' && event.organizerName === currentUserName
  );

  const handleScroll = (slider, direction) => {
    if (slider.current) {
      const cardWidth = slider.current.querySelector('.management-card').offsetWidth + 20; // Card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      slider.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(
        `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${eventId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId));
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSaveChanges = async () => {
    if (editingEvent) {
      try {
        const response = await fetch(
          `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${editingEvent.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: editingEvent.title,
              description: editingEvent.description,
              date: editingEvent.date,
              location: editingEvent.location,
              imageUrl: editingEvent.imageUrl, 
            }),
          }
        );

        if (response.ok) {
          setEvents(
            events.map((event) =>
              event.id === editingEvent.id ? { ...event, ...editingEvent } : event
            )
          );
          setIsModalOpen(false); 
        } else {
          console.error('Failed to update event');
        }
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }
  };

  const handleUploadImage = async () => {
    if (selectedEventId) {
      const imageUrl = await uploadImage();
      console.log(imageUrl); 
      if (imageUrl) {
        try {
          const response = await fetch(
            `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${selectedEventId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageUrl, 
              }),
            }
          );

          if (response.ok) {
            setEvents(
              events.map((event) =>
                event.id === selectedEventId ? { ...event, imageUrl } : event
              )
            );
            handleUploadModalClose(); 
          } else {
            console.error('Failed to update event image');
          }
        } catch (error) {
          console.error('Error updating event image:', error);
        }
      }
    }
  };

  const handleUploadModalClose = () => {
    setImagePreview(null);
    setUploadModalOpen(false);
    setSelectedEventId(null);
  };

  return (
    <div id="management-main-content">
      <div className="management-events-section">
        <header className="management-event-management-header">
          <p className="management-eventManagement2">EVENT MANAGEMENT</p>
          <input
            type="text"
            placeholder="search your events"
            className="management-search-bar"
          />
          <span className="management-search-icon">
            <FaSearch />
          </span>
        </header>
        <div className="management-slider-container">
          <button
            className="management-arrow-button left"
            onClick={() => handleScroll(upcomingSlider, 'left')}
          >
            ‹
          </button>
          <div className="management-slider">
            <div className="management-card-container" ref={upcomingSlider}>
              {validEvents.length > 0 ? (
                validEvents.map((event) => (
                  <div className="management-card" key={event.id}>
                    <div className="management-card-first-row">
                      <h4 className="management-event-title">{event.title}</h4>
                    </div>
                    <div className="management-card-second-row">
                      <img
                        src={profile}
                        alt="Profile"
                        className="management-profile-image"
                      />
                      <p className="management-event-organizer">{event.organizerName}</p>
                    </div>
                    <div className="management-card-third-row">
                      <img
                        className="management-event-images"
                        src={event.imageUrl}
                        alt="Event"
                      />
                    </div>
                    <div className="management-card-fourth-row">
                      <div className="management-EventCapacity">
                        <FaUsers
                          className="management-attendance-icon"
                          size={24}
                          title="Attendance"
                        />
                        <p className="management-Capacity">{event.availableTickets}</p>
                      </div>

                      <div className="management-event-actions">
                        <FaEdit
                          className="management-event-edit"
                          size={24}
                          onClick={() => handleEdit(event)}
                        />
                        <FaCamera
                          className="management-event-upload-image"
                          size={24}
                          onClick={() => {
                            setSelectedEventId(event.id);
                            setUploadModalOpen(true);
                          }}
                        />
                        <FaTrash
                          className="management-deleteEvent"
                          size={24}
                          onClick={() => handleDelete(event.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No events found</h1>
              )}
            </div>
          </div>
          <button
            className="management-arrow-button right"
            onClick={() => handleScroll(upcomingSlider, 'right')}
          >
            ›
          </button>
        </div>
      </div>

      {isModalOpen && editingEvent && (
        <div className="management-modal-overlay">
          <div className="management-modal-content">
            <h2>Edit Event</h2>
            <label>
              Title:
              <input
                type="text"
                value={editingEvent.title || ''}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
              />
            </label>
            <label>
              Description:
              <textarea
                className="management-auto-resize-textarea"
                value={editingEvent.description || ''}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    description: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Location:
              <input
                type="text"
                value={editingEvent.location || ''}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, location: e.target.value })
                }
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                value={editingEvent.date || ''}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, date: e.target.value })
                }
              />
            </label>

            <div className="management-modal-buttons">
              <button onClick={handleModalClose}>Cancel</button>
              <button onClick={handleSaveChanges}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {uploadModalOpen && (
        <div className="management-upload-modal-overlay">
          <div className="management-upload-modal-content">
            <h2>Upload Image</h2>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
            <div className="management-image-upload" onClick={handleDivClick}>
              <span className="management-upload-placeholder">Select Image</span>
            </div>
            {imagePreview && (
              <div className="management-image-previews">
                <img src={imagePreview} alt="preview" className="management-image-preview" />
              </div>
            )}
            {uploading && <p>Uploading...</p>}
            {error && <p className="management-error">{error}</p>}
            <div className="management-upload-modal-buttons">
              <button onClick={handleUploadModalClose}>Cancel</button>
              <button onClick={handleUploadImage} disabled={uploading}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventManagementMainContent;
