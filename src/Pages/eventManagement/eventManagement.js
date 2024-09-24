import React,{useState} from 'react';
import ManagementHeader from "./managementheader";
import Footer from "../dashboard/footer";
import SideBar from "../dashboard/side-bar";
import EventManagementMainContent from "./event-management-main-content";
import './eventManagement.css';


function EventManagement(){
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
    return(
      <div id='main-footer-separator'>
        <div id='eventManagement'>
      <ManagementHeader toggleSidebar={toggleSidebar}/>
       <div id='content'>
          <SideBar isSidebarOpen={isSidebarOpen}/>
        <EventManagementMainContent/>
   
       </div>
      </div>
      <Footer/>
      </div>
      
    )
    
}
export default EventManagement;