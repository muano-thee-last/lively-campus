import React,{useState} from 'react';
import Header from "../dashboard/header";
import Footer from "../dashboard/footer";
import SideBar from "../dashboard/side-bar";
import '../dashboard/dashboard.css';
import Notifications from './Notifications';

function NotificationsDashboard(){
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return(
    <div id='main-footer-separator'>
      <div id='dashboard'>
        <Header toggleSidebar={toggleSidebar} />
        <div id='content'>
          <SideBar isSidebarOpen={isSidebarOpen} />
          <div className="dashboard-main-content">
            <Notifications />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NotificationsDashboard;