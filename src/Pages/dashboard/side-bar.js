import React from "react";
import { Link } from "react-router-dom";
import { Event, History, PostAdd, EventAvailable, CheckCircle } from "@mui/icons-material"; // Import MUI icons
import './side-bar.css'; // CSS for styling

function SideBar({ isSidebarOpen }) {
  return (
    <nav id="side-bar" className={isSidebarOpen ? 'expanded' : 'collapsed'} role="navigation">
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
      <Link to="/approve-events" className="sidebar-item">
        <CheckCircle className="sidebar-icon" />
        {isSidebarOpen && <p>Approve Events</p>}
      </Link>
    </nav>
  );
}

export default SideBar;
