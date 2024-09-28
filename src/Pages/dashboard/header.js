import React, { useState, useEffect } from "react";
import hamburger from "./images-logos/hamburger.jpg";
import { useNavigate } from "react-router-dom";
import logo from "./images-logos/logo.png";
import profile from "./images-logos/profile-logo.jpg";
import notifications from "./images-logos/notification-logo.jpeg";
import "./header.css";
function Header({ toggleSidebar }) {
  const [showFilters] = useState(false);
  const navigate = useNavigate();

  const handleNotificationsClick = () => {
    navigate("/Notifications");
  };

  const handleDashboardNavigation = () => {
    navigate("/dashboard");
  };

  const [pictureUrl, setPictureUrl] = useState("");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const getPictureUrl = () => {
      setPictureUrl(user.photoURL);
    };
    getPictureUrl();
  }, [pictureUrl]);

  return (
    <div id="header">
      <section className="header-right-section">
        <img
          className="hamburger-logo pointer pointer"
          src={hamburger}
          alt="Menu"
          onClick={toggleSidebar}
        />
        <img
          className="lively-campus-logo pointer"
          src={logo}
          alt="Livelycampus Logo"
          onClick={handleDashboardNavigation}
        />
        <h4 onClick={handleDashboardNavigation} className="pointer">Livelycampus</h4>
      </section>
      <section className="header-middle-section">
        <input
          type="text"
          className="search"
          placeholder="Search"
          //onClick={handleSearchClick} // Show filters on click
        />
        <button className="search-button">
          {/* Add content or icon for the search button */}
        </button>
        {showFilters && (
          <div className="filter-options">
            <h4>Filter by:</h4>
            <div className="filter-option">
              <label>Location:</label>
              <select>
                <option value="all">All</option>
                <option value="location1">Location 1</option>
                <option value="location2">Location 2</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="filter-option">
              <label>Type:</label>
              <select>
                <option value="all">All</option>
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>
        )}
      </section>
      <section className="header-left-section">
        <img
          id="notifications"
          className="lively-campus-notifications pointer"
          src={notifications}
          alt="Notifications"
          onClick={handleNotificationsClick}
        />
        <img
          className="lively-campus-profile pointer"
          src={pictureUrl ? pictureUrl : profile}
          style={pictureUrl ? { borderRadius: 50 } : {}}
          alt="Profile"
          onClick={() => navigate("/profile")}
        />
      </section>
    </div>
  );
}
export default Header;
