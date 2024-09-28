import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

function Notifications() {
  const [notificationsByDate, setNotificationsByDate] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let notificationsData;
        const storedNotifications = sessionStorage.getItem("notifications");

        if (storedNotifications) {
          notificationsData = JSON.parse(storedNotifications);
          setIsLoading(true);
        } else {
          console.log("Fetching notifications from the server...");
          const response = await fetch(
            "https://us-central1-witslivelycampus.cloudfunctions.net/app/notifications"
          );
          notificationsData = await response.json();
          sessionStorage.setItem(
            "notifications",
            JSON.stringify(notificationsData)
          );
        }

        const detailedNotifications = await Promise.all(
          notificationsData.map(async (notification) => {
            try {
              const eventResponse = await fetch(
                `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${notification.eventId}`
              );
              if (!eventResponse.ok) {
                console.log(
                  `Event not found for notification: ${notification.id}`
                );
                return null;
              }
              const eventData = await eventResponse.json();

              const timestampDate = new Date(
                notification.timestamp._seconds * 1000
              );
              const formattedDate = timestampDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              return {
                ...notification,
                ...eventData,
                dateObject: timestampDate,
                formattedDate,
              };
            } catch (error) {
              console.error(
                `Error fetching event for notification ${notification.id}:`,
                error
              );
              return null;
            }
          })
        );

        const validNotifications = detailedNotifications.filter(
          (notification) => notification !== null
        );
        validNotifications.sort((a, b) => b.dateObject - a.dateObject);

        const groupedNotifications = validNotifications.reduce(
          (acc, notification) => {
            const dateKey = notification.formattedDate;
            if (!acc[dateKey]) {
              acc[dateKey] = [];
            }
            acc[dateKey].push(notification);
            return acc;
          },
          {}
        );

        setNotificationsByDate(groupedNotifications);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleViewNotification = async (notificationId, uid) => {
    try {
      // Send a request to update the viewed notification
      const response = await fetch(
        `https://us-central1-witslivelycampus.cloudfunctions.net/app/notifications/viewed/${uid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notificationId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update viewed notification");
      }

      // Navigate to the notification details page
      navigate(`/view-more-details/${notificationId}`);
    } catch (error) {
      console.error("Error updating viewed notification:", error);
    }
  };

  const isToday = (dateString) => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return dateString === today;
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <br />
      {isLoading ? (
        <div className="loading-message">Loading notifications...</div>
      ) : (
        Object.keys(notificationsByDate).map((date) => (
          <div key={date}>
            <h3 className="notification-date">
              {isToday(date) ? "Today" : date}
            </h3>
            <ul className="notifications-list">
              {notificationsByDate[date].map((notification) => (
                <li
                  key={notification.id}
                  className="notification-item"
                  onClick={() => handleViewNotification(notification.id, uid)} // Pass the uid here
                >
                  <img
                    src={notification.imageUrl}
                    alt={notification.title}
                    className="notification-image"
                  />
                  <div className="notification-details">
                    <span className="notification-event">
                      {notification.title}
                    </span>
                    <p className="notification-message">
                      {notification.message}
                    </p>
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
