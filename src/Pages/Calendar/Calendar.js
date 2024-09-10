import React,{useState} from 'react';
import Header from '../dashboard/header'; // Adjust the path
import SideBar from '../dashboard/side-bar'; // Adjust the path
import MainContent from './MainContent';
import './Calendar.css';



function Calendar(){
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
    return(
      <div id='main-footer-separator'>
        <div id='calendar'>
      <Header toggleSidebar={toggleSidebar}/>
       <div id='content'>
          <SideBar isSidebarOpen={isSidebarOpen}/>
        <MainContent/>
   
       </div>
      </div>
      </div>
      
    )
    
}
export default Calendar;