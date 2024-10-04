import React, { useState, useEffect } from 'react';
import TicketView from './ticketView'; // Adjust the import path as needed
import './TicketHistory.css'; // Import the CSS file
import Header from "../dashboard/header";
import Footer from '../dashboard/footer';
import SideBar from '../dashboard/side-bar';

// If you need an icon, consider using an alternative library or SVG
// For example, using Heroicons:
import { TicketIcon } from '@heroicons/react/outline'; // Install @heroicons/react if not already

const NoTicketsMessage = () => (
  <div className="no-tickets-card w-full max-w-md mx-auto mt-8 p-6 bg-white shadow rounded">
    <div className="no-tickets-header">
      <h2 className="text-2xl font-bold text-center">No Tickets Yet</h2>
      <p className="text-center text-gray-600">
        You haven't purchased any tickets yet. Start exploring events!
      </p>
    </div>
    <div className="no-tickets-content flex flex-col items-center mt-4">
      {/* Replace Ticket icon with Heroicons or another alternative */}
      <TicketIcon className="w-24 h-24 text-gray-400 mb-4" />
      <button
        className="browse-events-button w-full max-w-xs px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => {
          // Define what happens when the button is clicked
          // For example, navigate to the events page
          window.location.href = '/events'; // Adjust the URL as needed
        }}
      >
        Browse Events
      </button>
    </div>
  </div>
);

function TicketHistory() {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
        console.log("the data is", data);
        setTicketDetails(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const validTickets = ticketDetails.filter(ticket => ticket.eventTitle !== 'Title not found');
  console.log(validTickets);

  return (
    <div id="main-footer-separator">
      <div id="dashboard">
        <Header toggleSidebar={toggleSidebar} />
        <div id="content">
          <SideBar isSidebarOpen={isSidebarOpen} />
          <div className="ticket-history">
            {validTickets.length > 0 ? (
              validTickets.map(ticket => (
                <div key={ticket.id} className="ticket-view-wrapper mb-4">
                  <TicketView
                    eventName={ticket.eventTitle || 'N/A'}
                    ticketPrice={ticket.price}
                    purchaseDate={ticket.purchaseDate}
                    ticketCode={ticket.ticketCode}
                    venue={ticket.venue}
                    time={ticket.time}
                    date={ticket.date}
                    imageUrl={ticket.imageUrl}
                  />
                </div>
              ))
            ) : (
              <NoTicketsMessage />
            )}
            {error && (
              <div className="error-message text-red-500 text-center mt-4">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TicketHistory;
