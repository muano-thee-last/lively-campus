import React, { useState, useEffect } from "react";
import TicketView from "./ticketView"; 
import "./TicketHistory.css"; 
import Header from "../dashboard/header";
import Footer from "../dashboard/footer";
import SideBar from "../dashboard/side-bar";

export default function TicketHistory() {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const userID = sessionStorage.getItem("uid");

    fetch(
      `https://us-central1-witslivelycampus.cloudfunctions.net/app/getTicketsx/${userID}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTicketDetails(data);
        setIsLoading(false); 
      })
      .catch((error) => {
        setError("No tickets");
        setIsLoading(false); 
      });
  }, []);

  const validTickets = ticketDetails.filter(
    (ticket) => ticket.eventTitle !== "Title not found"
  );

  return (
    <div id="main-footer-separator">
      <div id="dashboard">
        <Header toggleSidebar={toggleSidebar} />
        <div id="content">
          <SideBar isSidebarOpen={isSidebarOpen} />
          <div id="content-wrapper">
            <h1 className="heading">Ticket History</h1>
            <div className="ticket-history">
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading tickets...</p>
                </div>
              ) : error ? (
                <div className="error-message">Error: {error}</div>
              ) : validTickets.length > 0 ? (
                validTickets.map((ticket) => (
                  <div key={ticket.id}>
                    <TicketView
                      eventName={ticket.eventTitle || "N/A"}
                      ticketPrice={ticket.price}
                      purchaseDate={ticket.purchaseDate}
                      ticketCode={ticket.ticketCode}
                      venue={ticket.venue}
                      time={ticket.time}
                      date={ticket.date}
                      imageUrl={ticket.imageUrl}
                      eventID={ticket.eventId}
                    />
                  </div>
                ))
              ) : (
                <div className="no-tickets-container">
                  <h2 className="no-tickets-heading">No tickets bought yet</h2>
                  <p className="no-tickets-message">Your purchased tickets will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}