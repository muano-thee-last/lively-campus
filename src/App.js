import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import VerifyEmail from "./Pages/Login/verifyEmail";
import Dashboard from "./Pages/dashboard/dashboard";


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

      </Routes>
    </Router>
  );
}

// Export the App component as the default export
export default App;