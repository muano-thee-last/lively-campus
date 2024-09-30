import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../dashboard/header'; // Adjust the path
import SideBar from '../dashboard/side-bar'; // Adjust the path
import EventDetails from './EventDetails'; // Adjust the path
import { render, screen, waitFor, act } from '@testing-library/react';
//import './ViewMoreDetails.css';

function ViewMoreDetails() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div data-testid="main-footer-separator">
      <div id="ViewMoreDetails" data-testid="ViewMoreDetails">
        <Header toggleSidebar={toggleSidebar} />
        <div id="content" data-testid="content">
          <SideBar isSidebarOpen={isSidebarOpen} />
          <div data-testid="event-details">
            <EventDetails id={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewMoreDetails;
