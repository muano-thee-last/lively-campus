import React, { useState, useEffect } from 'react';
import Header from "./header";
import Footer from "./footer";
import SideBar from "./side-bar";
import './dashboard.css';
import './Notifications.css';

function Notifications() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

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

  return (
    <div id="main-footer-separator">
      <div id="dashboard">
        <Header toggleSidebar={toggleSidebar} />
        <div id="content">
          <SideBar isSidebarOpen={isSidebarOpen} />
          <div className="notifications-container">
            <h2>Notifications</h2>
            <ul className="notifications-list">
              {notifications.map(notification => (
                <li key={notification.id} className="notification-item">
                  <img src={notification.imageUrl} alt={notification.title} className="notification-image" />
                  <div className="notification-details">
                    <span className="notification-event">{notification.title}</span>
                    <p className="notification-message">{notification.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Notifications;
