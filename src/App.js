import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Home from "./Pages/Home/Home";
import VerifyEmail from "./Pages/Login/verifyEmail";
// Define the App component
function App() {
  return (
    // Top-level Router component
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

      </Routes>
    </Router>
  );
}

// Export the App component as the default export
export default App;