import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import VerifyEmail from "./Pages/Login/verifyEmail";
import Dashboard from "./Pages/dashboard/dashboard";
import Calendar from "./Pages/Calendar/Calendar";
import Notifications from './Pages/Notifications/NotificationsDashboard';
import EventCreation from "./Pages/EventCreation/EventCreation";
import Profile from "./Pages/Profile/Profile";
import ViewMoreDetails from "./Pages/ViewMoreDetails/ViewMoreDetails";
import EventManagement from "./Pages/eventManagement/eventManagement";
import TicketVerification from "./Pages/TicketVerification/ticketVerification";
import TicketHistory from "./Pages/TicketHistory/ticketHistory";
import EventHistory from "./Pages/EventHistory/EventHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/post-event" element={<EventCreation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/event-calendar" element={<Calendar />} />
        <Route path="/details/:id" element={<ViewMoreDetails />} /> {/* Add this line */}
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/eventManagement" element={<EventManagement/>} />
        <Route path="/ticketVerification" element={<TicketVerification/>} />
        <Route path="/ticket-history" element={<TicketHistory/>} />
        <Route path="/event-history" element={<EventHistory/>} />

      </Routes>
    </Router>
  );
}

export default App;
