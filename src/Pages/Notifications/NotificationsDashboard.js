import React,{useState} from 'react';
import Header from "./header";
import Footer from "./footer";
import SideBar from "./side-bar"
import './dashboard.css';
import Notifications from './Notifications';

function NotificationsDashboard(){
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
    return(
      <div id='main-footer-separator'>
        <div id='dashboard'>
          <Header toggleSidebar={toggleSidebar}/>
          <div id='content'>
            <SideBar isSidebarOpen={isSidebarOpen}/>
            <Notifications />
          </div>
        </div>
        <Footer/>
      </div>
    )
}
export default NotificationsDashboard;