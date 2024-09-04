import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import VerifyEmail from "./Pages/Login/verifyEmail";
import Dashboard from "./Pages/dashboard/dashboard";
import Notifications from './Pages/Notifications/Notifications';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
<<<<<<< HEAD
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/Notifications" element={<Notifications/> } />
=======
      <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

>>>>>>> 14248faded82bc3edd01fae5467a2e7774420170
      </Routes>
    </Router>
  );
}

// Export the App component as the default export
export default App;
