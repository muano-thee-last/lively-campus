import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from "./dashboard/dashboard";

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard'); 
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, World!</h1>
        <button onClick={handleClick}>Login</button>
      </header>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </Router>
  );
}
