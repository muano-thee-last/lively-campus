import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

function Notifications() {
  const [notificationsByDate, setNotificationsByDate] = useState({});
  const [viewedNotifications, setViewedNotifications] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications from the server...");
        const response = await fetch(
          "https://us-central1-witslivelycampus.cloudfunctions.net/app/notifications"
        );
        const notificationsData = await response.json();

        const ticketResponse = await fetch(
          `https://us-central1-witslivelycampus.cloudfunctions.net/app/getTicketsx/${uid}`
        );
        const ticketData = ticketResponse.ok ? await ticketResponse.json() : [];

        const validTicketEventIds = ticketData
          .filter((ticket) => ticket.eventTitle !== "Title not found")
          .map((ticket) => ticket.eventId);

        const eventNotifications = await Promise.all(
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

              if (!eventData.isApproved) {
                return null;
              }

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

        const validNotifications = eventNotifications.filter(
          (notification) => notification !== null
        );

        const today = new Date();
        const dayBeforeNotifications = await Promise.all(
          validTicketEventIds.map(async (eventId) => {
            try {
              const eventResponse = await fetch(
                `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${eventId}`
              );
              const event = await eventResponse.json();

              const eventDate = new Date(event.date);
              const oneDayBefore = new Date(eventDate);
              oneDayBefore.setDate(eventDate.getDate() - 1);

              if (oneDayBefore.toDateString() === today.toDateString()) {
                return {
                  id: `upcoming-${eventId}`,
                  eventId,
                  title: "Event Reminder",
                  message: `Reminder: Your event "${event.title}" is tomorrow.`,
                  timestamp: {
                    _seconds: Math.floor(oneDayBefore.getTime() / 1000),
                  },
                  imageUrl: event.imageUrl || "https://via.placeholder.com/60",
                  dateObject: oneDayBefore,
                  formattedDate: oneDayBefore.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }),
                };
              }

              return null;
            } catch (error) {
              console.error(`Error fetching event for reminder:`, error);
              return null;
            }
          })
        );

        const combinedNotifications = [
          ...validNotifications,
          ...dayBeforeNotifications.filter((n) => n !== null),
        ];
        combinedNotifications.sort((a, b) => b.dateObject - a.dateObject);

        const groupedNotifications = combinedNotifications.reduce(
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
          const viewedIds = await response.json();
          console.log("Viewed notification IDs:", viewedIds);
          setViewedNotifications(new Set(viewedIds));
        } else {
          console.error("Failed to fetch viewed notifications");
        }
      } catch (error) {
        console.error("Error fetching viewed notifications:", error);
      }
    };

    fetchNotifications();
    fetchViewedNotifications();
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
        <div className="notification-content">
          <span className="notification-event">{notification.title}</span>
          <p className="notification-message">{notification.message}</p>
        </div>
      </div>
    </li>
  );

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2 className="notifications-title">Notifications</h2>
      </div>
      {isLoading ? (
        <div className="loading-message">Loading notifications...</div>
      ) : Object.keys(notificationsByDate).length === 0 ? (
        <div className="loading-message">No notifications found.</div>
      ) : (
        Object.entries(notificationsByDate).map(([date, notifications]) => (
          <div key={date}>
            <h3>{date}</h3>
            <ul>{notifications.map(renderNotificationItem)}</ul>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;
