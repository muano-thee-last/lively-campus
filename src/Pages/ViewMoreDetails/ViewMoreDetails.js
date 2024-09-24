import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../dashboard/header'; // Adjust the path
import SideBar from '../dashboard/side-bar'; // Adjust the path
import EventDetails from './EventDetails'; // Adjust the path
//import './ViewMoreDetails.css';

function ViewMoreDetails() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div id='main-footer-separator'>
      <div id='ViewMoreDetails'>
        <Header toggleSidebar={toggleSidebar} />
        <div id='content'>
          <SideBar isSidebarOpen={isSidebarOpen} />
          <EventDetails id={id} />
        </div>
      </div>
    </div>
  );
}

export default ViewMoreDetails;
