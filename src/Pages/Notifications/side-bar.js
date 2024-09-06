import React from 'react';
import calender from './images-logos/event-calender.png';
import ticketlogo from './images-logos/ticket-history.png';
import postlogo from './images-logos/post-event.jpg';
import eventhistory from './images-logos/event-history.png';
import './side-bar.css';

import { Link } from 'react-router-dom';

function SideBar({ isSidebarOpen }) {
  return (
    <nav id='side-bar' className={isSidebarOpen ? 'expanded' : 'collapsed'} role="navigation">
      <Link to='/event-calendar' className='sidebar-logos'>
        <img className='event-ticket-logos' src={calender} alt="Event Calendar" />
        {isSidebarOpen && <p>Event Calendar</p>}
      </Link>
      <Link to='/ticket-history' className='sidebar-logos'>
        <img className='event-ticket-logos' src={ticketlogo} alt="Ticket History" />
        {isSidebarOpen && <p>Ticket History</p>}
      </Link>
      <Link to='/post-event' className='sidebar-logos'>
        <img className='post-history-logos' src={postlogo} alt="Post Event" />
        {isSidebarOpen && <p>Post Event</p>}
      </Link>
      <Link to='/event-history' className='sidebar-logos'>
        <img className='history-logos' src={eventhistory} alt="Event History" />
        {isSidebarOpen && <p>Event History</p>}
      </Link>
    </nav>
  );
}


export default SideBar;
