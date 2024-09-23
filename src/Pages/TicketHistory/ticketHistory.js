import React, { useState, useEffect } from 'react';
import TicketView from './ticketView'; // Adjust the import path as needed
import './TicketHistory.css'; // Import the CSS file
import Header from "../dashboard/header";
import Footer from '../dashboard/footer';
import SideBar from '../dashboard/side-bar';

function TicketHistory() {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Handle sidebar state

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const userID = sessionStorage.getItem('uid');

    fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/getTicketsx/${userID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTicketDetails(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter tickets to exclude those with "Title not found"
  const validTickets = ticketDetails.filter(ticket => ticket.eventTitle !== 'Title not found');

  // Current date for comparison
  const currentDate = new Date();

  // Separate tickets based on whether the event date has passed
  const upcomingTickets = validTickets.filter(ticket => new Date(ticket.purchaseDate) > currentDate);
  const usedTickets = validTickets.filter(ticket => new Date(ticket.purchaseDate) <= currentDate);

  return (
    <div id="main-footer-separator">
      <div id="dashboard">
        <Header toggleSidebar={toggleSidebar} /> {/* Header with sidebar toggle */}
        <div id="content">
          <SideBar isSidebarOpen={isSidebarOpen} /> {/* Sidebar */}
          <div className="ticket-history">
            {/* Display upcoming tickets */}
            <h2> Tickets</h2>
            {upcomingTickets.length > 0 ? (
              upcomingTickets.map(ticket => (
                <div key={ticket.id} className="ticket-item upcoming-ticket">
                  <TicketView
                    eventName={ticket.eventTitle || 'N/A'}
                    ticketPrice={ticket.price}
                    purchaseDate={ticket.purchaseDate}
                    ticketCode={ticket.ticketCode}
                  />
                </div>
              ))
            ) : (
              <p>No new tickets</p>
            )}

            {/* Display used tickets */}
            <h2>Used Tickets</h2>
            {usedTickets.length > 0 ? (
              usedTickets.map(ticket => (
                <div key={ticket.id} className="ticket-item used-ticket">
                  <TicketView
                    eventName={ticket.eventTitle || 'N/A'}
                    ticketPrice={ticket.price}
                    purchaseDate={ticket.purchaseDate}
                    ticketCode={ticket.ticketCode}
                  />
                </div>
              ))
            ) : (
              <p>No used tickets</p>
            )}
          </div>
        </div>
      </div>
      <Footer /> {/* Footer at the bottom */}
    </div>
  );
}

export default TicketHistory;
