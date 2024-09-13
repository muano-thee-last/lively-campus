import React, { useState } from 'react';
import Header from '../dashboard/header'; // Adjust the path
import SideBar from '../dashboard/side-bar'; // Adjust the path
import EventDetails from './EventDetails'; // Adjust the path
//import './ViewMoreDetails.css';

function ViewMoreDetails() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div id='main-footer-separator'>
      <div id='ViewMoreDetails'>
        <Header toggleSidebar={toggleSidebar} />
        <div id='content'>
          <SideBar isSidebarOpen={isSidebarOpen} />
          <EventDetails />
        </div>
      </div>
    </div>
  );
}

export default ViewMoreDetails;
