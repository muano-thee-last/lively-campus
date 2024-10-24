import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Event,
  History,
  PostAdd,
  EventAvailable,
  CheckCircle,
} from "@mui/icons-material"; // Import MUI icons
import LogoutIcon from '@mui/icons-material/Logout';
import "./side-bar.css"; // CSS for styling

function SideBar({ isSidebarOpen }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch(
          `https://us-central1-witslivelycampus.cloudfunctions.net/app/users/${sessionStorage.getItem("uid")}`);
        if (await response.ok) {
          const data = await response.json();
          if (data.isAdmin) {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkAdmin();
  }, []);

  function handleLogoutClick(e) {
    e.preventDefault();
    setShowLogoutConfirmation(true);
  }

  function handleLogoutConfirm() {
    sessionStorage.clear();
    setShowLogoutConfirmation(false);
    navigate('/');
  }

  function handleLogoutCancel() {
    setShowLogoutConfirmation(false);
  }

  return (
    <>
      <nav
        id="side-bar"
        className={isSidebarOpen ? "expanded" : "collapsed"}
        role="navigation"
      >
        <Link to="/event-calendar" className="sidebar-item">
          <Event className="sidebar-icon" />
          {isSidebarOpen && <p>Event Calendar</p>}
        </Link>
        <Link to="/ticket-history" className="sidebar-item">
          <History className="sidebar-icon" />
          {isSidebarOpen && <p>Ticket History</p>}
        </Link>
        <Link to="/post-event" className="sidebar-item">
          <PostAdd className="sidebar-icon" />
          {isSidebarOpen && <p>Post Event</p>}
        </Link>
        <Link to="/event-history" className="sidebar-item">
          <EventAvailable className="sidebar-icon" />
          {isSidebarOpen && <p>Event History</p>}
        </Link>
        {isAdmin && (
          <Link to="/approve-events" className="sidebar-item">
            <CheckCircle className="sidebar-icon" />
            {isSidebarOpen && <p>Approve Events</p>}
          </Link>
        )}
        <Link to="/" className="sidebar-item" onClick={handleLogoutClick}>
          <LogoutIcon className="sidebar-icon" />
          {isSidebarOpen && <p>Logout</p>}
        </Link>
      </nav>

      {showLogoutConfirmation && (
        <div className="logout-confirmation-overlay">
          <div className="logout-confirmation-modal">
            <p>Are you sure you want to logout?</p>
            <div className="logout-confirmation-buttons">
              <button onClick={handleLogoutConfirm}>Yes</button>
              <button onClick={handleLogoutCancel}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SideBar;
