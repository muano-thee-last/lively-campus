import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";

import Dashboard from "./Pages/dashboard/dashboard";

// Define the App component
function App() {
  return (
    // Top-level Router component
    <Router>
      <Routes>
        <Route path="*" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

// Export the App component as the default export
export default App;
