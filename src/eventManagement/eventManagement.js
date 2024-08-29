import React,{useState} from 'react';
import Header from "./header";
import Footer from "./footer";
import SideBar from "./side-bar";
import MainContent from "./main-content";
import './eventManagement.css';


function EventManagement(){
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
    return(
      <div id='main-footer-separator'>
        <div id='eventManagement'>
      <Header toggleSidebar={toggleSidebar}/>
       <div id='content'>
          <SideBar isSidebarOpen={isSidebarOpen}/>
        <MainContent/>
   
       </div>
      </div>
      <Footer/>
      </div>
      
    )
    
}
export default EventManagement;