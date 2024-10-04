import React, { useState } from 'react';
import Header from "./header";
import Footer from "./footer";
import SideBar from "./side-bar"
import MainContent from "./main-content";
import './dashboard.css';

function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
 
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div id='main-footer-separator'>
      <div id='dashboard'>
        <Header toggleSidebar={toggleSidebar} onSearch={handleSearch} />
        <div id='content'>
          <SideBar isSidebarOpen={isSidebarOpen} />
          <MainContent searchQuery={searchQuery} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;