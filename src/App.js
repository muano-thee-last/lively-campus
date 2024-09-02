import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EventsManagement from "./eventManagement/eventManagement"; // adjust the path if needed

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Hello, World!</h1>
          <Link to="/events">
            <button>Login</button>
          </Link>
        </header>
        <Routes>
          <Route path="/events" element={<EventsManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

