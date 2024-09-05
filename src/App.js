import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import VerifyEmail from "./Pages/Login/verifyEmail";
import Dashboard from "./Pages/dashboard/dashboard";

import EventCreation from "./Pages/EventCreation/EventCreation";
import Profile from "./Pages/Profile/Profile";
import "./App.css"

import ViewMoreDetails from "./Pages/ViewMoreDetails/ViewMoreDetails"; // Import the new component


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/post-event" element={<EventCreation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/details/:id" element={<ViewMoreDetails />} /> {/* Add this line */}

      </Routes>
    </Router>
  );
}

export default App;
