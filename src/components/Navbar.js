import React from "react";
import "../App.css";
import logo from '../images-logos/logo.png';
import notifications from '../images-logos/notification-logo.jpeg';
import profile from "../images-logos/profile-logo.jpg";

function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        <img src={logo} alt="Lively Campus Logo" height={50}/>
        <p href="#">Lively Campus</p>
      </div>
      <input type="text" placeholder="Search" />
      <div className="profile">
        <img src={notifications} alt="Notifications" height={40} />
        <img src={profile} height={30} alt="Profile" />
      </div>
    </header>
  );
}

export default Navbar;