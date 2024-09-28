import React, { useState, useEffect } from "react";
import hamburger from "./images-logos/hamburger.jpg";
import { useNavigate } from "react-router-dom";
import logo from "./images-logos/logo.png";
import profile from "./images-logos/profile-logo.jpg";
import notificationsIcon from "./images-logos/notification-logo.jpeg";
import "./header.css";

function Header({ toggleSidebar }) {
  const [showFilters] = useState(false);
  const navigate = useNavigate();
  const [pictureUrl, setPictureUrl] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  const handleNotificationsClick = () => {
    navigate("/Notifications");
  };

  const handleDashboardNavigation = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setPictureUrl(user.photoURL);
      fetchAndCleanNotifications(user.uid);
    }
  }, []);

  const deleteNotification = async (id) => {
    try {
      await fetch(
        `https://us-central1-witslivelycampus.cloudfunctions.net/app/notifications/${id}`,
        {
          method: "DELETE",
        }
      );
      console.log(`Deleted notification: ${id}`);
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
    }
  };

  const fetchAndCleanNotifications = async (uid) => {
    try {
      let notificationsData;
      const storedNotifications = sessionStorage.getItem("notifications");

      if (storedNotifications) {
        notificationsData = JSON.parse(storedNotifications);
      } else {
        const response = await fetch(
          "https://us-central1-witslivelycampus.cloudfunctions.net/app/notifications"
        );
        notificationsData = await response.json();
      }

      const viewedNotifications = await fetchViewedNotifications(uid);

      const validNotifications = await Promise.all(
        notificationsData.map(async (notification) => {
          try {
            const eventResponse = await fetch(
              `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${notification.eventId}`
            );
            if (!eventResponse.ok) {
              console.log(
                `Event not found for notification: ${notification.id}`
              );
              await deleteNotification(notification.id);
              return null;
            }
            return notification;
          } catch (error) {
            console.error(
              `Error fetching event for notification ${notification.id}:`,
              error
            );
            await deleteNotification(notification.id);
            return null;
          }
        })
      );
      console.log(validNotifications);
      const filteredNotifications = validNotifications.filter(
        (notification) => notification !== null
      );

      sessionStorage.setItem(
        "notifications",
        JSON.stringify(filteredNotifications)
      );

      const unviewedCount = filteredNotifications.filter(
        (notification) => !viewedNotifications.has(String(notification.eventId))
      ).length;

      setNotificationCount(unviewedCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotificationCount(0);
    }
  };

  const fetchViewedNotifications = async (uid) => {
    try {
      const response = await fetch(
        `https://us-central1-witslivelycampus.cloudfunctions.net/app/notifications/viewed/${uid}`
      );
      if (response.ok) {
        const viewedIds = await response.json();
        return new Set(viewedIds.map(String));
      } else {
        console.error("Failed to fetch viewed notifications");
        return new Set();
      }
    } catch (error) {
      console.error("Error fetching viewed notifications:", error);
      return new Set();
    }
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      fetchAndCleanNotifications(user.uid);
    }
  }, []);

  return (
    <div id="header">
      <section className="header-right-section">
        <img
          className="hamburger-logo pointer"
          src={hamburger}
          alt="Menu"
          onClick={toggleSidebar}
        />
        <img
          className="lively-campus-logo pointer"
          src={logo}
          alt="Livelycampus Logo"
          onClick={handleDashboardNavigation}
        />
        <h4 onClick={handleDashboardNavigation} className="pointer">
          Livelycampus
        </h4>
      </section>
      <section className="header-middle-section">
        <input type="text" className="search" placeholder="Search" />
        <button className="search-button">
          {/* Add content or icon for the search button */}
        </button>
        {showFilters && (
          <div className="filter-options">
            <h4>Filter by:</h4>
            <div className="filter-option">
              <label>Location:</label>
              <select>
                <option value="all">All</option>
                <option value="location1">Location 1</option>
                <option value="location2">Location 2</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="filter-option">
              <label>Type:</label>
              <select>
                <option value="all">All</option>
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>
        )}
      </section>
      <section className="header-left-section">
        <div className="notification-container">
          <img
            id="notifications"
            className="lively-campus-notifications pointer"
            src={notificationsIcon}
            alt="Notifications"
            onClick={handleNotificationsClick}
          />
          <span className="notification-counter">{notificationCount}</span>
        </div>
        <img
          className="lively-campus-profile pointer"
          src={pictureUrl ? pictureUrl : profile}
          style={pictureUrl ? { borderRadius: 50 } : {}}
          alt="Profile"
          onClick={() => navigate("/profile")}
        />
      </section>
    </div>
  );
}

export default Header;
