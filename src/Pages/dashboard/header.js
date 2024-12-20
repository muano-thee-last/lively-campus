import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material"; // MUI icons
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputBase, Badge } from "@mui/material";
import logo from "./images-logos/logo.png";
import "./header.css";

function Header({ toggleSidebar, onSearch }) {
  const [showFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [pictureUrl, setPictureUrl] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNotificationsClick = () => {
    navigate("/Notifications");
  };

  const handleDashboardNavigation = () => {
    navigate("/dashboard");
  };

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

  const fetchAndCleanNotifications = React.useCallback(async (uid) => {
    try {
      const response = await fetch(
        "https://us-central1-witslivelycampus.cloudfunctions.net/app/notifications"
      );
      const notificationsData = await response.json();

      const viewedNotifications = await fetchViewedNotifications(uid);

      const validNotifications = await Promise.all(
        notificationsData.map(async (notification) => {
          try {
            const eventResponse = await fetch(
              `https://us-central1-witslivelycampus.cloudfunctions.net/app/events/${notification.eventId}`
            );
            if (!eventResponse.ok && eventResponse.status === 404) {
              console.log(
                `Event not found for notification: ${notification.id}`
              );
              await deleteNotification(notification.id);
              return null;
            } else if (eventResponse) {
              const eventData = await eventResponse.json();
              return eventData.isApproved ? notification : null;
            }
          } catch (error) {
            console.error(
              `Error fetching event for notification ${notification.id}:`,
              error
            );

            return null;
          }
        })
      );
      const filteredNotifications = validNotifications.filter(
        (notification) => notification !== null
      );

      const unviewedCount = filteredNotifications.filter(
        (notification) => !viewedNotifications.has(String(notification.eventId))
      ).length;

      setNotificationCount(unviewedCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotificationCount(0);
    }
  }, []);

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
      setPictureUrl(user.photoURL);
      fetchAndCleanNotifications(user.uid);
    }
  }, [fetchAndCleanNotifications]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      fetchAndCleanNotifications(user.uid);
    }
  }, [fetchAndCleanNotifications]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (
      (location.pathname === "/dashboard" ||
        location.pathname === "/Dashboard") &&
      onSearch
    ) {
      onSearch(e.target.value);
    }
  };

  const isDashboardOrDashboard =
    location.pathname === "/dashboard" || location.pathname === "/Dashboard";

  return (
    <div id="header">
      <section className="header-right-section">
        <IconButton onClick={toggleSidebar}>
          <MenuIcon className="hamburger-logo pointer" />
        </IconButton>
        <img
          className="lively-campus-logo pointer"
          src={logo}
          alt="Livelycampus Logo"
          onClick={handleDashboardNavigation}
        />
        <h4
          onClick={handleDashboardNavigation}
          className="header-title pointer"
        >
          LivelyCampus
        </h4>
      </section>

      <section className="header-middle-section">
        {/* Conditionally render the search bar only on /dashboard */}
        {isDashboardOrDashboard && (
          <div className="search-bar">
            <InputBase
              type="text"
              className="search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={!isDashboardOrDashboard}
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton
              type="submit"
              className="search-button"
              style={{ scale: "1.1" }}
            >
              <SearchIcon />
            </IconButton>
          </div>
        )}
        {showFilters && (
          <div className="filter-options">
            <h4>Filter by:</h4>
            <div className="filter-option">
              <label>Location:</label>
              <select>
                <option value="all">All</option>
                <option value="location1">Location 1</option>
                <option value="location2">Location 2</option>
              </select>
            </div>
            <div className="filter-option">
              <label>Type:</label>
              <select>
                <option value="all">All</option>
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
              </select>
            </div>
          </div>
        )}
      </section>

      <section className="header-left-section">
        <IconButton onClick={handleNotificationsClick}>
          <Badge badgeContent={notificationCount} color="secondary">
            <NotificationsIcon className="pointer" />
          </Badge>
        </IconButton>
        <IconButton onClick={() => navigate("/profile")}>
          {pictureUrl ? (
            <img
              className="lively-campus-profile pointer"
              src={pictureUrl}
              alt="Profile"
              style={{ borderRadius: "50%", width: 30, height: 30 }}
            />
          ) : (
            <AccountCircleIcon className="pointer" style={{ fontSize: 40 }} />
          )}
        </IconButton>
      </section>
    </div>
  );
}

export default Header;
