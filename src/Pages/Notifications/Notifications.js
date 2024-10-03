import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

function Notifications() {
  const [notificationsByDate, setNotificationsByDate] = useState({});
  const [viewedNotifications, setViewedNotifications] = useState(new Set()); // Track viewed notifications
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const uid = sessionStorage.getItem("uid");

  const [unviewedCount, setUnviewedCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Remove the session storage logic
        console.log("Fetching notifications from the server...");
        const response = await fetch(
          "https://us-central1-witslivelycampus.cloudfunctions.net/app/notifications"
        );
        const notificationsData = await response.json();

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

    // Calculate unviewed notifications count
    const calculateUnviewedCount = () => {
      let count = 0;
      Object.values(notificationsByDate).forEach(notifications => {
        count += notifications.filter(n => !viewedNotifications.has(n.id)).length;
      });
      setUnviewedCount(count);
    };

    calculateUnviewedCount();
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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderNotificationItem = (notification) => (
    <li
      key={notification.id}
      className={`notification-item ${
        viewedNotifications.has(notification.id) ? "viewed" : "unviewed"
      }`}
      onClick={() => handleViewNotification(notification.id)}
    >
      <img
        src={notification.imageUrl}
        alt={notification.title}
        className="notification-image"
      />
      <div className="notification-details">
        <span className="notification-event">{notification.title}</span>
        <p className="notification-message">{notification.message}</p>
        <span className="notification-time">{formatTimestamp(notification.timestamp)}</span>
      </div>
    </li>
  );

  const renderNotificationGroup = (date, notifications) => (
    <div key={date}>
      <h3 className="notification-date">
        {isToday(date) ? "Today" : date}
      </h3>
      <ul className="notifications-list">
        {notifications.map(renderNotificationItem)}
      </ul>
    </div>
  );

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2 className="notifications-title">Notifications</h2>
        {unviewedCount > 0 && (
          <span className="notifications-count">{unviewedCount} new</span>
        )}
      </div>
      {isLoading ? (
        <div className="loading-message">Loading notifications...</div>
      ) : Object.keys(notificationsByDate).length === 0 ? (
        <div className="loading-message">No notifications found.</div>
      ) : (
        Object.entries(notificationsByDate).map(([date, notifications]) =>
          renderNotificationGroup(date, notifications)
        )
      )}
    </div>
  );
}

export default Notifications;
