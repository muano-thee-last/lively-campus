import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

function Notifications() {
  const [notificationsByDate, setNotificationsByDate] = useState({});
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/notifications');
        const notificationsData = await response.json();

        const detailedNotifications = await Promise.all(
          notificationsData.map(async (notification) => {
            try {
              const eventResponse = await fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${notification.eventId}`);
              if (!eventResponse.ok) {
                console.log(`Event not found for notification: ${notification.id}`);
                return null;
              }
              const eventData = await eventResponse.json();
              
              // Convert the timestamp to a readable date format
              const timestampDate = new Date(notification.timestamp._seconds * 1000);

              // Format the date as "7 September 2024"
              const formattedDate = timestampDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });
              
              return { ...notification, ...eventData, dateObject: timestampDate, formattedDate };
            } catch (error) {
              console.error(`Error fetching event for notification ${notification.id}:`, error);
              return null;
            }
          })
        );

        // Filter out null values (notifications without events)
        const validNotifications = detailedNotifications.filter(notification => notification !== null);

        // Sort notifications by date (newest first)
        validNotifications.sort((a, b) => b.dateObject - a.dateObject);

        // Group notifications by formattedDate
        const groupedNotifications = validNotifications.reduce((acc, notification) => {
          const dateKey = notification.formattedDate;
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(notification);
          return acc;
        }, {});

        setNotificationsByDate(groupedNotifications);
        setIsLoading(false); // Stop loading once the data is fetched
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setIsLoading(false); // Stop loading if there's an error
      }
    };

    fetchNotifications();
  }, []);

  const handleViewNotification = (id) => {
    navigate(`/view-more-details/${id}`);
  };

  const isToday = (dateString) => {
    const today = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return dateString === today;
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <br/>      
      {isLoading ? ( // Display this while loading
        <div className="loading-message">Loading notifications...</div>
      ) : (
        Object.keys(notificationsByDate).map(date => (
          <div key={date}>
            <h3 className="notification-date">
              {isToday(date) ? 'Today' : date} {/* Show 'Today' if the notification is from today */}
            </h3>
            <ul className="notifications-list">
              {notificationsByDate[date].map(notification => (
                <li key={notification.id} className="notification-item" onClick={() => handleViewNotification(notification.eventId)}>
                  <img src={notification.imageUrl} alt={notification.title} className="notification-image" />
                  <div className="notification-details">
                    <span className="notification-event">{notification.title}</span>
                    <p className="notification-message">{notification.message}</p>
                    {/* Removed the date display here */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;