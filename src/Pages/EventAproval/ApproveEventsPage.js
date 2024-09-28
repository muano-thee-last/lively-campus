import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../dashboard/header'; // Adjust the path
import SideBar from '../dashboard/side-bar'; // Adjust the path
import ApproveEvents from './ApproveEvents';

function ApproveEventsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div id='main-footer-separator'>
      <div>
        <Header toggleSidebar={toggleSidebar} />
        <div id='content'>
          <SideBar isSidebarOpen={isSidebarOpen} />
          <ApproveEvents id={id} />
        </div>
      </div>
    </div>
  );
}

export default ApproveEventsPage;