import React, { useState, useEffect } from 'react';
import EventView from './eventView'; 
import './EventHistory.css'; 
import Header from "../dashboard/header";
import Footer from '../dashboard/footer';
import SideBar from '../dashboard/side-bar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function EventHistory() {
  const [eventDetails, setEventDetails] = useState([]);
  const [error, setError] = useState(null);
  const [currentUserName, setCurrentUserName] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const auth = getAuth();

        // Fetch current user's information from Google
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setCurrentUserName(user.displayName);
          }
        });

        // Fetch all events from the API
        try {
          const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/events/');
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setEventDetails(data);
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
  const validEvents = eventDetails.filter(event => 
    event.title !== 'Title not found' && event.organizerName === currentUserName
  );

  return (
    <div id="main-footer-separator">
      <div id="dashboard">
        <Header toggleSidebar={toggleSidebar} /> {/* Header with sidebar toggle */}
        <div id="content">
          <SideBar isSidebarOpen={isSidebarOpen} /> {/* Sidebar */}
          <div className="event-history">
            {validEvents.length > 0 ? (
              validEvents.map(event => (
                <div key={event.eventId}>
                  <EventView
                    eventName={event.title || 'N/A'}
                    organizerName={event.organizerName}
                    eventDate={event.date} // Adjust the property name if needed
                    eventDescription={event.description} // Adjust the property name if needed
                    eventImageUrl={event.imageUrl} // Adjust the property name if needed
                  />
                </div>
              ))
            ) : (
              <h1>No events found</h1>
            )}
          </div>
        </div>
      </div>
      <Footer /> {/* Footer at the bottom */}
    </div>
  );
}

export default EventHistory;
