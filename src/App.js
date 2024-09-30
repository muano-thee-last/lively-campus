import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import VerifyEmail from "./Pages/Login/verifyEmail";
import dashboard from "./Pages/dashboard/dashboard";
import Calendar from "./Pages/Calendar/Calendar";
import Notifications from './Pages/Notifications/NotificationsDashboard';
import EventCreation from "./Pages/EventCreation/EventCreation";
import Profile from "./Pages/Profile/Profile";
import ViewMoreDetails from "./Pages/ViewMoreDetails/ViewMoreDetails";
import EventManagement from "./Pages/eventManagement/eventManagement";
import TicketVerification from "./Pages/TicketVerification/ticketVerification";
import TicketHistory from "./Pages/TicketHistory/ticketHistory";
import EventHistory from "./Pages/EventHistory/EventHistory";
import About from "./Pages/About/About";
import BuyTicket from "./Pages/BuyTickets/purchase";
import ApproveEventsPage from "./Pages/EventAproval/ApproveEventsPage";
import SuccessPage from "./Pages/BuyTickets/onSuccess";
import FailurePage from "./Pages/BuyTickets/onFailure";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/post-event" element={<EventCreation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<dashboard />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/event-calendar" element={<Calendar />} />
        <Route path="/view-more-details/:id" element={<ViewMoreDetails />} /> {/* Add this line */}
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/eventManagement" element={<EventManagement/>} />
        <Route path="/ticketVerification" element={<TicketVerification/>} />
        <Route path="/ticket-history" element={<TicketHistory/>} />
        <Route path="/event-history" element={<EventHistory/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/buyTicket" element={<BuyTicket/>} />
        <Route path="/approve-events" element={<ApproveEventsPage/>} />
        <Route path="/payment/success" element={<SuccessPage />} />
        <Route path="/payment/failure" element={<FailurePage />} />
      </Routes>
    </Router>
  );
}

export default App;
