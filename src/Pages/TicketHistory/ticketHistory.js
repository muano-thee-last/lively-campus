import React, { useState, useEffect } from 'react';
import TicketView from './ticketView'; // Adjust the import path as needed
import './TicketHistory.css'; // Import the CSS file
import Header from "../dashboard/header";
import Footer from '../dashboard/footer';
import SideBar from '../dashboard/side-bar';
import { Ticket } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NoTicketsMessage = () => (
  <Card className="w-full max-w-md mx-auto mt-8">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-center">No Tickets Yet</CardTitle>
      <CardDescription className="text-center">
        You haven't purchased any tickets yet. Start exploring events!
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col items-center">
      <Ticket className="w-24 h-24 text-gray-400 mb-4" />
      <Button className="w-full max-w-xs">
        Browse Events
      </Button>
    </CardContent>
  </Card>
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
                <div key={ticket.id}>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TicketHistory;
