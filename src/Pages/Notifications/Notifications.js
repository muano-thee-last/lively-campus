import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/notifications');
        const notificationsData = await response.json();

        const detailedNotifications = await Promise.all(
          notificationsData.map(async (notification) => {
            const eventResponse = await fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${notification.eventId}`);
            const eventData = await eventResponse.json();
            
            // Convert the timestamp to a readable date format
            const timestampDate = new Date(notification.timestamp._seconds * 1000);

            // Format the date and time as "7 September 2024 3:17:02 PM"
            const formattedDate = timestampDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const formattedTime = timestampDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            });
            
            return { ...notification, ...eventData, timestampDate: `${formattedDate} ${formattedTime}`, dateObject: timestampDate };
          })
        );

        // Sort notifications by date (newest first)
        detailedNotifications.sort((a, b) => b.dateObject - a.dateObject);

        setNotifications(detailedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleViewNotification = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <ul className="notifications-list">
        {notifications.map(notification => (
          <li key={notification.id} className="notification-item" onClick={() => handleViewNotification(notification.eventId)}>
            <img src={notification.imageUrl} alt={notification.title} className="notification-image" />
            <div className="notification-details">
              <span className="notification-event">{notification.title}</span>
              <p className="notification-message">{notification.message}</p>
              <span className="notification-timestamp">{notification.timestampDate}</span> {/* Display the formatted date here */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
