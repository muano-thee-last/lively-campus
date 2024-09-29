import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

function Notifications() {
  const [notificationsByDate, setNotificationsByDate] = useState({});
  const [viewedNotifications, setViewedNotifications] = useState(new Set()); // Track viewed notifications
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

    const fetchViewedNotifications = async () => {
      try {
        const response = await fetch(
          `https://us-central1-witslivelycampus.cloudfunctions.net/app/notifications/viewed/${uid}`
        );
        if (response.ok) {
          const viewedIds = await response.json(); // Assuming the response is an array of IDs
          console.log("Viewed notification IDs:", viewedIds);
          // Create a Set from the array of IDs
          setViewedNotifications(new Set(viewedIds));
        } else {
          console.error("Failed to fetch viewed notifications");
        }
      } catch (error) {
        console.error("Error fetching viewed notifications:", error);
      }
    };

    fetchNotifications();
    fetchViewedNotifications(); // Fetch viewed notifications
  }, [uid]);

  const handleViewNotification = async (notificationId) => {
    try {
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
      <h2 style={{"color" : "#003B5C"}}>Notifications</h2>
      <br/>      
      {isLoading ? ( // Display this while loading
        <div className="loading-message">Loading notifications...</div>
      ) : (
        Object.keys(notificationsByDate).map((date) => (
          <div key={date}>
            <h3 style={{"color" : "#003B5C"}}className="notification-date">
              {isToday(date) ? 'Today' : date} {/* Show 'Today' if the notification is from today */}

            </h3>
            <ul className="notifications-list">
              {notificationsByDate[date].map((notification) => (
                <li
                  key={notification.id}
                  className={`notification-item ${
                    viewedNotifications.has(notification.id)
                      ? "viewed"
                      : "unviewed"
                  }`} // Apply class conditionally
                  onClick={() => handleViewNotification(notification.id)} // Pass the uid here
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
