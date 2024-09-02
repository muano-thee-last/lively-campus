import React from 'react';
import calender from './images-logos/event-calender.png';
import ticketlogo from './images-logos/ticket-history.png';
import postlogo from './images-logos/post-event.jpg';
import eventhistory from './images-logos/event-history.png';
import './side-bar.css';

function SideBar({ isSidebarOpen }) {
  return (
    <nav id='side-bar' className={isSidebarOpen ? 'expanded' : 'collapsed'} role="navigation">
      <a className='sidebar-logos' role='link'>
        <img className='event-ticket-logos' src={calender} alt="Event Calendar" />
        {isSidebarOpen && <p>Event Calendar</p>}
      </a>
      <a className='sidebar-logos' role='link'>
        <img className='event-ticket-logos' src={ticketlogo} alt="Ticket History" />
        {isSidebarOpen && <p>Ticket History</p>}
      </a>
      <a className='sidebar-logos' role='link'>
        <img className='post-history-logos' src={postlogo} alt="Post Event" />
        {isSidebarOpen && <p>Post Event</p>}
      </a>
      <a className='sidebar-logos' role='link'>
        <img className='history-logos' src={eventhistory} alt="Event History" />
        {isSidebarOpen && <p>Event History</p>}
      </a>
    </nav>
  );
}


export default SideBar;
