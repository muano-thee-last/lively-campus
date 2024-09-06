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
            return { ...notification, ...eventData };
          })
        );

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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;